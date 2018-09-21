'use strict';

const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');

const Book = require('../models/book');


class Statistics {
    async render() {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/statistics.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(async templateString => {
            return nunjucks.renderString(templateString);
        }).catch(error => {
            console.error(error);
        });
    }

    loadStatistics() {
        const windowID = BrowserWindow.getFocusedWindow().id;
        const loadStatsPath = 'file://' + path.join(__dirname, '../html/invisible/load-statistics.html');

        const loadStatsWindow = new BrowserWindow({ width: 400, height: 400, show: false });
        loadStatsWindow.loadURL(loadStatsPath);
        loadStatsWindow.webContents.on('did-finish-load', () => {
            const input = 100;
            loadStatsWindow.webContents.send('load-statistics', input, windowID);
        });
    }

    async calculateStatistics() {
        const datesReadResults = await Book.findAll({
            attributes: ['dateRead']
        });

        const allDatesRead = {};

        for (const book of datesReadResults) {
            const dateObj = new Date(book.dateRead);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();

            if (year === 1887 || isNaN(year)) continue;

            if (!Array.isArray(allDatesRead[year]))
                allDatesRead[year] = [];

            if (allDatesRead[year].indexOf(month) === -1)
                allDatesRead[year].push(month);
        }

        const sortDesc = (a, b) => b - a;

        const sortedLastFiveYears = Object.keys(allDatesRead).slice(0, 5).sort(sortDesc);
        const countsYear = {};

        for (const year of sortedLastFiveYears) {
            countsYear[year] = await this.calculateBookAndPageCounts(year);
        }

        const newestYear = sortedLastFiveYears[0];
        const sortedLastFiveMonths = allDatesRead[newestYear].slice(0, 5).sort(sortDesc);
        const countsMonthYear = {};

        for (let month of sortedLastFiveMonths) {
            month = parseInt(month) + 1;
            countsMonthYear[month] = await this.calculateBookAndPageCounts(newestYear, month);
        }

        return {
            allDatesRead,
            countsYear,
            countsMonthYear
        };
    }

    async calculateBookAndPageCounts(year, month = '') {
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

module.exports = Statistics;
