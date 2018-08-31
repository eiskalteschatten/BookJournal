'use strict';

const path = require('path');
const nunjucks = require('nunjucks');

const pathToViews = path.join(__dirname, '/templates');
const fileSystemLoader = new nunjucks.FileSystemLoader(pathToViews);

module.exports = new nunjucks.Environment(fileSystemLoader);
