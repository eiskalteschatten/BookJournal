import $ from 'jquery';
import path from 'path';

import List from '../list';
import ListElement from '../listElement/sidebar';
import Category from '../../models/category';
import CategoryListElement from '../../elements/listElement/category';

export default class Sidebar extends List {
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

  addElement(displayName: string, iconPath = '', queryType: string): void {
    const element = new ListElement(displayName, iconPath, queryType);
    this.elements.push(element);
  }

  addCategoryElement(displayName: string, id = '', color = 'transparent'): void {
    const element = new CategoryListElement(displayName, id, color);
    this.elements.push(element);
  }

  async loadCategories(): Promise<void> {
    const categories = await Category.getAllSorted();

    for (const category of categories) {
      this.addCategoryElement(category.name, category.id, category.color);
    }
  }

  static sortCategories(): void {
    const list = $('#sidebar').find('.js-list');
    const sort = (a: HTMLElement, b: HTMLElement): number =>
      ($(b).find('.js-list-element-name').text().toLowerCase()) < ($(a).find('.js-list-element-name').text().toLowerCase()) ? 1 : -1;

    ($('.js-category-list-element') as any).sort(sort).appendTo(list);
  }
}
