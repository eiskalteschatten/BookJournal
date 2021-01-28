import $ from 'jquery';
import path from 'path';
import fs from 'fs';

import nunjucks from '../../nunjucks';
import SidebarListElement from '../listElement/sidebar';
import Category, { CategoryAttributes } from '../../models/category';

export default class CategoryListElement extends SidebarListElement {
  private color: string;

  constructor(displayName?: string, id?: number, color = 'transparent') {
    super(displayName, '', 'category');
    this.id = id;
    this.color = color;
    this.type = 'category';
    this.classes = 'list-element js-sidebar-list-element js-category-list-element';
  }

  async renderListEditor(): Promise<string> {
    try {
      const templateString = await new Promise<string>((resolve, reject) => {
        const template = path.join(__dirname, '../../templates/listElement/edit.njk');
        fs.readFile(template, 'utf8', (error: Error, string: string): void => {
          if (error) {
            reject(error);
          }
          resolve(string);
        });
      });
      return nunjucks.renderString(templateString, {
        id: this.id,
        displayName: this.displayName,
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  async showListEditor(): Promise<void> {
    try {
      const rendered = await this.renderListEditor();
      $('#sidebar').find('.js-list').append(rendered);
      $('.js-list-element-edit-name').last().focus();
    }
    catch (error) {
      console.error(error);
    }
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();
    object.color = this.color;
    return object;
  }

  async save(): Promise<void> {
    const values = {
      name: this.displayName,
      color: this.color,
    };

    await this.saveValues(values);
  }

  async saveValues(values: CategoryAttributes): Promise<number> {
    try {
      if (!this.id) {
        const category = await Category.create(values);
        const { id } = category;
        this.id = id;
        return id;
      }
      else {
        await Category.update(values, { where: { id: this.id } });
        return this.id;
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async saveName(): Promise<void> {
    const values = {
      name: this.displayName,
    };

    if (!this.id) {
      console.error('An ID is required when just saving a category name');
      return;
    }

    await this.saveValues(values);
  }

  async saveColor(): Promise<void> {
    const values = {
      color: this.color,
    };

    if (!this.id) {
      console.error('An ID is required when just saving a category color');
      return;
    }

    await this.saveValues(values);
  }

  async delete(): Promise<void> {
    await Category.destroy({ where: { id: this.id } });
  }
}
