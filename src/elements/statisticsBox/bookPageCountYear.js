'use strict';

const path = require('path');
const Chart = require('chart.js');

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
        const statistics = this.statistics;
        const options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        const booksReadData = [];
        const pagessReadData = [];

        for (const year in statistics) {
            booksReadData.push(statistics[year].bookCount);
            pagessReadData.push(statistics[year].pageCount);
        }

        const booksReadGraph = new Chart($booksGraph, {
            type: 'bar',
            data: {
                labels: Object.keys(statistics),
                datasets: [{
                    label: 'Books Read per Year',
                    data: booksReadData
                }]
            },
            options
        });

        const pagesReadGraph = new Chart($pagesGraph, {
            type: 'bar',
            data: {
                labels: Object.keys(statistics),
                datasets: [{
                    label: 'Pages Read per Year',
                    data: pagessReadData
                }]
            },
            options
        });

        return {
            booksReadGraph,
            pagesReadGraph
        };
    }
}

module.exports = BookPageCountYear;
