'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const ListElement = require('../listElement');
const config = require('../../config/config');


class BookListElement extends ListElement {
    constructor(book) {
        super(book.title, book.cover);
        this.id = book.id;
        this.book = book;
        this.classes = 'list-element js-book-list-element';
    }

    render() {
        const self = this;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/listElement/book.njk');
            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, self.getNunjucksRenderObject());
        }).catch(error => {
            console.error(error);
        });
    }

    getNunjucksRenderObject() {
        const object = this.book;

        if (object.bookcover)
            object.bookcoverPath = path.join(config.bookcovers.path, object.bookcover);

        object.classes = this.classes;

        return object;
    }
}

module.exports = BookListElement;
