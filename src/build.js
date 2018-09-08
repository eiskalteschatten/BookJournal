'use strict';

const path = require('path');
const fs = require('fs');
const compileSass = require('compile-sass');
const electronLink = require('electron-link');
const UglifyJS = require('uglify-js');

const cssConfig = require('./config/css');

const basePath = './src';
const pathToAssets = './src/assets/';


module.exports = async () => {
    try {
        const excludedModules = new Set(['electron', 'remote']);
        const snapshotScript = await electronLink({
            baseDirPath: basePath,
            mainPath: `${basePath}/main.js`,
            cachePath: './.build-cache',
            shouldExcludeModule: ({requiringModulePath, requiredModulePath}) => {
                const requiredModuleRelativePath = path.relative(basePath, requiredModulePath);

                console.log(requiringModulePath, requiredModulePath);

                return excludedModules.has(requiredModulePath) ||
                    requiredModuleRelativePath === path.join('..', 'node_modules', 'electron', 'index.js');
            }
        });

        const snapshotScriptPath = `${basePath}/mainSnapshot.js`;

        const minified = UglifyJS.minify({snapshotScriptPath: snapshotScript}, {
            sourceMap: {
                filename: snapshotScriptPath,
                url: `${snapshotScriptPath}.map`
            }
        });

        if (minified.error) throw new Error(minified.error);

        fs.writeFileSync(snapshotScriptPath, minified.code);

        await compileSass.compileSassAndSaveMultiple({
            sassPath: path.join(pathToAssets, '/scss/'),
            cssPath: path.join(pathToAssets, '/css/'),
            files: cssConfig.sassFilesToCompile
        });
    }
    catch(error) {
        throw new Error(error);
    }
};
