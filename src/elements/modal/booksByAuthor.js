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


            const books = new Books(oldBooks);
            object.bookList = await books.render();

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
