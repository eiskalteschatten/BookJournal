import path from 'path';
import fs from 'fs';

import nunjucks from '../nunjucks';
import { NunjucksRenderObject } from '../interfaces/nunjucks';

import ListElement from './listElement';
import TitleListElement from './listElement/title';
import SpacerListElement from './listElement/spacer';

export default class List {
  private elements: ListElement[];
  private template: string;

  constructor() {
    this.elements = [];
    this.template = path.join(__dirname, '../templates/elements/list.njk');
  }

  async render(): Promise<string> {
    const listElements = [];

    return new Promise<string>(async (resolve, reject) => {
      for (const element of this.elements) {
        listElements.push(await element.getNunjucksRenderObject());
      }

      fs.readFile(this.template, 'utf8', (error, string) => {
        if (error) {
          reject(error);
        }
        resolve(string);
      });
    }).then(templateString => {
      return nunjucks.renderString(templateString, { listElements });
    }).catch(error => {
      console.error(error);
    });
  }

  addElement(displayName: string, iconPath = ''): void {
    const element = new ListElement(displayName, iconPath);
    this.elements.push(element);
  }

  addElements(elements: NunjucksRenderObject[]): void {
    for (const element of elements) {
      this.addElements(element.displayName, element.iconPath);
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
