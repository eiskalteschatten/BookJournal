'use strict';

const sqlite3 = require('sqlite3');
const Sequelize = require('sequelize');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const config = require('./config/config').database;
const dbPath = config.path;
const dbFile = path.join(dbPath, config.fileName);

if (!fs.existsSync(dbPath)) {
    mkdirp(dbPath);
}

new sqlite3.Database(dbFile);


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
