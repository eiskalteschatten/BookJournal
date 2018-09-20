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
    dateStarted: {
        type: Sequelize.DATEONLY,
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

Book.getAllSorted = async function(sortBy = 'title', sortOrder = 'ASC') {
    return await this.findAll({
        order: [
            [
                Sequelize.fn('lower', Sequelize.col(sortBy)),
                sortOrder
            ]
        ]
    });
};

Book.getSortedByQuery = async function(query, sortBy = 'title', sortOrder = 'ASC') {
    query.order = [
        [
            Sequelize.fn('lower', Sequelize.col(sortBy)),
            sortOrder
        ]
    ];

    return await this.findAll(query);
};

Book.getByYear = async function(year) {
    return await this.findAll({
        where: {
            dateRead: { $like: `${year}-%` }
        }
    });
};

Book.getByMonthYear = async function(month, year) {
    return await this.findAll({
        where: {
            dateRead: { $like: `${year}-${month}%-` }
        }
    });
};

Book.sync();

module.exports = Book;
