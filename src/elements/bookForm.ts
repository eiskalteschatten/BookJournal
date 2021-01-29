import { remote } from 'electron';
import $ from 'jquery';
import path from 'path';
import { promises as fsPromises } from 'fs';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import TinyDatePicker from 'tiny-date-picker';
import ColorThief from 'colorthief';

import nunjucks from '../nunjucks';
import config from '../config';
import BooksByAuthor from './modal/booksByAuthor';
import { pruneCoverPath } from '../lib/bookcover';
import bookFormats from '../lib/bookFormats';
import readingStatuses from '../lib/readingStatuses';

import {
  BookFormCategoryBadge,
  BookFormData,
  BookFormRenderObject,
  GoogleBooksBook,
  SavedBookCover,
} from '../interfaces/books';

import Book, { BookAttributes } from '../models/book';
import Category from '../models/category';

const { dialog } = remote;

const bookFormMap = {
  bookBookcoverId: 'id',
  bookTitle: 'title',
  bookAuthor: 'author',
  bookEditor: 'editor',
  bookGenre: 'genre',
  bookDateStarted: 'dateStarted',
  bookDateRead: 'dateRead',
  bookReadingStatus: 'status',
  bookOnWishlist: 'onWishlist',
  bookNumberOfPages: 'pageCount',
  bookColor: 'color',
  bookBookcoverFileName: 'bookcover',
  bookPublisher: 'publisher',
  bookIsbn: 'isbn',
  bookYearPublished: 'yearPublished',
  bookBookFormat: 'bookFormat',
  bookNationality: 'nationality',
  bookLanguageReadIn: 'languageReadIn',
  bookOriginalLanguage: 'originalLanguage',
  bookTranslator: 'translator',
  bookTagsHidden: 'tags',
  bookCategoriesHidden: 'categories',
  bookRating: 'rating',
  bookSummary: 'summary',
  bookCommentary: 'commentary',
  bookNotes: 'notes',
};

export default class BookForm {
  private id: number;

  constructor(id?: number) {
    this.id = id;
  }

  async save(oldFormData: BookFormData): Promise<number> {
    const { id } = this;
    const formData = {};

    for (const formId in oldFormData) {
      const newKey = bookFormMap[formId];
      const value = oldFormData[formId];

      formData[newKey] = (value === '' && (newKey === 'dateRead' || newKey === 'dateStarted'))
        ? null
        : value;
    }

    try {
      if (!id) {
        const book = await Book.create(formData);
        this.id = book.id;
      }
      else {
        await Book.update(formData, { where: { id: id } });
      }
    }
    catch (error) {
      console.error(error);
    }

    return this.id;
  }

  async delete(): Promise<void> {
    await Book.destroy({ where: { id: this.id } });
  }

  async render(): Promise<string> {
    const categories = await Category.getAllSorted();
    let ratingClasses = ['empty', 'empty', 'empty', 'empty', 'empty'];
    let book: BookFormRenderObject;

    if (this.id) {
      book = await Book.findByPk(this.id, { raw: true });

      if (book.bookcover) {
        book.bookcoverPath = pruneCoverPath(book.bookcover);
      }

      if (book.dateStarted) {
        const dateString = typeof book.dateStarted === 'string' ? book.dateStarted : book.dateStarted.toISOString();
        book.dateStartedString = this.formatDate(dateString);
      }

      if (book.dateRead) {
        const dateString = typeof book.dateRead === 'string' ? book.dateRead : book.dateRead.toISOString();
        book.dateReadString = this.formatDate(dateString);
      }

      if (book.tags) {
        book.tagArray = book.tags.split(',');
      }

      if (book.categories) {
        const ids = book.categories.split(',');
        const categoryBadges: BookFormCategoryBadge = {};

        for (const id of ids) {
          const category = await Category.findByPk(id);
          categoryBadges[id] = {
            name: category.name,
            color: category.color,
          };
        }

        book.categoryBadges = categoryBadges;
      }

      if (book.rating) {
        ratingClasses = ratingClasses.map((element, index) => {
          const index1 = index + 1;
          return (index1 <= book.rating) ? 'full' : element;
        });
      }

      book.ratingClasses = ratingClasses;
    }

    const template = path.join(__dirname, '../templates/bookForm.njk');
    const templateString = await fsPromises.readFile(template, 'utf8');

    return nunjucks.renderString(templateString, {
      book,
      categories,
      bookFormats,
      readingStatuses,
    });
  }

