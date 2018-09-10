'use strict';

const path = require('path');
const fs = require('fs');

const nunjucks = require('../../nunjucks');
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
            const template = path.join(__dirname, '../../templates/elements/listElement/book.njk');
            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                book: self.getNunjucksRenderObject()
            });
        }).catch(error => {
            console.error(error);
        });
    }

    getNunjucksRenderObject() {
        const object = this.book;

        if (object.bookcover)
            object.bookcoverPath = path.join(config.bookcovers.path, object.bookcover);

        object.classes = this.classes;
        object.subtitle = this.determineSubtitle();

        return object;
    }

    determineSubtitle() {
        const book = this.book;
        const field = book.subtitleField;
        const dateRead = new Date(book.dateRead);
        let subtitle;

        switch(field) {
            case 'title':
                subtitle = book.author;
                break;
            case 'notReadYet':
                subtitle = book.notReadYet ? 'Not Read Yet' : `Finished on ${dateRead.toLocaleDateString()}`;
                break;
            case 'dateRead':
                subtitle = (book.dateRead && dateRead.getFullYear() !== 1887) ? `Finished on ${dateRead.toLocaleDateString()}` : '';
                break;
            case 'pageCount':
                const label = book.pageCount > 1 ? `${book.pageCount} pages` :  `${book.pageCount} page`;
                subtitle = book.pageCount ? label : '';
                break;
            default:
                subtitle = book[field];
        }

        return subtitle;
    }
}

module.exports = BookListElement;
