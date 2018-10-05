'use strict';

const path = require('path');
const compileSass = require('compile-sass');

const cssConfig = require('./config/css');

const pathToAssets = './src/assets/';


async function build() {
    try {
        await compileSass.compileSassAndSaveMultiple({
            sassPath: path.join(pathToAssets, '/scss/'),
            cssPath: path.join(pathToAssets, '/css/'),
            files: cssConfig.sassFilesToCompile
        });
    }
    catch(error) {
        console.error(error);
    }
}

build();

module.exports = build;
