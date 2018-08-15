'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const Category = require('../models/category');


class BookForm {
    async render() {
        const categories = await Category.getAllSorted();

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                categories
            });
        }).catch(error => {
            console.error(error);
        });
    }
}

module.exports = BookForm;
