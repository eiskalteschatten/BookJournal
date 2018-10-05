'use strict';

const $ = require('jquery');
const request = require('request');

const Modal = require('../modal');
const Books = require('./booksByAuthor/books');
const config = require('../../config/config');

const maxResults = config.bookInfo.google.authorsMaxResults;


class BooksByAuthor extends Modal {
    constructor(authors) {
        super('booksByAuthor');
        this.authors = authors;
    }

    async getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        const authors = this.authors;
        object.authors = authors;

        try {
            let bookJson = sessionStorage.getItem('booksByAuthor');
            bookJson = JSON.parse(bookJson);

            const oldBooks = this.sortBooksByTitle(bookJson);
            object.bookList = await this.renderBookList(oldBooks);
            object.showMoreResults = bookJson.totalItems > maxResults;
        }
        catch(error) {
            console.error(error);
        }

        return object;
    }

    async fetchBooks(indexFactor = 0) {
        const authors = this.authors;
        if (authors === '') return;

        const index = indexFactor > 0 ? (indexFactor * maxResults) + 1 : 0;

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
                        const totalItems = bodyJson.totalItems;

                        if (totalItems > 0) {
                            sessionStorage.setItem('booksByAuthorIndexFactor', indexFactor);
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

    sortBooksByTitle(books) {
        const authors = this.authors;

        if (!books.items) return [];

        return books.items.sort((a, b) => {
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
    }

    async renderBookList(oldBooks) {
        const books = new Books(oldBooks);
        return await books.render();
    }
}

module.exports = BooksByAuthor;
