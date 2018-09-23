'use strict';

const path = require('path');
const os = require('os');

const env = process.env.NODE_ENV;

const tempStoragePath = path.join(os.tmpdir(), 'bookjournal');
const bookcoversDir = env === 'development' ? 'bookcovers-dev' : 'bookcovers';
let storagePath;

switch(process.platform) {
    case 'darwin':
        storagePath = path.join(os.homedir(), 'Library', 'Application Support', 'BookJournal');
        break;
    case 'win32':
        storagePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Alex Seifert', 'BookJournal');
        break;
    default:
        storagePath = path.join(os.homedir(), '.bookjournal');
        break;
}

console.log('Application data is saved at:', storagePath);


module.exports = {
    app: {
        name: 'BookJournal',
        version: '0.4.0',
        storagePath,
        tempStoragePath
    },
    updates: {
        url: 'https://www.alexseifert.com/bookjournal/api/check-for-updates/'
    },
    database: {
        path: storagePath,
        fileName: env === 'development' ? 'bookjournal-dev.sqlite' : 'bookjournal.sqlite'
    },
    bookcovers: {
        path: path.join(storagePath, bookcoversDir),
        tempPath: path.join(tempStoragePath, bookcoversDir),
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg']
    },
    bookInfo: {
        google: {
            url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}'
        }
    },
    statistics: {
        defaultNumberOfYears: 7
    }
};
