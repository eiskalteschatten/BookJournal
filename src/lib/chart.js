'use strict';

const Chart = require('chart.js');

const fakeDiv = document.querySelector('div');

Chart.defaults.global.defaultFontFamily = window.getComputedStyle(fakeDiv).fontFamily;

const defaultOptions = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
      },
      gridLines: {},
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
      },
      gridLines: {},
    }],
  },
  legend: {
    display: false,
  },
};

const doughnutOptions = {
  scales: {
    yAxes: [{
      display: false,
    }],
    xAxes: [{
      display: false,
    }],
  },
  legend: {
    display: false,
  },
};

const colors = [
  'rgb(252, 42, 28)',    // red
  'rgb(253, 146, 38)',   // orange
  'rgb(16, 64, 251)',    // blue
  'rgb(255, 249, 55)',   // yellow
  'rgb(145, 248, 49)',   // green
  'rgb(148, 33, 146)',   // purple
  'rgb(0, 253, 255)',    // cyan
  'rgb(255, 64, 255)',   // pink
];

let backgroundColor = [];
const numberOfColors = Math.ceil(100 / colors.length);

for (let i = 0; i <= numberOfColors; i++) {
  backgroundColor = backgroundColor.concat(colors);
}


module.exports = () => {
  const theme = localStorage.getItem('theme');

  // Values that shouldn't be cached
  Chart.defaults.global.defaultFontColor = window.getComputedStyle(fakeDiv).color;

  const gridColor = theme === 'light' ? 'rgba(14, 14, 14, .1)' : 'rgba(224, 224, 224, .1)';
  defaultOptions.scales.yAxes[0].gridLines.color = gridColor;
  defaultOptions.scales.xAxes[0].gridLines.color = gridColor;

  return {
    Chart,
    defaultOptions,
    doughnutOptions,
    backgroundColor,
  };
};
