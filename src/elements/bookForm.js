'use strict';

const dialog = require('electron').remote.dialog;
const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const mkdirp = require('mkdirp');
const uuidv4 = require('uuid/v4');
const request = require('request');

const config = require('../config/config');

const Book = require('../models/book');
const Category = require('../models/category');

const dummyDate = '1887-09-16';

const bookFormMap = {
    bookBookcoverId: 'id',
    bookTitle: 'title',
    bookAuthor: 'author',
    bookGenre: 'genre',
    bookDateRead: 'dateRead',
    bookNotReadYet: 'notReadYet',
    bookNumberOfPages: 'pageCount',
    bookColor: 'color',
    bookBookcoverFileName: 'bookcover',
    bookPublisher: 'publisher',
    bookIsbn: 'isbn',
    bookYearPublished: 'yearPublished',
    bookNationality: 'nationality',
    bookLanguageReadIn: 'languageReadIn',
    bookOriginalLanguage: 'originalLanguage',
    bookTranslator: 'translator',
    bookTagsHidden: 'tags',
    bookCategoriesHidden: 'categories',
    bookRating: 'rating',
    bookSummary: 'summary',
    bookCommentary: 'commentary'
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
            formData[newKey] = oldFormData[formId];
        }

        if (formData.dateRead === '')
            formData.dateRead = new Date(dummyDate);

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
        let book = [];

        if (this.id) {
            book = await Book.findById(this.id);

            if (book.bookcover)
                book.bookcoverPath = path.join(config.bookcovers.path, book.bookcover);

            if (book.tags)
                book.tagArray = book.tags.split(',');

            if (book.categories) {
                const ids = book.categories.split(',');
                const categoryBadges = {};

                for (const id of ids) {
                    const category = await Category.findById(id);
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

            if (book.dateRead === dummyDate)
                book.dateRead = '';
        }

        book.ratingClasses = ratingClasses;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                book,
                categories
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async renderCategories() {
        const categories = await Category.getAllSorted();

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/categories.njk');

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
            const template = path.join(__dirname, '../templates/bookForm/tagCategoryBadge.njk');

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

            mkdirp(bookcoverConfig.path);

            if (bookcoverExtensions.indexOf(extension) <= -1) {
                const extensionsString = bookcoverExtensions.join(', ');
                const error = 'The bookcover must be an image';
                dialog.showErrorBox(error, `The file you chose is not an image. It must have one of the following file extensions: ${extensionsString}.`);
                reject(error);
                return;
            }

            fs.copyFile(imagePath, newImagePath, error => {
                if (error) reject(error);
                resolve({
                    fileName: newFileName,
                    filePath: newImagePath
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

    async afterRender() {
        $('#bookFormWrapper').addClass('form-displayed');
    }

    static async fetchBookInfo(isbn) {
        let url = config.bookInfo.google.url;
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
}

module.exports = BookForm;
