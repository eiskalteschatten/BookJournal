'use strict';

const Sequelize = require('sequelize');
const db = require('../db');


const Preferences = db.define('preferences', {
    windowWidth: Sequelize.INTEGER,
    windowHeight: Sequelize.INTEGER,
    windowX: Sequelize.INTEGER,
    windowY: Sequelize.INTEGER,
    windowIsMaximized: Sequelize.BOOLEAN,
    windowIsFullScreen: Sequelize.BOOLEAN
});

Preferences.sync({alter: true});

module.exports = Preferences;
