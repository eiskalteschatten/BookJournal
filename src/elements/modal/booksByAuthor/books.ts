import path from 'path';
import fs from 'fs';

import nunjucks from '../../../nunjucks';
import Book, { BookAttributes } from '../../../models/book';
import { GoogleBooksBook } from '../../../interfaces/books';

interface BooksRenderObject extends BookAttributes, GoogleBooksBook {
  hasBeenRead?: boolean;
  dateReadString?: string;
}

export default class BookByAuthor {
  private books: BooksRenderObject[];

  constructor(books: Book[]) {
    this.books = books;
  }

  async render(): Promise<string | void> {
    const books = await this.buildBooksRenderObject();

    return new Promise<string>((resolve, reject) => {
      const template = path.join(__dirname, '../../../templates/modal/booksByAuthor/book.njk');
      fs.readFile(template, 'utf8', (error: Error, string: string): void => {
        if (error) {
          reject(error);
        }
        resolve(string);
      });
    }).then(async (templateString: string) => {
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

  async buildBooksRenderObject(): Promise<BooksRenderObject[]> {
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
        book.dateReadString = dateRead.toLocaleDateString();
      }

      books.push(book);
    }

    return books;
  }
}
