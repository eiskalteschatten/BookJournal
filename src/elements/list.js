'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');

const ListElement = require('./listElement');
const TitleListElement = require('./listElement/title');


class List {
    constructor() {
        this.elements = [];
    }

    async render() {
        const listElements = [];

        return new Promise((resolve, reject) => {
            for (const element of this.elements) {
                listElements.push(element.getNunjucksRenderObject());
            }

            const template = path.join(__dirname, '../templates/elements/list.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {listElements});
        }).catch(error => {
            console.error(error);
        });
    }

    addElement(displayName, iconPath = '') {
        const element = new ListElement(displayName, iconPath);
        this.elements.push(element);
    }

    addElements(elements) {
        for(const element of elements) {
            this.addElements(element.displayName, element.iconPath);
        }
    }

    addTitleElement(displayName) {
        const element = new TitleListElement(displayName);
        this.elements.push(element);
    }
}

module.exports = List;
