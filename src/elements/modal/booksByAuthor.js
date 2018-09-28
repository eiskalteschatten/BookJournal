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

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.authors = this.authors;

        try {
            let books = sessionStorage.getItem('booksByAuthor');
            books = JSON.parse(books);
            object.books = books.items;
            object.totalItems = books.totalItems;
            object.showMoreResults = books.totalItems > maxResults;
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
