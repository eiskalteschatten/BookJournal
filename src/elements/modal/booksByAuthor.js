'use strict';

const Modal = require('../modal');


class BooksByAuthor extends Modal {
    constructor() {
        super('books-by-author');
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();


        return object;
    }

    static async fetchBooks() {
        console.log('fetch books');
    }
}

module.exports = BooksByAuthor;
