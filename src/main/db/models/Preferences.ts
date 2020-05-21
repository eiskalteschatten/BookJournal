import { Model, DataTypes } from 'sequelize';

import sequelize from '../';

export class Preferences extends Model {
  id!: number;
  windowWidth: number;
  windowHeight: number;
  windowX: number;
  windowY: number;
  windowIsMaximized: boolean;
  windowIsFullScreen: boolean;
  sidebarWidth: number;
  middleColumnWidth: number;
  theme: string;
  fetchBookInfoFromGoogle: boolean;
  checkForUpdates: boolean;
  fetchBooksByAuthor: boolean;
  fetchBooksByAuthorLanguage: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

Preferences.init({
  windowWidth: {
    type: DataTypes.INTEGER,
    defaultValue: 1200
  },
  windowHeight: {
    type: DataTypes.INTEGER,
    defaultValue: 800
  },
  windowX: DataTypes.INTEGER,
  windowY: DataTypes.INTEGER,
  windowIsMaximized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  windowIsFullScreen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sidebarWidth: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  middleColumnWidth: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  theme: {
    type: DataTypes.STRING,
    defaultValue: 'light'
  },
  fetchBookInfoFromGoogle: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  checkForUpdates: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fetchBooksByAuthor: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fetchBooksByAuthorLanguage: {
    type: DataTypes.STRING,
    defaultValue: 'en'
  }
}, {
  sequelize,
  modelName: 'preferences'
});

Preferences.sync();

export default Preferences;
