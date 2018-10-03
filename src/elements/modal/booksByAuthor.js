'use strict';

const $ = require('jquery');
const request = require('request');

const Modal = require('../modal');
const config = require('../../config/config');

const Book = require('../../models/book');

const maxResults = config.bookInfo.google.authorsMaxResults;


class BooksByAuthor extends Modal {
    constructor(authors) {
        super('booksByAuthor');

        this.authors = authors;
    }

    async getNunjucksRenderObject() {
        const authors = this.authors;
        const object = super.getNunjucksRenderObject();

        object.authors = authors;

        try {
            let bookJson = sessionStorage.getItem('booksByAuthor');
            bookJson = JSON.parse(bookJson);

            const oldBooks = bookJson.items.sort((a, b) => {
                if (authors.includes(',')) {
                    const authorsA = a.volumeInfo.authors.join(',').toUpperCase();
                    const authorsUpperCase = authors.replace(', ', ',').toUpperCase();

                    if (authorsA.includes(authorsUpperCase)) return -1;
                }

                const titleA = a.volumeInfo.title.toUpperCase();
                const titleB = b.volumeInfo.title.toUpperCase();

                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });

            const books = [];

            for (const book of oldBooks) {
                const volumeInfo = book.volumeInfo;
                const industryIdentifiers = volumeInfo.industryIdentifiers || [];
                const isbns = [];

                for (const id of industryIdentifiers) {
                    isbns.push(id.identifier);
                    if (id.type === 'ISBN_13') book.isbn = id.identifier;
                }

                if (!book.isbn && industryIdentifiers[0]) book.isbn = industryIdentifiers[0].identifier;

                const bookFromDb = await Book.getHasBeenRead(volumeInfo.title, volumeInfo.authors, isbns);
                book.hasBeenRead = bookFromDb ? true : false;

                if (bookFromDb && bookFromDb.dateRead) {
                    const dateRead = new Date(bookFromDb.dateRead);
                    book.dateRead = dateRead.toLocaleDateString();
                }

                books.push(book);
            }

            object.books = books;
            object.totalItems = bookJson.totalItems;
            object.showMoreResults = bookJson.totalItems > maxResults;
            object.itemsLeft = bookJson.totalItems - maxResults;
        }
        catch(error) {
            console.error(error);
        }

        return object;
    }

    async fetchBooks(index = 0) {
        const authors = this.authors;
        if (authors === '') return;

        try {
            let preferences = localStorage.getItem('preferences');
            preferences = JSON.parse(preferences);

            if (!preferences.fetchBooksByAuthor) return;

            sessionStorage.setItem('booksByAuthor', '');

            let url = config.bookInfo.google.urlAuthors;
            url = url.replace('${authors}', authors).replace('${lang}', preferences.fetchBooksByAuthorLanguage).replace('${index}', index);

            return new Promise((resolve, reject) => {
                request(url, (error, response, body) => {
                    if (error) reject(error);

                    try {
                        const bodyJson = JSON.parse(body);

                        if (bodyJson.totalItems > 0) {
                            sessionStorage.setItem('booksByAuthor', body);
                            $('#bookAuthorInfo').removeClass('hidden');
                        }

                        resolve(bodyJson);
                    }
                    catch(error) {
                        reject(error);
                    }
                });
            }).catch(error => {
                console.error(error);
            });
        }
        catch(error) {
            console.error(error);
        }
    }
}

module.exports = BooksByAuthor;
