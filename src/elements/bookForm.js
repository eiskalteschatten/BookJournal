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

    async renderRatingStars() {
        const fullClass = 'full';
        const emptyClass = 'empty';

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/ratingStars.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                firstClass: fullClass,
                secondClass: fullClass,
                thirdClass: fullClass,
                fourthClass: emptyClass,
                fifthClass: emptyClass
            });
        }).catch(error => {
            console.error(error);
        });
    }

    static async renderCategories() {
        const categories = await Category.getAllSorted();

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/categories.njk');

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
