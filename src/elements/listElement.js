'use strict';

const path = require('path');
const fs = require('fs');

const nunjucks = require('../nunjucks');


class ListElement {
  constructor(displayName = '', iconPath = '') {
    this.displayName = displayName;
    this.iconPath = iconPath;
    this.classes = 'list-element js-list-element';
    this.type = 'clickable';
  }

  render() {
    const self = this;

    return new Promise((resolve, reject) => {
      const template = path.join(__dirname, '../templates/elements/listElement.njk');
      fs.readFile(template, 'utf8', (error, string) => {
        if (error) {
          reject(error); 
        }
        resolve(string);
      });
    }).then(templateString => {
      return nunjucks.renderString(templateString, self.getNunjucksRenderObject());
    }).catch(error => {
      console.error(error);
    });
  }

  getNunjucksRenderObject() {
    return {
      id: this.id,
      classes: this.classes,
      iconPath: this.iconPath,
      displayName: this.displayName,
      type: this.type,
    };
  }
}

module.exports = ListElement;
