'use strict';

const dialog = require('electron').remote.dialog;
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
    constructor(formData) {
        const newFormData = {};

        for (const formId in formData) {
            const newKey = bookFormMap[formId];
            newFormData[newKey] = formData[formId];
        }

        this.formData = newFormData;
        this.id = newFormData.id;
    }

    async save() {
        const formData = this.formData;
        const id = this.id;
        let book;

        if (id === '') {
            book = await Book.create(formData);
            this.id = book.id;
        }
        else {
            await Book.update(formData, {where: {id: id}});
        }

        return this.id;
    }

    async render() {
        const categories = await Category.getAllSorted();

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm.njk');

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
}

module.exports = BookForm;
