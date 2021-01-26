'use strict';

const path = require('path');
const fs = require('fs');

const nunjucks = require('../../../nunjucks');
const Book = require('../../../models/book');


class BookByAuthor {
  constructor(books) {
    this.books = books;
  }

  async render() {
    const books = await this.buildBooksObject();

    return new Promise((resolve, reject) => {
      const template = path.join(__dirname, '../../../templates/elements/modal/booksByAuthor/book.njk');
      fs.readFile(template, 'utf8', (error, string) => {
        if (error) {
          reject(error); 
        }
        resolve(string);
      });
    }).then(async templateString => {
      let bookHtml = '';

      for (const book of books) {
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '';

        bookHtml += nunjucks.renderString(templateString, {
          book,
          authors,
        });
      }

      return bookHtml;
    }).catch(error => {
      console.error(error);
    });
  }

  async buildBooksObject() {
    const books = [];

    for (const book of this.books) {
      const { volumeInfo } = book;
      const industryIdentifiers = volumeInfo.industryIdentifiers || [];
      const isbns = [];

      for (const id of industryIdentifiers) {
        isbns.push(id.identifier);
        if (id.type === 'ISBN_13') {
          book.isbn = id.identifier; 
        }
      }

      if (!book.isbn && industryIdentifiers[0]) {
        book.isbn = industryIdentifiers[0].identifier; 
      }

      const bookFromDb = await Book.getHasBeenRead(volumeInfo.title, volumeInfo.authors, isbns);
      book.hasBeenRead = bookFromDb ? true : false;

      if (bookFromDb && bookFromDb.dateRead) {
        const dateRead = new Date(bookFromDb.dateRead);
        book.dateRead = dateRead.toLocaleDateString();
      }

      books.push(book);
    }

    return books;
  }
}

module.exports = BookByAuthor;
