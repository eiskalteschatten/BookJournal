'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');


class Modal {
    constructor(type) {
        this.type = type;
    }

    async render() {
        const type = this.type;

        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, `../templates/elements/modal/${type}.njk`);

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(templateString => {
            return nunjucks.renderString(templateString, this.getNunjucksRenderObject());
        }).catch(error => {
            console.error(error);
        });
    }

    getNunjucksRenderObject() {
        return {
            type: this.type
        };
    }
}

module.exports = Modal;
