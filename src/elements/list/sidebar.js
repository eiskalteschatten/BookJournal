'use strict';

const $ = require('jquery');
const path = require('path');

const List = require('../list');
const ListElement = require('../listElement/sidebar');
const Category = require('../../models/category');
const CategoryListElement = require('../../elements/listElement/category');


class Sidebar extends List {
  constructor() {
    super();
    this.template = path.join(__dirname, '../../templates/elements/list/sidebar.njk');

    this.addElement('All Books', '../assets/images/si-glyph-bookcase.svg', 'all-books');
    this.addElement('Wishlist', '../assets/images/si-glyph-bullet-checked-list.svg', 'wishlist');

    this.addSpacerElement();

    this.addElement('Currently Reading', '../assets/images/si-glyph-book-open.svg', 'currently-reading');
    this.addElement('Not Read Yet', '../assets/images/si-glyph-bookmark.svg', 'not-read-yet');
    this.addElement('Books Read', '../assets/images/si-glyph-square-checked.svg', 'books-read');

    this.addSpacerElement();

    this.addElement('Statistics', '../assets/images/si-glyph-chart-piece.svg', 'statistics');

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
    const categories = await Category.getAllSorted();

    for (const category of categories) {
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
