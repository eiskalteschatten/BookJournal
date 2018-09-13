'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');


class Statistics {
    async render() {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/statistics.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(async templateString => {
            return nunjucks.renderString(templateString, await this.getNunjucksRenderObject());
        }).catch(error => {
            console.error(error);
        });
    }

    async getNunjucksRenderObject() {
        return {

        };
    }
}

module.exports = Statistics;
