'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');


class BookCount extends StatisticsBox {
    constructor() {
        super();

        this.template = path.join(__dirname, '../templates/elements/statistics.njk');
    }

    async getNunjucksRenderObject() {
        return {

        };
    }

    async calculate() {

    }
}

module.exports = BookCount;
