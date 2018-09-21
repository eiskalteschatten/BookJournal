'use strict';

const path = require('path');
const chartModule = require('../../lib/chart');

const StatisticsBox = require('../statisticsBox');


class BookPageCountYear extends StatisticsBox {
    constructor(statistics) {
        super(statistics);

        const sortedYears = Object.keys(statistics).sort((a, b) => b - a);
        this.latestYear = sortedYears[0];
        this.template = path.join(__dirname, '../../templates/elements/statisticsBox/bookPageCountYear.njk');
    }

    async getNunjucksRenderObject() {
        const object = await super.getNunjucksRenderObject();

        object.latestYear = this.latestYear;

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
