'use strict';

const Chart = require('chart.js');

const fakeDiv = document.querySelector('div');

Chart.defaults.global.defaultFontFamily = window.getComputedStyle(fakeDiv).fontFamily;

const defaultOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            gridLines: {}
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            },
            gridLines: {}
        }]
    },
    legend: {
        display: false
    }
};

const doughnutOptions = {
    scales: {
        yAxes: [{
            display: false
        }],
        xAxes: [{
            display: false
        }]
    },
    legend: {
        display: false
    }
};

const backgroundColor = [
    'rgba(252, 42, 28, 1)',
    'rgba(253, 146, 38, 1)',
    'rgba(16, 64, 251, 1)',
    'rgba(255, 249, 55, 1)',
    'rgba(145, 248, 49, 1)'
];


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
        backgroundColor
    };
};
