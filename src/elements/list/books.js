'use strict';

const path = require('path');

const List = require('../list');
const Book = require('../../models/book');
const BookListElement = require('../../elements/listElement/book');


class Books extends List {
    constructor(query = '') {
        super();
        this.template = path.join(__dirname, '../../templates/elements/list/books.njk');
        this.query = query;
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
