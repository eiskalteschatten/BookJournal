import { Sequelize } from 'sequelize-typescript';
import fs, { promises as fsPromises } from 'fs';
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
  models: [__dirname + '/models'],
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

export const createBackup = async (): Promise<void> => {
  if (fs.existsSync(dbFile)) {
    const dbBackupFile = path.join(dbPath, dbConfig.backupFileName);
    await fsPromises.copyFile(dbFile, dbBackupFile);
  }
};
