import Chart from 'chart.js';

export interface AllDatesRead {
  [year: number]: number[];
}

export interface BookAndPageCounts {
  bookCount: number;
  pageCount: number;
}

export interface CountsYear {
  countsYear: {
    [year: number]: BookAndPageCounts;
  };
  firstYear: number;
  secondYear: number;
}

export interface CountsMonth {
  [month: number]: BookAndPageCounts;
}

export interface Statistics {
  allDatesRead: AllDatesRead;
  countsYearObj?: CountsYear;
  countsMonthYear?: CountsMonth;
}

export interface NoResults {
  noResults: boolean;
}

export interface RenderedGraphs {
  booksReadGraph: Chart;
  booksReadDoughnutGraph?: Chart;
  pagesReadGraph: Chart;
  pagesReadDoughnutGraph?: Chart;
}
