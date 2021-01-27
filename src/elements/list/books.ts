import path from 'path';
import { FindOptions } from 'sequelize';

import List from '../list';
import Book from '../../models/book';
import BookListElement from '../../elements/listElement/book';

export default class Books extends List {
  private query: FindOptions;

  constructor(query?: FindOptions) {
    super();
    this.template = path.join(__dirname, '../../templates/list/books.njk');
    this.query = query;
  }

  addBookElement(book: Book): void {
    const element = new BookListElement(book);
    this.elements.push(element);
  }

  async loadBooks(sortBy = 'title', sortOrder = 'ASC'): Promise<void> {
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
