'use strict';

const dialog = require('electron').remote.dialog;
const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const mkdirp = require('mkdirp');
const uuidv4 = require('uuid/v4');

const config = require('../config/config');

const Book = require('../models/book');
const Category = require('../models/category');

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
    booksRating: 'rating',
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
        let book;

        for (const formId in oldFormData) {
            const newKey = bookFormMap[formId];
            formData[newKey] = oldFormData[formId];
        }

        if (id === '') {
            book = await Book.create(formData);
            this.id = book.id;
        }
        else {
            await Book.update(formData, {where: {id: id}});
        }

        return this.id;
    }

    async delete() {
        await Book.destroy({where: {id: this.id}});
    }

    async render() {
        const categories = await Category.getAllSorted();

        let book;

        if (this.id) {
            book = await Book.findById(this.id);

            if (book.bookcover)
                book.bookcoverPath = path.join(config.bookcovers.path, book.bookcover);

            if (book.tags)
                book.tagArray = book.tags.split(',');

            if (book.categories) {
                const ids = book.categories.split(',');
                const categoryNames = {};

                for (const id of ids) {
                    const category = await Category.findById(id);
                    categoryNames[id] = category.name;
                }

                book.categoryNames = categoryNames;
            }
        }

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

    async renderRatingStars() {
        // const fullClass = 'full';
        const emptyClass = 'empty';
        const classes = [emptyClass, emptyClass, emptyClass, emptyClass, emptyClass];

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/ratingStars.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                firstClass: classes[0],
                secondClass: classes[1],
                thirdClass: classes[2],
                fourthClass: classes[3],
                fifthClass: classes[4]
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

    static async renderTagCategoryBadge(tag, deleteId, typeClass) {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/tagCategoryBadge.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                tag,
                deleteId,
                typeClass
            });
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

    async afterRender() {
        $('#bookFormWrapper').addClass('form-displayed');

        const renderedStars = await this.renderRatingStars();
        $('#ratingStarsAnchor').html(renderedStars);
    }
}

module.exports = BookForm;
