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
        // const fullClass = 'full';
        const emptyClass = 'empty';
        const classes = [emptyClass, emptyClass, emptyClass, emptyClass, emptyClass];

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/ratingStars.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                firstClass: classes[0],
                secondClass: classes[1],
                thirdClass: classes[2],
                fourthClass: classes[3],
                fifthClass: classes[4]
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

    static async renderTagCategoryBadge(tag, deleteId) {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/bookForm/tagCategoryBadge.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                tag,
                deleteId
            });
        }).catch(error => {
            console.error(error);
        });
    }
}

module.exports = BookForm;
