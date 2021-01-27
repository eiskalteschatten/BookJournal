import path from 'path';
import fs from 'fs';

import nunjucks from '../../nunjucks';
import { NunjucksRenderObject } from '../../interfaces/nunjucks';

export default class Modal {
  protected type: string;

  constructor(type: string) {
    this.type = type;
  }

  async render(): Promise<string> {
    const { type } = this;

    return new Promise<string>((resolve, reject) => {
      const template = path.join(__dirname, `../templates/modal/${type}.njk`);

      fs.readFile(template, 'utf8', (error: Error, string: string): void => {
        if (error) {
          reject(error);
        }
        resolve(string);
      });
    }).then(async templateString => {
      return nunjucks.renderString(templateString, await this.getNunjucksRenderObject());
    }).catch(error => {
      console.error(error);
    });
  }

  getNunjucksRenderObject(): NunjucksRenderObject {
    return {
      type: this.type,
    };
  }
}
