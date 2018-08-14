'use strict';

const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const SidebarListElement = require('../listElement/sidebar');


class CategoryListElement extends SidebarListElement {
    constructor(displayName, iconPath = '', queryType) {
        super(displayName, iconPath, queryType);
        this.classes = 'list-element js-sidebar-list-element';
    }

    renderListEditor() {
        const self = this;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../../templates/elements/listElementEdit.njk');
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

    async showListEditor() {
        const rendered = await this.renderListEditor();
        $('#sidebar').find('.js-list').append(rendered);
        $('.js-list-element-edit-name').last().focus();
    }

    // static onClick($element) {

    // }
}

module.exports = CategoryListElement;
