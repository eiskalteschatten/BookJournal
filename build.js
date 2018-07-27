'use strict';

const path = require('path');
const compileSass = require('compile-sass');

const cssConfig = require('./src/config/css');

const pathToAssets = './src/assets/';


module.exports = async () => {
    await compileSass.compileSassAndSaveMultiple({
        sassPath: path.join(pathToAssets, '/scss/'),
        cssPath: path.join(pathToAssets, '/css/'),
        files: cssConfig.sassFilesToCompile
    });
};
