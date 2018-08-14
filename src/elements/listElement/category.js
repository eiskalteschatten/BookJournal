'use strict';

const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const SidebarListElement = require('../listElement/sidebar');
const Category = require('../../models/category');


class CategoryListElement extends SidebarListElement {
    constructor(displayName, id = '', color = 'transparent') {
        super(displayName, '', 'category');
        this.id = id;
        this.color = color;
        this.type = 'category';
        this.classes = 'list-element js-sidebar-list-element js-category-list-element';
    }

    renderListEditor() {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../../templates/elements/listElementEdit.njk');
            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                id: this.id,
                displayName: this.displayName
            });
        }).catch(error => {
            console.error(error);
        });
    }

    async showListEditor() {
        try {
            const rendered = await this.renderListEditor();
            $('#sidebar').find('.js-list').append(rendered);
            $('.js-list-element-edit-name').last().focus();
        }
        catch(error) {
            console.error(error);
        }
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.color = this.color;

        return object;
    }

    async save() {
        const values = {
            name: this.displayName,
            color: this.color
        };

        console.log(values);

        if (this.id === '') {
            const category = await Category.create(values);
            const id = category.id;
            this.id = id;
            return id;
        }
        else {
            await Category.update(values, {where: {id: this.id}});
            return this.id;
        }
    }
}

module.exports = CategoryListElement;
