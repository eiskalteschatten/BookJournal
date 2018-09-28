'use strict';

const $ = require('jquery');
const request = require('request');

const Modal = require('../modal');
const config = require('../../config/config');


class BooksByAuthor extends Modal {
    constructor() {
        super('books-by-author');
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        return object;
    }

    static async fetchBooks(authors) {
        if (authors === '') return;

        try {
            let preferences = localStorage.getItem('preferences');
            preferences = JSON.parse(preferences);

            if (!preferences.fetchBooksByAuthor) return;

            sessionStorage.setItem('booksByAuthor', '');

            let url = config.bookInfo.google.urlAuthors;
            url = url.replace('${authors}', authors).replace('${lang}', preferences.fetchBooksByAuthorLanguage);

            return new Promise((resolve, reject) => {
                request(url, (error, response, body) => {
                    if (error) reject(error);

                    try {
                        const bodyJson = JSON.parse(body);

                        if (response.statusCode <= 299 && bodyJson.totalItems > 0) {
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
