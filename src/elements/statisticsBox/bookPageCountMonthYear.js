'use strict';

const path = require('path');
const chartModule = require('../../lib/chart');

const StatisticsBox = require('../statisticsBox');

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class BookPageCountMonthYear extends StatisticsBox {
  constructor(statistics, allDatesRead) {
    super(statistics);

    const sortedYears = Object.keys(statistics).sort((a, b) => b - a);
    this.latestYear = sortedYears[0];
    this.monthStatistics = statistics[this.latestYear];
    this.allDatesRead = allDatesRead;
    this.template = path.join(__dirname, '../../templates/statisticsBox/bookPageCountMonthYear.njk');
  }

  async getNunjucksRenderObject() {
    const object = await super.getNunjucksRenderObject();
    object.latestYear = this.latestYear;
    object.allDatesRead = this.allDatesRead;

    return object;
  }

  async renderGraphs($booksGraph, $pagesGraph, $booksDoughnutGraph, $pagessDoughnutGraph) {
    const chart = chartModule();
    const statistics = this.monthStatistics;

    const labels = [];
    const booksReadData = [];
    const pagesReadData = [];

    for (const month in statistics) {
      labels.push(monthNames[month - 1]);
      booksReadData.push(statistics[month].bookCount);
      pagesReadData.push(statistics[month].pageCount);
    }

    const booksReadGraph = new chart.Chart($booksGraph, {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          label: 'Books Read Per Month',
          data: booksReadData,
          backgroundColor: chart.backgroundColor,
        }],
      },
      options: chart.defaultOptions,
    });

    const booksReadDoughnutGraph = new chart.Chart($booksDoughnutGraph, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Books Read Per Month',
          data: booksReadData,
          backgroundColor: chart.backgroundColor,
          borderWidth: 0,
        }],
      },
      options: chart.doughnutOptions,
    });

    const pagesReadGraph = new chart.Chart($pagesGraph, {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          label: 'Pages Read Per Month',
          data: pagesReadData,
          backgroundColor: chart.backgroundColor,
        }],
      },
      options: chart.defaultOptions,
    });

    const pagesReadDoughnutGraph = new chart.Chart($pagessDoughnutGraph, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Pages Read Per Month',
          data: pagesReadData,
          backgroundColor: chart.backgroundColor,
          borderWidth: 0,
        }],
      },
      options: chart.doughnutOptions,
    });

    return {
      booksReadGraph,
      booksReadDoughnutGraph,
      pagesReadGraph,
      pagesReadDoughnutGraph,
    };
  }
}

module.exports = BookPageCountMonthYear;
