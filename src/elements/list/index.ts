import path from 'path';
import { promises as fsPromises } from 'fs';

import nunjucks from '../../nunjucks';

import ListElement from '../listElement';
import TitleListElement from '../listElement/title';
import SpacerListElement from '../listElement/spacer';

export default class List {
  protected elements: ListElement[];
  protected template: string;

  constructor() {
    this.elements = [];
    this.template = path.join(__dirname, '../../templates/list.njk');
  }

  async render(): Promise<string> {
    const listElements = [];

    for (const element of this.elements) {
      listElements.push(await element.getNunjucksRenderObject());
    }

    const templateString = await fsPromises.readFile(this.template, 'utf8');
    return nunjucks.renderString(templateString, { listElements });
  }

  addElement(displayName: string, iconPath = '', queryType?: string): void {
    const element = new ListElement(displayName, iconPath, queryType);
    this.elements.push(element);
  }

  addElements(elements: any[]): void {
    for (const element of elements) {
      this.addElement(element.displayName, element.iconPath);
    }
  }

  addTitleElement(displayName: string): void {
    const element = new TitleListElement(displayName);
    this.elements.push(element);
  }

  addSpacerElement(): void {
    const element = new SpacerListElement();
    this.elements.push(element);
  }
}
