'use strict';

const $ = require('jquery');
const request = require('request');

const Modal = require('../modal');
const config = require('../../config/config');

const maxResults = config.bookInfo.google.authorsMaxResults;


class BooksByAuthor extends Modal {
    constructor(authors) {
        super('booksByAuthor');

        this.authors = authors;
    }

    async getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.authors = this.authors;

        try {
            let bookJson = sessionStorage.getItem('booksByAuthor');
            bookJson = JSON.parse(bookJson);

            const oldBooks = bookJson.items.sort((a, b) => {
                const titleA = a.volumeInfo.title.toUpperCase();
                const titleB = b.volumeInfo.title.toUpperCase();

                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });

            const books = [];

            for (const book of oldBooks) {
                const volumeInfo = book.volumeInfo;
                const isbns = [];

                for (const id of volumeInfo.industryIdentifiers) {
                    isbns.push(id.identifier);
                }

                book.hasBeenRead =  await this.determineIfBookHasBeenRead({
                    title: volumeInfo.title,
                    author: volumeInfo.authors,
                    isbns: isbns
                });

                books.push(book);
            }

            object.books = books;
            object.totalItems = bookJson.totalItems;
            object.showMoreResults = bookJson.totalItems > maxResults;
        }
        catch(error) {
            console.error(error);
        }

        return object;
    }

    async determineIfBookHasBeenRead(bookInfo) {
        console.log(bookInfo);
        return true;
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
