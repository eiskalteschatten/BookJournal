import $ from 'jquery';

import Modal from '..';
import Books from './books';
import config from '../../../config';
import Preferences from '../../../models/preferences';
import { GoogleBooksBook, GoogleBooksItem } from '../../../interfaces/books';

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
      const bookString = sessionStorage.getItem('booksByAuthorInitial');
      const bookJson: GoogleBooksBook = JSON.parse(bookString);

      const oldBooks = this.sortBooksByTitle(bookJson);
      object.bookList = await this.renderBookList(oldBooks);
      object.showMoreResults = bookJson.totalItems > maxResults;
    }
    catch (error) {
      console.error(error);
    }

    return object;
  }

  async fetchBooks(indexFactor = 0): Promise<GoogleBooksBook> {
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

      const response = await fetch(url);
      const body: GoogleBooksBook = await response.json();
      const { totalItems } = body;

      if (totalItems > 0) {
        sessionStorage.setItem('booksByAuthorIndexFactor', indexFactor.toString());

        if (indexFactor === 0) {
          sessionStorage.setItem('booksByAuthorInitial', JSON.stringify(body));
          $('#bookAuthorInfo').removeClass('hidden');
          await this.fetchBooks(indexFactor + 1);
        }
        else {
          sessionStorage.setItem('booksByAuthor', JSON.stringify(body));
        }
      }

      return body;
    }
    catch (error) {
      console.error(error);
    }
  }

  sortBooksByTitle(books: GoogleBooksBook): GoogleBooksItem[] {
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

  async renderBookList(oldBooks: GoogleBooksItem[]): Promise<string> {
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
