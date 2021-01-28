import path from 'path';
import fs from 'fs';

import nunjucks from '../../nunjucks';
import ListElement from '../listElement';
import { pruneCoverPath } from '../../lib/bookcover';
import bookFormats from '../../lib/bookFormats';
import readingStatuses from '../../lib/readingStatuses';
import Book from '../../models/book';

export default class BookListElement extends ListElement {
  private book: Book;

  constructor(book: Book) {
    super(book.title, book.bookcover);
    this.id = book.id;
    this.book = book;
    this.classes = 'list-element js-book-list-element';
  }

  async render(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const template = path.join(__dirname, '../../templates/listElement/book.njk');
      fs.readFile(template, 'utf8', (error: Error, string: string): void => {
        if (error) {
          reject(error);
        }
        resolve(string);
      });
    }).then(async (templateString: string) => {
      const book = this.book;

      if (book.bookcover) {
        book.bookcoverPath = pruneCoverPath(book.bookcover);
      }

      book.classes = this.classes;
      book.subtitle = await this.determineSubtitle();

      return nunjucks.renderString(templateString, { book });
    }).catch(error => {
      console.error(error);
    });
  }

  checkForValidDate(date: Date): boolean {
    return date.toString() !== 'Invalid date';
  }

  async determineSubtitle(): Promise<string> {
    const { book } = this;
    const field = book.subtitleField;
    let subtitle: string;

    switch (field) {
      case 'title':
        subtitle = book.author;
        break;
      case 'status':
        subtitle = book.status ? readingStatuses[book.status] : '';
        break;
      case 'bookFormat':
        subtitle = book.bookFormat ? bookFormats[book.bookFormat] : '';
        break;
      case 'onWishlist':
        subtitle = book.onWishlist ? 'On Wishlist' : '';
        break;
      case 'dateStarted':
        const dateStarted = new Date(book.dateStarted);
        subtitle = book.dateStarted && this.checkForValidDate(book.dateStarted)
          ? `Started on ${dateStarted.toLocaleDateString()}`
          : '';
        break;
      case 'dateRead':
        const dateRead = new Date(book.dateRead);
        subtitle = book.dateRead && this.checkForValidDate(book.dateRead)
          ? `Finished on ${dateRead.toLocaleDateString()}`
          : '';
        break;
      case 'createdAt':
        const createdAt = new Date(book.createdAt);
        subtitle = book.createdAt ? `Added on ${createdAt.toLocaleDateString()}` : '';
        break;
      case 'updatedAt':
        const updatedAt = new Date(book.updatedAt);
        subtitle = book.updatedAt ? `Updated on ${updatedAt.toLocaleDateString()}` : '';
        break;
      case 'pageCount':
        const label = book.pageCount > 1 ? `${book.pageCount} pages` :  `${book.pageCount} page`;
        subtitle = book.pageCount ? label : '';
        break;
      case 'rating':
        subtitle = await this.renderRatingStars();
        break;
      default:
        subtitle = book[field];
    }

    return subtitle;
  }

  async renderRatingStars(): Promise<string> {
    const bookRating = this.book.rating;

    let ratingClasses = ['empty', 'empty', 'empty', 'empty', 'empty'];
    ratingClasses = ratingClasses.map((element: string, index: number): string => {
      const index1 = index + 1;
      return (index1 <= bookRating) ? 'full' : element;
    });

    return new Promise<string>(async (resolve, reject) => {
      const template = path.join(__dirname, '../../templates/listElement/book/ratingStars.njk');

      fs.readFile(template, 'utf8', (error: Error, string: string): void => {
        if (error) {
          reject(error);
        }
        resolve(string);
      });
    }).then((templateString: string) => {
      return nunjucks.renderString(templateString, { ratingClasses });
    }).catch(error => {
      console.error(error);
    });
  }
}
