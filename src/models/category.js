'use strict';

const Sequelize = require('sequelize');
const db = require('../db');


const Category = db.define('category', {
    name: Sequelize.STRING,
    color: Sequelize.STRING
});

Category.sync();

module.exports = Category;
