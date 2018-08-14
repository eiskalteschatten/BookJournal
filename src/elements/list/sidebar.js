'use strict';

const List = require('../list');
const ListElement = require('../listElement/sidebar');
const Category = require('../../models/category');
const CategoryListElement = require('../../elements/listElement/category');


class Sidebar extends List {
    constructor() {
        super();
        this.addElement('All Books', '../assets/images/tmp.svg', 'all-books');
        this.addElement('Future Reading', '../assets/images/tmp.svg', 'future-reading');

        this.addTitleElement('Categories');
    }

    addElement(displayName, iconPath = '', queryType) {
        const element = new ListElement(displayName, iconPath, queryType);
        this.elements.push(element);
    }

    addCategoryElement(displayName, id = '', color = 'transparent') {
        const element = new CategoryListElement(displayName, id, color);
        this.elements.push(element);
    }

    async loadCategories() {
        const categories = await Category.findAll();

        for(const category of categories) {
            this.addCategoryElement(category.name, category.id, category.color);
        }
    }
}

module.exports = Sidebar;
