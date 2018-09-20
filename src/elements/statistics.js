'use strict';

const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

const path = require('path');
const fs = require('fs');
const nunjucks = require('../nunjucks');

const PageCount = require('./statisticsBox/pageCount');
const BookCount = require('./statisticsBox/bookCount');


class Statistics {
    async render() {
        return new Promise((resolve, reject) => {
            const template = path.join(__dirname, '../templates/elements/statistics.njk');

            fs.readFile(template, 'utf8', (error, string) => {
                if (error) reject(error);
                resolve(string);
            });
        }).then(async templateString => {
            return nunjucks.renderString(templateString, await this.getNunjucksRenderObject());
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
            loadStatsWindow.webContents.send('compute-factorial', input, windowID);
        });
    }

    async getNunjucksRenderObject() {
        return {

        };
    }

    async calculateStatistics() {
        const pageCount = new PageCount();
        const bookCount = new BookCount();

        const pageCountNumber = await pageCount.calculate();
        const bookCountNumber = await bookCount.calculate();

        console.log('pageCountNumber', pageCountNumber);
        console.log('bookCountNumber', bookCountNumber);
    }
}

module.exports = Statistics;
