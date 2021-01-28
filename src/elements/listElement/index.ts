import path from 'path';
import fs from 'fs';

import nunjucks from '../../nunjucks';

export default class ListElement {
  protected id: number;
  protected displayName: string;
  protected iconPath: string;
  protected classes: string;
  protected type: string;
  protected queryType: string;

  constructor(displayName = '', iconPath = '', queryType?: string) {
    this.displayName = displayName;
    this.iconPath = iconPath;
    this.classes = 'list-element js-list-element';
    this.type = 'clickable';
    this.queryType = queryType;
  }

  async render(): Promise<string> {
    const self = this;

    try {
      const templateString = await new Promise<string>((resolve, reject) => {
        const template = path.join(__dirname, '../templates/listElement.njk');
        fs.readFile(template, 'utf8', (error, string): void => {
          if (error) {
            reject(error);
          }
          resolve(string);
        });
      });
      return nunjucks.renderString(templateString, await self.getNunjucksRenderObject());
    }
    catch (error) {
      console.error(error);
    }
  }

  // Use an async function here because some inheriting classes
  // need to use an async function
  async getNunjucksRenderObject(): Promise<any> {
    return Promise.resolve({
      id: this.id,
      classes: this.classes,
      iconPath: this.iconPath,
      displayName: this.displayName,
      type: this.type,
    });
  }
}
