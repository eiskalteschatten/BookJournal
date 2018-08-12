'use strict';

const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const ListElement = require('./listElement');


class List {
    constructor($anchor) {
        this.$anchor = $anchor;
        this.elements = [];
    }

    async render() {
        const $anchor = this.$anchor;
        const listElements = [];
        const template = path.join(__dirname, '../templates/list.njk');

        $anchor.html('');

        for(const element of this.elements) {
            listElements.push(element.getNunjucksRenderObject());
        }

        fs.readFile(template, 'utf8', (error, templateString) => {
            if (error) throw new Error(error);

            nunjucks.renderString(templateString, {
                listElements
            }, (error, rendered) => {
                if (error) throw new Error(error);

                $anchor.html(rendered);
            });
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
}

module.exports = List;
