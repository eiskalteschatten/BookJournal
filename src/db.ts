import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

import config from './config';
const { database: dbConfig } = config;

const dbPath = dbConfig.path;
const dbFile = path.join(dbPath, dbConfig.fileName);

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

export const createBackup = (): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (fs.existsSync(dbFile)) {
      const dbBackupFile = path.join(dbPath, dbConfig.backupFileName);
      fs.copyFile(dbFile, dbBackupFile, error => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    }
  });
