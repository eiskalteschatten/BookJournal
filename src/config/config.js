'use strict';

const path = require('path');
const os = require('os');

const tempStoragePath = path.join(os.tmpdir(), 'bookjournal');
const storagePath = path.join(os.homedir(), '.bookjournal');


module.exports = {
    app: {
        name: 'BookJournal',
        version: '0.2.0',
        storagePath,
        tempStoragePath
    },
    updates: {
        url: 'https://www.alexseifert.com/bookjournal/api/check-for-updates/'
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
