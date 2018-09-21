'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');


class BookPageCountYear extends StatisticsBox {
    constructor(statistics) {
        super(statistics);
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox/bookPageCountYear.njk');
    }

    async getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.latestYear = Object.keys(this.statistics)[0];

        return object;
    }
}

module.exports = BookPageCountYear;
