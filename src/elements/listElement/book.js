'use strict';

const path = require('path');
const fs = require('fs');

const nunjucks = require('../../nunjucks');
const ListElement = require('../listElement');
const bookcoverHelper = require('../../lib/bookcover');


class BookListElement extends ListElement {
    constructor(book) {
        super(book.title, book.cover);
        this.id = book.id;
        this.book = book;
        this.classes = 'list-element js-book-list-element';
    }

    async render() {
        const self = this;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../../templates/elements/listElement/book.njk');
            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(async templateString => {
            return nunjucks.renderString(templateString, {
                book: await self.getNunjucksRenderObject()
            });
        }).catch(error => {
            console.error(error);
        });
    }

    async getNunjucksRenderObject() {
        const object = this.book;

        if (object.bookcover)
            object.bookcoverPath = bookcoverHelper.pruneCoverPath(object.bookcover);

        object.classes = this.classes;
        object.subtitle = await this.determineSubtitle();

        return object;
    }

    async determineSubtitle() {
        const book = this.book;
        const field = book.subtitleField;
        let subtitle;

        switch(field) {
            case 'title':
                subtitle = book.author;
                break;
            case 'notReadYet':
                subtitle = book.notReadYet ? 'Not Read Yet' : `Finished on ${dateRead.toLocaleDateString()}`;
                break;
            case 'dateRead':
                const dateRead = new Date(book.dateRead);
                subtitle = book.dateRead? `Finished on ${dateRead.toLocaleDateString()}` : '';
                break;
            case 'createdAt':
                const createdAt = new Date(book.createdAt);
                subtitle = book.createdAt ? `Added on ${createdAt.toLocaleDateString()}` : '';
                break;
            case 'updatedAt':
                const updatedAt = new Date(book.updatedAt);
                subtitle = book.updatedAt ? `Updated on ${updatedAt.toLocaleDateString()}` : '';
                break;
            case 'pageCount':
                const label = book.pageCount > 1 ? `${book.pageCount} pages` :  `${book.pageCount} page`;
                subtitle = book.pageCount ? label : '';
                break;
            case 'rating':
                subtitle = await this.renderRatingStars();
                break;
            default:
                subtitle = book[field];
        }

        return subtitle;
    }

    async renderRatingStars() {
        const bookRating = this.book.rating;

        let ratingClasses = ['empty', 'empty', 'empty', 'empty', 'empty'];
        ratingClasses = ratingClasses.map((element, index) => {
            const index1 = index + 1;
            return (index1 <= bookRating) ? 'full' : element;
        });

        return new Promise(async (resolve, reject) => {
            const template = path.join(__dirname, '../../templates/elements/listElement/book/ratingStars.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {ratingClasses});
        }).catch(error => {
            console.error(error);
        });
    }
}

module.exports = BookListElement;
