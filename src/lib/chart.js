'use strict';

const Chart = require('chart.js');

const fakeDiv = document.querySelector('div');

Chart.defaults.global.defaultFontFamily = window.getComputedStyle(fakeDiv).fontFamily;

const defaultOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
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
    // Values that shouldn't be cached
    Chart.defaults.global.defaultFontColor = window.getComputedStyle(fakeDiv).color;

    return {
        Chart,
        defaultOptions,
        doughnutOptions,
        backgroundColor
    };
};
