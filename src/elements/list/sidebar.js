'use strict';

const $ = require('jquery');
const Sequelize = require('sequelize');

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
        const categories = await Category.findAll({
            order: [
                [
                    Sequelize.fn('lower',Sequelize.col('name')),
                    'ASC'
                ]
            ]
        });

        for(const category of categories) {
            this.addCategoryElement(category.name, category.id, category.color);
        }
    }

    static sortCategories() {
        const list = $('#sidebar').find('.js-list');
        const sort = (a, b) => {
            return ($(b).find('.js-list-element-name').text().toLowerCase()) < ($(a).find('.js-list-element-name').text().toLowerCase()) ? 1 : -1;
        };

        $('.js-category-list-element').sort(sort).appendTo(list);
    }
}

module.exports = Sidebar;
