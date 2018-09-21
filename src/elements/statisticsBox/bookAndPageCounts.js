'use strict';

const path = require('path');

const StatisticsBox = require('../statisticsBox');
const Book = require('../../models/book');


class BookAndPageCounts extends StatisticsBox {
    constructor() {
        super();
        this.template = path.join(__dirname, '../templates/elements/statistics.njk');
    }

    async getNunjucksRenderObject() {
        return {

        };
    }

    static async calculate(year, month = '') {
        const results = month === ''
            ? await Book.getByYear(year)
            : await Book.getByMonthYear(month, year);

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
