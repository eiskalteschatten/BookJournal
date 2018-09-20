'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');
const Book = require('../../models/book');


class BookAndPageCounts extends StatisticsBox {
    constructor(year, month = '') {
        super();

        this.year = year;
        this.month = month;
        this.template = path.join(__dirname, '../templates/elements/statistics.njk');
    }

    async getNunjucksRenderObject() {
        return {

        };
    }

    async calculate() {
        const results = this.month === ''
            ? await Book.getByYear(this.year)
            : await Book.getByMonthYear(this.month, this.year);

        let pageCount = 0;

        for (const result of results) {
            const pageCountInt = parseInt(result.pageCount);

            if (result.pageCount && !isNaN(pageCountInt))
                pageCount += pageCountInt;
        }

        return {
            bookCount: results.length,
            pageCount
        };
    }
}

module.exports = BookAndPageCounts;
