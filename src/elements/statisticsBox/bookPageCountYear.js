'use strict';

const path = require('path');
const chartModule = require('../../lib/chart');

const config = require('../../config/config');

const StatisticsBox = require('../statisticsBox');


class BookPageCountYear extends StatisticsBox {
    constructor(statistics, allDatesRead) {
        super(statistics);

        this.sortedYears = Object.keys(statistics).sort((a, b) => b - a);
        this.allDatesRead = allDatesRead;
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox/bookPageCountYear.njk');
    }

    async getNunjucksRenderObject() {
        const sortedYears = this.sortedYears;
        const numberOfYears = sortedYears.length;
        const oldestYear = sortedYears[numberOfYears];

        const object = await super.getNunjucksRenderObject();
        object.allDatesRead = this.allDatesRead;
        object.latestYear = sortedYears[0];
        object.oldestYear = oldestYear;

        const oldestYearIndex = config.statistics.defaultNumberOfYears - 1;
        object.oldestSeletedDate = sortedYears[oldestYearIndex] || oldestYear;

        return object;
    }

    async renderGraphs($booksGraph, $pagesGraph) {
        const chart = chartModule();
        const statistics = this.statistics;

        const labels = [];
        const booksReadData = [];
        const pagesReadData = [];

        for (const year in statistics) {
            labels.push(year);
            booksReadData.push(statistics[year].bookCount);
            pagesReadData.push(statistics[year].pageCount);
        }

        const booksReadGraph = new chart.Chart($booksGraph, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Books Read Per Year',
                    data: booksReadData,
                    backgroundColor: chart.backgroundColor
                }]
            },
            options: chart.defaultOptions
        });

        const pagesReadGraph = new chart.Chart($pagesGraph, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Pages Read Per Year',
                    data: pagesReadData,
                    backgroundColor: chart.backgroundColor
                }]
            },
            options: chart.defaultOptions
        });

        return {
            booksReadGraph,
            pagesReadGraph
        };
    }
}

module.exports = BookPageCountYear;
