import path from 'path';
import fs from 'fs';

import nunjucks from '../../nunjucks';
import { NunjucksRenderObject } from '../../interfaces/nunjucks';

export default class ListElement {
  private id: string;
  private displayName: string;
  private iconPath: string;
  protected classes: string;
  protected type: string;

  constructor(displayName = '', iconPath = '') {
    this.displayName = displayName;
    this.iconPath = iconPath;
    this.classes = 'list-element js-list-element';
    this.type = 'clickable';
  }

  async render(): Promise<string> {
    const self = this;

    try {
      const templateString = await new Promise<string>((resolve, reject) => {
        const template = path.join(__dirname, '../templates/elements/listElement.njk');
        fs.readFile(template, 'utf8', (error, string) => {
          if (error) {
            reject(error);
          }
          resolve(string);
        });
      });
      return nunjucks.renderString(templateString, self.getNunjucksRenderObject());
    }
    catch (error) {
      console.error(error);
    }
  }

  getNunjucksRenderObject(): NunjucksRenderObject {
    return {
      id: this.id,
      classes: this.classes,
      iconPath: this.iconPath,
      displayName: this.displayName,
      type: this.type,
    };
  }
}
