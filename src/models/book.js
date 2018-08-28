'use strict';

const Sequelize = require('sequelize');
const db = require('../db');


const Book = db.define('book', {
    title: Sequelize.STRING,
    author: {
        type: Sequelize.STRING,
        allowNull: true
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dateRead: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    notReadYet: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    pageCount: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    color: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bookcover: {
        type: Sequelize.STRING,
        allowNull: true
    },
    publisher: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isbn: {
        type: Sequelize.STRING,
        allowNull: true
    },
    yearPublished: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: true
    },
    languageReadIn: {
        type: Sequelize.STRING,
        allowNull: true
    },
    originalLanguage: {
        type: Sequelize.STRING,
        allowNull: true
    },
    translator: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true
    },
    categories: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    summary: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    commentary: {
        type: Sequelize.TEXT,
        allowNull: true
    },
});

Book.getAllSorted = async function(sortBy = 'title') {
    return await this.findAll({
        order: [
            [
                Sequelize.fn('lower', Sequelize.col(sortBy)),
                'ASC'
            ]
        ]
    });
};

Book.getSortedByQuery = async function(query, sortBy = 'title') {
    return await this.findAll(query, {
        order: [
            [
                Sequelize.fn('lower', Sequelize.col(sortBy)),
                'ASC'
            ]
        ]
    });
};

Book.sync();

module.exports = Book;
