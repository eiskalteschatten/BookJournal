'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');


class BookPageCountYear extends StatisticsBox {
    constructor(statistics) {
        super(statistics);

        const sortedYears = Object.keys(statistics).sort((a, b) => b - a);
        this.latestYear = sortedYears[0];
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox/bookPageCountYear.njk');
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.latestYear = this.latestYear;

        return object;
    }
}

module.exports = BookPageCountYear;
