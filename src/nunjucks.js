'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const allLanguages = require('iso-639-1');


const pathToViews = path.join(__dirname, '/templates');
const fileSystemLoader = new nunjucks.FileSystemLoader(pathToViews);
const nunjucksEnv = new nunjucks.Environment(fileSystemLoader);

nunjucksEnv.addFilter('getLanguageName', code => {
  return allLanguages.getName(code);
});

nunjucksEnv.addFilter('getLanguageNativeName', code => {
  return allLanguages.getNativeName(code);
});

module.exports = nunjucksEnv;
