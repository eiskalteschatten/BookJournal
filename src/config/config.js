'use strict';

const path = require('path');
const os = require('os');

const packageJson = require('../../package');

const tempStoragePath = path.join(os.tmpdir(), 'bookjournal');
const storagePath = path.join(os.homedir(), '.bookjournal');


module.exports = {
    app: {
        name: packageJson.build.productName,
        version: packageJson.version,
        storagePath,
        tempStoragePath
    },
    database: {
        path: storagePath,
        fileName: 'bookjournal.sqlite'
    },
    bookcovers: {
        path: path.join(storagePath, 'bookcovers'),
        tempPath: path.join(tempStoragePath, 'bookcovers'),
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg']
    },
    bookInfo: {
        google: {
            url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}'
        }
    }
};
