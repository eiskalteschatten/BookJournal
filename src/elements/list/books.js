'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const List = require('../list');
const Book = require('../../models/book');
const BookListElement = require('../../elements/listElement/book');


class Books extends List {
    constructor(query = '') {
        super();
        this.query = query;
    }

    async render() {
        const listElements = [];

        return new Promise((resolve, reject) => {
            for (const element of this.elements) {
                listElements.push(element.getNunjucksRenderObject());
            }

            const template = path.join(__dirname, '../../templates/elements/list/books.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {listElements});
        }).catch(error => {
            console.error(error);
        });
    }

    addBookElement(book) {
        const element = new BookListElement(book);
        this.elements.push(element);
    }

    async loadBooks() {
        const books = this.query
            ? await Book.getSortedByQuery(this.query)
            : await Book.getAllSorted();

        for(const book of books) {
            this.addBookElement(book);
        }
    }
}

module.exports = Books;
