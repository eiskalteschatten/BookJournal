'use strict';

const path = require('path');
const compileSass = require('compile-sass');
const fs = require('fs');
const copyfiles = require('copyfiles');

const pathToCss = path.resolve('./dist/ts/assets/css');
const pathToScss = path.resolve('./src/assets/scss');

copyfiles(['./src/**/*.{html,njk,svg,png}', './dist/ts'], { up: 1 }, async () => {
  try {
    const files = await fs.promises.readdir(pathToScss);
    const scssFiles = [];

    for (const file of files) {
      if (file.charAt(0) !== '_' && path.extname(file) === '.scss') {
        scssFiles.push(file);
      }
    }

    await compileSass.compileSassAndSaveMultiple({
      sassPath: pathToScss,
      cssPath: pathToCss,
      files: scssFiles,
    });
  }
  catch (error) {
    console.error(error);
  }
});
