import $ from 'jquery';
import request from 'request';

import Modal from '..';
import Books from './books';
import config from '../../../config';
import Preferences from '../../../models/preferences';
import Book from '../../../models/book';

const maxResults = config.bookInfo.google.authorsMaxResults;

export default class BooksByAuthor extends Modal {
  private authors: string;

  constructor(authors: string) {
    super('booksByAuthor');
    this.authors = authors;
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();

    const { authors } = this;
    object.authors = authors;

    try {
      let bookJson = sessionStorage.getItem('booksByAuthorInitial');
      bookJson = JSON.parse(bookJson);

      const oldBooks = this.sortBooksByTitle(bookJson);
      object.bookList = await this.renderBookList(oldBooks);
      object.showMoreResults = bookJson.totalItems > maxResults;
    }
    catch (error) {
      console.error(error);
    }

    return object;
  }

  // TODO: create a real interface
  async fetchBooks(indexFactor = 0): Promise<any> {
    const { authors } = this;
    if (authors === '') {
      return;
    }

    const index = indexFactor > 0 ? (indexFactor * maxResults) + 1 : 0;

    try {
      const preferencesString = localStorage.getItem('preferences');
      const preferences: Preferences = JSON.parse(preferencesString);

      if (!preferences.fetchBooksByAuthor) {
        return;
      }

      sessionStorage.setItem('booksByAuthor', '');

      let url = config.bookInfo.google.urlAuthors;
      url = url.replace('${authors}', authors).replace('${lang}', preferences.fetchBooksByAuthorLanguage).replace('${index}', index.toString());

      // TODO: create a real interface
      return new Promise<any>((resolve, reject) => {
        // TODO: replace with fetch
        request(url, (error, response, body) => {
          if (error) {
            reject(error);
          }

          try {
            const bodyJson = JSON.parse(body);
            const { totalItems } = bodyJson;

            if (totalItems > 0) {
              sessionStorage.setItem('booksByAuthorIndexFactor', indexFactor.toString());

              if (indexFactor === 0) {
                sessionStorage.setItem('booksByAuthorInitial', body);
                $('#bookAuthorInfo').removeClass('hidden');
                this.fetchBooks(indexFactor + 1);
              }
              else {
                sessionStorage.setItem('booksByAuthor', body);
              }
            }

            resolve(bodyJson);
          }
          catch (error) {
            reject(error);
          }
        });
      }).catch(error => {
        console.error(error);
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  // TODO: interfaces!
  sortBooksByTitle(books) {
    const { authors } = this;

    if (!books.items) {
      return [];
    }

    return books.items.sort((a, b) => {
      if (authors.includes(',')) {
        const authorsA = a.volumeInfo.authors.join(',').toUpperCase();
        const authorsUpperCase = authors.replace(', ', ',').toUpperCase();

        if (authorsA.includes(authorsUpperCase)) {
          return -1;
        }
      }

      const titleA = a.volumeInfo.title.toUpperCase();
      const titleB = b.volumeInfo.title.toUpperCase();

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
  }

  async renderBookList(oldBooks: Book[]): Promise<string> {
    const books = new Books(oldBooks);
    return await books.render();
  }

  hasMoreResults(): boolean {
    try {
      const books = sessionStorage.getItem('booksByAuthor');
      const booksJson = JSON.parse(books);

      return booksJson.items ? true : false;
    }
    catch (error) {
      console.error(error);
    }
  }
}
