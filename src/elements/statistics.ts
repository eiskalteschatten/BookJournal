import { remote } from 'electron';
import { Op } from 'sequelize';
import path from 'path';
import { promises as fsPromises } from 'fs';

import Book from '../models/book';
import nunjucks from '../nunjucks';
import config from '../config';

import {
  AllDatesRead,
  BookAndPageCounts,
  CountsMonth,
  CountsYear,
  NoResults,
  Statistics as IStatistics,
} from '../interfaces/statistics';

const { defaultNumberOfYears } = config.statistics;
const { BrowserWindow } = remote;
const sortDesc = (a: any, b: any): any => b - a;

export default class Statistics {
  async render(): Promise<string> {
    const template = path.join(__dirname, '../templates/statistics.njk');
    const templateString = await fsPromises.readFile(template, 'utf8');
    return nunjucks.renderString(templateString);
  }

  loadStatistics(): void {
    const windowID = BrowserWindow.getFocusedWindow().id;
    const loadStatsPath = 'file://' + path.join(__dirname, '../html/invisible/load-statistics.html');

    const loadStatsWindow = new BrowserWindow({
      width: 400,
      height: 400,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    loadStatsWindow.loadURL(loadStatsPath);
    // loadStatsWindow.webContents.openDevTools();
    loadStatsWindow.webContents.on('did-finish-load', () => {
      const input = 100;
      loadStatsWindow.webContents.send('load-statistics', input, windowID);
    });
  }

  async calculateStatistics(): Promise<IStatistics | NoResults> {
    const allDatesRead = await this.getAllDatesRead();

    if (Object.keys(allDatesRead).length === 0) {
      return { noResults: true };
    }

    const sortedYears = this.sortedYears(allDatesRead);
    const latestYear = Number(sortedYears[0]);
    const oldestYearIndex = defaultNumberOfYears - 1;
    const oldestYear = Number([oldestYearIndex] || sortedYears[sortedYears.length]);

    return {
      allDatesRead,
      countsYearObj: await this.calculateCountsYear(allDatesRead, oldestYear, latestYear),
      countsMonthYear: await this.calculateCountsMonthYear(allDatesRead, latestYear),
    };
  }

  async getAllDatesRead(): Promise<AllDatesRead> {
    const datesReadResults = await Book.findAll({
      attributes: ['dateRead'],
      where: {
        dateRead: {
          [Op.ne]: null,
          [Op.notLike]: 'Invalid%',
        },
      },
    });

    const allDatesRead: AllDatesRead = {};

    for (const book of datesReadResults) {
      const dateObj = new Date(book.dateRead);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();

      if (isNaN(year)) {
        continue;
      }

      if (!Array.isArray(allDatesRead[year])) {
        allDatesRead[year] = [];
      }

      if (!allDatesRead[year].includes(month)) {
        allDatesRead[year].push(month);
      }
    }

    return allDatesRead;
  }

  async calculateCountsYear(allDatesRead: AllDatesRead, firstYear: number, secondYear: number): Promise<CountsYear> {
    const years = Object.keys(allDatesRead).slice().sort(sortDesc);
    const firstSlice = years.includes(secondYear.toString()) ? years.indexOf(secondYear.toString()) : 0;
    const lastSlice = years.includes(firstYear.toString()) ? years.indexOf(firstYear.toString()) + 1 : defaultNumberOfYears;
    const sortedYears = this.sortedYears(allDatesRead, firstSlice, lastSlice);
    const countsYear = {};

    for (const year of sortedYears) {
      countsYear[year] = await this.calculateBookAndPageCounts(Number(year));
    }

    return {
      countsYear,
      firstYear,
      secondYear,
    };
  }

  async calculateCountsMonthYear(allDatesRead: AllDatesRead, year: number): Promise<CountsMonth> {
    const sortedMonths = allDatesRead[year].slice().sort(sortDesc);
    const countsMonthYearOnlyMonth = {};

    for (let month of sortedMonths) {
      month += 1;
      countsMonthYearOnlyMonth[month] = await this.calculateBookAndPageCounts(year, month);
    }

    const countsMonthYear = {};
    countsMonthYear[year] = countsMonthYearOnlyMonth;

    return countsMonthYear;
  }

  sortedYears(allDatesRead: AllDatesRead, firstSlice = 0, lastSlice = defaultNumberOfYears): string[] {
    const sortedYears = Object.keys(allDatesRead).slice().sort(sortDesc);
    return sortedYears.slice(firstSlice, lastSlice);
  }

  async calculateBookAndPageCounts(year: number, month?: number): Promise<BookAndPageCounts> {
    const results = month
      ? await Book.getByMonthYear(month, year)
      : await Book.getByYear(year);

    let pageCount = 0;

    for (const result of results) {
      const pageCountInt = result.pageCount;

      if (result.pageCount && !isNaN(pageCountInt)) {
        pageCount += pageCountInt;
      }
    }

    return {
      bookCount: results.length,
      pageCount,
    };
  }
}