  static async renderCategories(): Promise<string> {
    const categories = await Category.getAllSorted();
    const template = path.join(__dirname, '../templates/bookForm/categories.njk');
    const templateString = await fsPromises.readFile(template, 'utf8');
    return nunjucks.renderString(templateString, { categories });
  }

  static async renderTagCategoryBadge(tag: string, deleteId: string, typeClass: string, color = ''): Promise<string> {
    const template = path.join(__dirname, '../templates/bookForm/tagCategoryBadge.njk');
    const templateString = await fsPromises.readFile(template, 'utf8');
    const values = {
      tag,
      deleteId,
      typeClass,
    };

    if (typeClass === 'category') {
      values['category'] = { color };
    }

    return nunjucks.renderString(templateString, values);
  }

  static async saveBookcover(imagePath: string): Promise<SavedBookCover> {
    const bookcoverConfig = config.bookcovers;
    const bookcoverExtensions = bookcoverConfig.extensions;
    const extension = path.extname(imagePath).replace('.', '').toLowerCase();

    try {
      const uuid = uuidv4();
      const newFileName = `${uuid}.${extension}`;
      const newImagePath = path.join(bookcoverConfig.path, newFileName);

      await fsPromises.mkdir(bookcoverConfig.path, { recursive: true });

      if (bookcoverExtensions.indexOf(extension) <= -1) {
        const extensionsString = bookcoverExtensions.join(', ');
        const error = 'The bookcover must be an image';
        dialog.showErrorBox(error, `The file you chose is not an image. It must have one of the following file extensions: ${extensionsString}.`);
        console.error(error);
        return;
      }

      await fsPromises.copyFile(imagePath, newImagePath);

      return {
        fileName: newFileName,
        filePath: pruneCoverPath(newFileName),
      };
    }
    catch (error) {
      console.error(error);
    }
  }

  static async deleteBookcover(fileName: string): Promise<void> {
    const bookcoverConfig = config.bookcovers;
    const imagePath = path.join(bookcoverConfig.path, fileName);
    await fsPromises.unlink(imagePath);
  }

  static async getPrimaryBookcoverColor(filePath: string): Promise<string> {
    try {
      const rgbColor = await ColorThief.getColor(filePath);

      const hexColor = '#' + rgbColor.map((color: number): string => {
        const hex = color.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');

      return hexColor;
    }
    catch (error) {
      console.error(error);
    }
  }

  async afterRender(): Promise<void> {
    const $wrapper = $('#bookFormWrapper');

    if (!$wrapper.hasClass('form-displayed')) {
      setTimeout(() => {
        $wrapper.addClass('form-displayed');
      }, 100);
    }

    const datePickerOptions = {
      format(date: Date) {
        return date.toLocaleDateString();
      },
      parse(string: string) {
        if (string !== '') {
          const date = moment(string, 'L', window.navigator.languages[0]);
          date.format('YYYY-MM-DD');
          return date.toDate();
        }

        return new Date();
      },
      mode: 'dp-below',
    };

    const dateStarted = document.getElementById('bookDateStarted');
    TinyDatePicker(dateStarted, datePickerOptions);

    const dateRead = document.getElementById('bookDateRead');
    TinyDatePicker(dateRead, datePickerOptions);

    const authors = $('#bookAuthor').val().toString();
    const booksByAuthor = new BooksByAuthor(authors);
    booksByAuthor.fetchBooks();
  }

  static async fetchBookInfo(isbn: string): Promise<GoogleBooksBook> {
    let url = config.bookInfo.google.urlIsbn;
    url = url.replace('${isbn}', isbn);

    try {
      const response = await fetch(url);
      const body: GoogleBooksBook = await response.json();
      return body;
    }
    catch (error) {
      console.error(error);
    }
  }

  formatDate(date: string): string {
    if (date !== 'Invalid date') {
      const dateObj = new Date(date);
      return date !== 'Invalid date' ? dateObj.toLocaleDateString() : '';
    }

    return '';
  }
}
