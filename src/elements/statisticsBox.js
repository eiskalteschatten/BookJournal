'use strict';

'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');


class StatisticsBox {
  constructor(statistics) {
    this.statistics = statistics;
    this.template = path.join(__dirname, '../templates/elements/statisticsBox.njk');
  }

  async render() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.template, 'utf8', (error, string) => {
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

  async getNunjucksRenderObject() {
    return {
      statistics: this.statistics,
    };
  }
}

module.exports = StatisticsBox;
