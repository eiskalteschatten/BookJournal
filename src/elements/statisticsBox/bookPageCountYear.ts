import path from 'path';

import chartModule from '../../lib/chart';
import StatisticsBox from '../statisticsBox';
import { AllDatesRead, CountsYear, RenderedGraphs, Statistics } from '../../interfaces/statistics';

export default class BookPageCountYear extends StatisticsBox {
  private countsYearObj: CountsYear;
  private sortedYears: number[];
  private allDatesRead: AllDatesRead;

  constructor(statistics: Statistics) {
    super(statistics);

    this.countsYearObj = statistics.countsYearObj;
    this.sortedYears = Object.keys(this.countsYearObj).sort((a: any, b: any): any => b - a).map(Number);
    this.allDatesRead = statistics.allDatesRead;
    this.template = path.join(__dirname, '../../templates/statisticsBox/bookPageCountYear.njk');
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();
    object.allDatesRead = this.allDatesRead;
    object.firstYear = this.countsYearObj.firstYear;
    object.secondYear = this.countsYearObj.secondYear;
    return object;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async renderGraphs($booksGraph: any, $pagesGraph: any): Promise<RenderedGraphs> {
    const chart = chartModule();

    const labels = [];
    const booksReadData = [];
    const pagesReadData = [];

    for (const year in this.countsYearObj.countsYear) {
      labels.push(year);
      booksReadData.push(this.countsYearObj.countsYear[year].bookCount);
      pagesReadData.push(this.countsYearObj.countsYear[year].pageCount);
    }

    const booksReadGraph = new chart.Chart($booksGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Books Read Per Year',
          data: booksReadData,
          backgroundColor: chart.backgroundColor,
        }],
      },
      options: chart.defaultOptions,
    });

    const pagesReadGraph = new chart.Chart($pagesGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Pages Read Per Year',
          data: pagesReadData,
          backgroundColor: chart.backgroundColor,
        }],
      },
      options: chart.defaultOptions,
    });

    return {
      booksReadGraph,
      pagesReadGraph,
    };
  }
}
