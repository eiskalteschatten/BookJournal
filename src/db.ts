import { Sequelize } from 'sequelize-typescript';
import { setupMigration, migrate } from 'sequelize-migration-wrapper';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

import models from './models';
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
  models,
});

export default sequelize;

setupMigration({
  sequelize,
  path: path.join(__dirname, 'migrations'),
});

export async function setupSequelize(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log('Syncing the models.');

    for (const model of models) {
      await model.sync();
    }

    console.log('Models successfully synced.');

    if (process.env.NODE_ENV !== 'test' && process.env.DISABLE_DB_MIGRATION !== 'true') {
      await migrate();
    }

    console.log('Database migration scripts successfully executed.');
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize;
}

export const createBackup = async (): Promise<void> => {
  if (fs.existsSync(dbFile)) {
    const dbBackupFile = path.join(dbPath, dbConfig.backupFileName);
    await fsPromises.copyFile(dbFile, dbBackupFile);
  }
};
