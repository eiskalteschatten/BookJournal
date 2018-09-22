'use strict';

const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');

const config = require('../config/config');

const Book = require('../models/book');

const sortDesc = (a, b) => b - a;


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
        const allDatesRead = await this.getAllDatesRead();
        const sortedLastFiveYears = this.sortedLastFiveYears(allDatesRead);
        const latestYear = sortedLastFiveYears[0];

        return {
            allDatesRead,
            countsYear: await this.calculateCountsYear(allDatesRead),
            countsMonthYear: await this.calculateCountsMonthYear(allDatesRead, latestYear)
        };
    }

    async getAllDatesRead() {
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

        return allDatesRead;
    }

    async calculateCountsYear(allDatesRead) {
        const sortedLastFiveYears = this.sortedLastFiveYears(allDatesRead);
        const countsYear = {};

        for (const year of sortedLastFiveYears) {
            countsYear[year] = await this.calculateBookAndPageCounts(year);
        }

        return countsYear;
    }

    async calculateCountsMonthYear(allDatesRead, year) {
        const sortedMonths = allDatesRead[year].slice().sort(sortDesc);
        const countsMonthYearOnlyMonth = {};

        for (let month of sortedMonths) {
            month = parseInt(month) + 1;
            countsMonthYearOnlyMonth[month] = await this.calculateBookAndPageCounts(year, month);
        }

        const countsMonthYear = {};
        countsMonthYear[year] = countsMonthYearOnlyMonth;

        return countsMonthYear;
    }

    sortedLastFiveYears(allDatesRead) {
        const sortedYears = Object.keys(allDatesRead).slice().sort(sortDesc);
        return sortedYears.slice(0, config.statistics.defaultNumberOfYears);
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
