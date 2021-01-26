'use strict';

const {remote} = require('electron');
const dialog = remote.dialog;
const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const request = require('request');
const TinyDatePicker = require('tiny-date-picker');
const moment = require('moment');
const ColorThief = require('colorthief');

const nunjucks = require('../nunjucks');
const config = require('../config').default;
const BooksByAuthor = require('../elements/modal/booksByAuthor');
const bookcoverHelper = require('../lib/bookcover');
const bookFormats = require('../lib/bookFormats');
const readingStatuses = require('../lib/readingStatuses');

const Book = require('../models/book');
const Category = require('../models/category');

const bookFormMap = {
    bookBookcoverId: 'id',
    bookTitle: 'title',
    bookAuthor: 'author',
    bookEditor: 'editor',
    bookGenre: 'genre',
    bookDateStarted: 'dateStarted',
    bookDateRead: 'dateRead',
    bookReadingStatus: 'status',
    bookOnWishlist: 'onWishlist',
    bookNumberOfPages: 'pageCount',
    bookColor: 'color',
    bookBookcoverFileName: 'bookcover',
    bookPublisher: 'publisher',
    bookIsbn: 'isbn',
    bookYearPublished: 'yearPublished',
    bookBookFormat: 'bookFormat',
    bookNationality: 'nationality',
    bookLanguageReadIn: 'languageReadIn',
    bookOriginalLanguage: 'originalLanguage',
    bookTranslator: 'translator',
    bookTagsHidden: 'tags',
    bookCategoriesHidden: 'categories',
    bookRating: 'rating',
    bookSummary: 'summary',
    bookCommentary: 'commentary',
    bookNotes: 'notes'
};


class BookForm {
    constructor(id) {
        this.id = id;
    }

    async save(oldFormData) {
        const formData = {};
        const id = this.id;
        let book = {};

        for (const formId in oldFormData) {
            const newKey = bookFormMap[formId];
            const value = oldFormData[formId];

            formData[newKey] = (value === '' && (newKey === 'dateRead' || newKey === 'dateStarted'))
                ? null
                : value;
        }

        try {
            if (id === '') {
                book = await Book.create(formData);
                this.id = book.id;
            }
            else {
                await Book.update(formData, { where: {id: id} });
            }
        }
        catch(error) {
            console.error(error);
        }

        return this.id;
    }

    async delete() {
        await Book.destroy({where: {id: this.id}});
    }

    async render() {
        const categories = await Category.getAllSorted();
        let ratingClasses = ['empty', 'empty', 'empty', 'empty', 'empty'];
        let book = {};

        if (this.id) {
            book = await Book.findByPk(this.id, { raw: true });

            if (book.bookcover)
                book.bookcoverPath = bookcoverHelper.pruneCoverPath(book.bookcover);

            if (book.dateStarted)
                book.dateStarted = this.formatDate(book.dateStarted);

            if (book.dateRead)
                book.dateRead = this.formatDate(book.dateRead);

            if (book.tags)
                book.tagArray = book.tags.split(',');

            if (book.categories) {
                const ids = book.categories.split(',');
                const categoryBadges = {};

                for (const id of ids) {
                    const category = await Category.findByPk(id);
                    categoryBadges[id] = {
                        name: category.name,
                        color: category.color
                    };
                }

                book.categoryBadges = categoryBadges;
            }

            if (book.rating) {
                ratingClasses = ratingClasses.map((element, index) => {
                    const index1 = index + 1;
                    return (index1 <= book.rating) ? 'full' : element;
                });
            }
        }

        book.ratingClasses = ratingClasses;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/bookForm.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                book,
                categories,
                bookFormats,
                readingStatuses
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async renderCategories() {
        const categories = await Category.getAllSorted();

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/bookForm/categories.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                categories
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async renderTagCategoryBadge(tag, deleteId, typeClass, color = '') {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/bookForm/tagCategoryBadge.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            const values = {
                tag,
                deleteId,
                typeClass
            };

            if (typeClass === 'category') values.category = { color };

            return nunjucks.renderString(templateString, values);
        }).catch(error => {
            console.error(error);
        });
    }

    static async saveBookcover(imagePath) {
        const bookcoverConfig = config.bookcovers;
        const bookcoverExtensions = bookcoverConfig.extensions;
        const extension = path.extname(imagePath).replace('.', '').toLowerCase();

        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            const newFileName = `${uuid}.${extension}`;
            const newImagePath = path.join(bookcoverConfig.path, newFileName);

            fs.mkdir(bookcoverConfig.path, { recursive: true }, error => {
                if (error) {
                    console.error(error);
                }

                if (bookcoverExtensions.indexOf(extension) <= -1) {
                    const extensionsString = bookcoverExtensions.join(', ');
                    const error = 'The bookcover must be an image';
                    dialog.showErrorBox(error, `The file you chose is not an image. It must have one of the following file extensions: ${extensionsString}.`);
                    reject(error);
                    return;
                }

                fs.copyFile(imagePath, newImagePath, async error => {
                    if (error) reject(error);
                    resolve({
                        fileName: newFileName,
                        filePath: bookcoverHelper.pruneCoverPath(newFileName)
                    });
                });
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async deleteBookcover(fileName) {
        const bookcoverConfig = config.bookcovers;

        return new Promise((resolve, reject) => {
            const imagePath = path.join(bookcoverConfig.path, fileName);

            fs.unlink(imagePath, error => {
                if (error) reject(error);
                resolve();
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async getPrimaryBookcoverColor(filePath) {
        try {
            const rgbColor = await ColorThief.getColor(filePath);

            const hexColor = '#' + rgbColor.map(color => {
                const hex = color.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');

            return hexColor;
        }
        catch(error) {
            console.error(error);
        }
    }

    async afterRender() {
        const $wrapper = $('#bookFormWrapper');

        if (!$wrapper.hasClass('form-displayed')) {
            setTimeout(() => {
                $wrapper.addClass('form-displayed');
            }, 100);
        }

        const datePickerOptions = {
            format(date) {
                return date.toLocaleDateString();
            },
            parse(string) {
                if (string !== '') {
                    const date = moment(string, 'L', window.navigator.languages);
                    date.format('YYYY-MM-DD');
                    return date.toDate();
                }

                return new Date();
            },
            mode: 'dp-below'
        };

        const dateStarted = document.getElementById('bookDateStarted');
        TinyDatePicker(dateStarted, datePickerOptions);

        const dateRead = document.getElementById('bookDateRead');
        TinyDatePicker(dateRead, datePickerOptions);

        const authors = $('#bookAuthor').val();
        const booksByAuthor = new BooksByAuthor(authors);
        booksByAuthor.fetchBooks();
    }

    static async fetchBookInfo(isbn) {
        let url = config.bookInfo.google.urlIsbn;
        url = url.replace('${isbn}', isbn);

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) reject(error);

                try {
                    resolve(JSON.parse(body));
                }
                catch(error) {
                    reject(error);
                }
            });
        }).catch(error => {
            console.error(error);
        });
    }

    formatDate(date) {
        if (date !== 'Invalid date') {
            const dateObj = new Date(date);
            return date !== 'Invalid date' ? dateObj.toLocaleDateString() : '';
        }

        return '';
    }
}

module.exports = BookForm;
