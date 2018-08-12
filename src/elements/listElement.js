'use strict';

const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');


class ListElement {
    constructor(displayName, iconPath = '') {
        this.displayName = displayName;
        this.iconPath = iconPath;
        this.id = uuidv4();
        this.classes = 'list-element js-list-element';
    }

    render() {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/listElement.njk');
            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, {
                id: this.id,
                classes: this.classes,
                iconPath: this.iconPath,
                displayName: this.displayName
            });
        }).catch(error => {
            console.error(error);
        });
    }
}

module.exports = ListElement;
