import path from 'path';
import os from 'os';
import fs from 'fs';

export interface Config {
  app: {
    name: string;
    version: string;
    storagePath: string;
    tempStoragePath: string;
  };
  updates: {
    url: string;
  };
  database: {
    path: string;
    fileName: string;
    backupFileName: string;
  };
  bookcovers: {
    path: string;
    tempPath: string;
    extensions: string[];
  };
  bookInfo: {
    google: {
      urlIsbn: string;
      urlAuthors: string;
      authorsMaxResults: number;
    };
  };
  statistics: {
    defaultNumberOfYears: number;
  }
}

const env = process.env.NODE_ENV;

const bookInfoAuthorsMaxResults = 40;

const tempStoragePath = path.join(os.tmpdir(), 'bookjournal');
const bookcoversDir = env === 'development' ? 'bookcovers-dev' : 'bookcovers';
let storagePath: string;

switch (process.platform) {
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

if (!fs.existsSync(tempStoragePath)) {
  fs.mkdirSync(tempStoragePath, { recursive: true });
}

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

console.log('Application data is saved at:', storagePath);


export default {
  app: {
    name: 'BookJournal',
    version: '1.1.0',
    storagePath,
    tempStoragePath,
  },
  updates: {
    url: 'https://www.alexseifert.com/api/bookjournal/check-for-updates/',
  },
  database: {
    path: storagePath,
    fileName: env === 'development' ? 'bookjournal-dev.sqlite' : 'bookjournal.sqlite',
    backupFileName: env === 'development' ? 'bookjournal-dev-backup.sqlite' : 'bookjournal-backup.sqlite',
  },
  bookcovers: {
    path: path.join(storagePath, bookcoversDir),
    tempPath: path.join(tempStoragePath, bookcoversDir),
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  },
  bookInfo: {
    google: {
      urlIsbn: 'https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}',
      urlAuthors: 'https://www.googleapis.com/books/v1/volumes?q=author:${authors}&langRestrict=${lang}&startIndex=${index}&maxResults=' + bookInfoAuthorsMaxResults,
      authorsMaxResults: bookInfoAuthorsMaxResults,
    },
  },
  statistics: {
    defaultNumberOfYears: 7,
  },
} as Config;
