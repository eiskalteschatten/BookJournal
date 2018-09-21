'use strict';

const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');

const BookAndPageCounts = require('./statisticsBox/bookAndPageCounts');

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

        const sortedYears = Object.keys(allDatesRead).sort(sortDesc);
        const newestYear = sortedYears[0];
        const countsYear = await BookAndPageCounts.calculate(newestYear);

        const sortedMonths = allDatesRead[newestYear].slice().sort(sortDesc);
        const newestMonth = parseInt(sortedMonths[0]) + 1;
        const countsMonthYear = await BookAndPageCounts.calculate(newestYear, newestMonth);

        return {
            allDatesRead,
            countsYear,
            countsMonthYear
        };
    }
}

module.exports = Statistics;
