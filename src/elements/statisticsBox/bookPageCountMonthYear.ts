import path from 'path';

import chartModule from '../../lib/chart';
import StatisticsBox from '../statisticsBox';
import { AllDatesRead, BookAndPageCounts, RenderedGraphs, Statistics } from '../../interfaces/statistics';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class BookPageCountMonthYear extends StatisticsBox {
  private allDatesRead: AllDatesRead;
  private latestYear: number;
  private monthStatistics: BookAndPageCounts;

  constructor(statistics: Statistics) {
    super(statistics);

    const sortedYears = Object.keys(statistics.countsMonthYear).sort((a: any, b: any): any => b - a).map(Number);
    this.latestYear = sortedYears[0];
    this.monthStatistics = statistics.countsMonthYear[this.latestYear];
    this.allDatesRead = statistics.allDatesRead;
    this.template = path.join(__dirname, '../../templates/statisticsBox/bookPageCountMonthYear.njk');
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();
    object.latestYear = this.latestYear;
    object.allDatesRead = this.allDatesRead;
    return object;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async renderGraphs($booksGraph: any, $pagesGraph: any, $booksDoughnutGraph: any, $pagessDoughnutGraph: any): Promise<RenderedGraphs> {
    const chart = chartModule();
    const statistics = this.monthStatistics;

    const labels = [];
    const booksReadData = [];
    const pagesReadData = [];

    for (const month in statistics) {
      labels.push(monthNames[Number(month) - 1]);
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
