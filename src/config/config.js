'use strict';

const path = require('path');
const os = require('os');

const packageJson = require('../../package');

const storagePath = path.join(os.homedir(), '.bookjournal');


module.exports = {
    app: {
        name: 'Book Journal',
        version: packageJson.version,
        storagePath
    },
    database: {
        path: storagePath,
        fileName: 'bookjournal.sqlite'
    },
    bookcovers: {
        path: path.join(storagePath, 'bookcovers'),
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg']
    },
    bookInfo: {
        google: {
            url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDMzF8mEWNLmjij8U11P7ELIhjQObgBjtg'
        }
    }
};
