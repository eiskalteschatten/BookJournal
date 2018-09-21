'use strict';

const Chart = require('chart.js');

const theme = localStorage.getItem('theme');


Chart.defaults.global.defaultFontColor = theme === 'light' ? '#0e0e0e' : '#e0e0e0';
Chart.defaults.global.defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif';


const defaultOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    legend: {
        display: false
    },
};

const backgroundColor = [
    'rgba(252, 42, 28, 1)',
    'rgba(253, 146, 38, 1)',
    'rgba(16, 64, 251, 1)',
    'rgba(255, 249, 55, 1)',
    'rgba(145, 248, 49, 1)'
];

module.exports = {
    Chart,
    defaultOptions,
    backgroundColor
};
