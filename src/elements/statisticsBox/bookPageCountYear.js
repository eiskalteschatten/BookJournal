'use strict';

const path = require('path');
const chartModule = require('../../lib/chart');

const StatisticsBox = require('../statisticsBox');


class BookPageCountYear extends StatisticsBox {
    constructor(statistics, allDatesRead) {
        super(statistics);

        this.sortedYears = Object.keys(statistics).sort((a, b) => b - a);
        this.allDatesRead = allDatesRead;
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox/bookPageCountYear.njk');
    }

    async getNunjucksRenderObject() {
        const statistics = this.statistics;

        const object = await super.getNunjucksRenderObject();
        object.allDatesRead = this.allDatesRead;
        object.firstYear = statistics.firstYear;
        object.secondYear = statistics.secondYear;

        return object;
    }

    async renderGraphs($booksGraph, $pagesGraph) {
        const chart = chartModule();
        const statistics = this.statistics.countsYear;

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
