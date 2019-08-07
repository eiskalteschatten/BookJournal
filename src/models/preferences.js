'use strict';

const Sequelize = require('sequelize');
const db = require('../db').sequelize;


const Preferences = db.define('preferences', {
    windowWidth: {
        type: Sequelize.INTEGER,
        defaultValue: 1200
    },
    windowHeight: {
        type: Sequelize.INTEGER,
        defaultValue: 800
    },
    windowX: Sequelize.INTEGER,
    windowY: Sequelize.INTEGER,
    windowIsMaximized: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    windowIsFullScreen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    sidebarWidth: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    middleColumnWidth: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    theme: {
        type: Sequelize.STRING,
        defaultValue: 'light'
    },
    fetchBookInfoFromGoogle: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    checkForUpdates: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    fetchBooksByAuthor: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    fetchBooksByAuthorLanguage: {
        type: Sequelize.STRING,
        defaultValue: 'en'
    }
});

Preferences.sync();

module.exports = Preferences;
