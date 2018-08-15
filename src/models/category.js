'use strict';

const Sequelize = require('sequelize');
const db = require('../db');


const Category = db.define('category', {
    name: Sequelize.STRING,
    color: Sequelize.STRING
});

Category.getAllSorted = async function() {
    return await this.findAll({
        order: [
            [
                Sequelize.fn('lower',Sequelize.col('name')),
                'ASC'
            ]
        ]
    });
}

Category.sync();

module.exports = Category;
