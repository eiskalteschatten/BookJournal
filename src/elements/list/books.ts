import path from 'path';
import { FindOptions } from 'sequelize';

import List from '../list';
import Book from '../../models/book';
import BookListElement from '../../elements/listElement/book';
import { BookListRenderObject } from '../../interfaces/books';

export default class Books extends List {
  private query: FindOptions;

  constructor(query?: FindOptions) {
    super();
    this.template = path.join(__dirname, '../../templates/list/books.njk');
    this.query = query;
  }

  addBookElement(book: BookListRenderObject): void {
    const element = new BookListElement(book);
    this.elements.push(element);
  }

  async loadBooks(sortBy = 'title', sortOrder = 'ASC'): Promise<void> {
    sortBy = sortBy || 'title';
    sortOrder = sortOrder || 'ASC';

    const books = this.query
      ? await Book.getSortedByQuery(this.query, sortBy, sortOrder)
      : await Book.getAllSorted(sortBy, sortOrder);

    const bookRenderObjects: BookListRenderObject[] = books;

    for (const book of bookRenderObjects) {
      book.subtitleField = sortBy;
      this.addBookElement(book);
    }
  }
}
