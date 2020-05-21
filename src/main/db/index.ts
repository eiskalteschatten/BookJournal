
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import migrateDb from 'sequelize-migration-wrapper';

import config from '../../config';

const dbConfig = config.database;
const dbPath = dbConfig.path;
const dbFile = path.join(dbPath, dbConfig.fileName);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile
});

export default sequelize;

migrateDb({
  sequelize,
  path: path.resolve(__dirname, './migrations'),
  filePattern: /\.ts|\.js$/
});

export async function setupSequelize(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await migrateDb.migrate();
    console.log('Database migration scripts successfully executed.');
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize;
}

export const createBackup = (): Promise<void> =>
  new Promise((resolve, reject) => {
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
