'use strict';

const path = require('path');
const compileSass = require('compile-sass');
const fs = require('fs');

const pathToCss = path.resolve('./dist/assets/css');
const pathToScss = path.resolve('./src/assets/scss');


async function build() {
  try {
    fs.readdir(pathToScss, async (error, files) => {
      if (error) {
        console.error(error);
        return;
      }

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
    });
  }
  catch (error) {
    console.error(error);
  }
}

build();
