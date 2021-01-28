import path from 'path';
import { promises as fsPromises } from 'fs';

import nunjucks from '../../nunjucks';

export default class Modal {
  protected type: string;

  constructor(type: string) {
    this.type = type;
  }

  async render(): Promise<string> {
    const { type } = this;
    const template = path.join(__dirname, `../templates/modal/${type}.njk`);
    const templateString = await fsPromises.readFile(template, 'utf8');
    return nunjucks.renderString(templateString, await this.getNunjucksRenderObject());
  }

  // Use an async function here because some inheriting classes
  // need to use an async function
  async getNunjucksRenderObject(): Promise<any> {
    return Promise.resolve({
      type: this.type,
    });
  }
}
