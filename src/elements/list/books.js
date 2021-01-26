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

  async loadBooks(sortBy = 'title', sortOrder = 'ASC') {
    sortBy = sortBy || 'title';
    sortOrder = sortOrder || 'ASC';

    const books = this.query
      ? await Book.getSortedByQuery(this.query, sortBy, sortOrder)
      : await Book.getAllSorted(sortBy, sortOrder);

    for (const book of books) {
      book.subtitleField = sortBy;
      this.addBookElement(book);
    }
  }
}

module.exports = Books;
