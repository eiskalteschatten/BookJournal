'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');


class MonthYearBox extends StatisticsBox {
    constructor(count) {
        super();

        this.count = count;
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox.njk');
    }

    async getNunjucksRenderObject() {
        return {

        };
    }
}

module.exports = MonthYearBox;
