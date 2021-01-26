'use strict';

const Sequelize = require('sequelize');
const { Op } = Sequelize;

const db = require('../db').sequelize;


const Book = db.define('book', {
  title: Sequelize.STRING,
  author: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  editor: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  dateStarted: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  dateRead: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM(['notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak']),
    defaultValue: 'notReadYet',
  },
  onWishlist: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  pageCount: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bookcover: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  publisher: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isbn: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  yearPublished: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  bookFormat: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nationality: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  languageReadIn: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  originalLanguage: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  translator: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tags: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  categories: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  summary: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  commentary: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

Book.getAllSorted = async function(sortBy = 'title', sortOrder = 'ASC') {
  return await this.findAll({
    order: [
      [
        Sequelize.fn('lower', Sequelize.col(sortBy)),
        sortOrder,
      ],
    ],
  });
};

Book.getSortedByQuery = async function(query, sortBy = 'title', sortOrder = 'ASC') {
  query.order = [
    [
      Sequelize.fn('lower', Sequelize.col(sortBy)),
      sortOrder,
    ],
  ];

  return await this.findAll(query);
};

Book.getByYear = async function(year) {
  return await db.query(`SELECT * FROM books where strftime('%Y', dateRead) IN('${year}');`, { model: this });
};

Book.getByMonthYear = async function(month, year) {
  if (month < 10) month = `0${month}`;
  return await db.query(`SELECT * FROM books where strftime('%Y-%m', dateRead) IN('${year}-${month}');`, { model: this });
};

Book.getHasBeenRead = async function(title, authors, isbns) {
  return await this.findOne({
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: `%${title}%` },
          author: { [Op.like]: `%${authors}%` },
          status: 'read',
          dateRead: {
            [Op.ne]: null,
            [Op.notLike]: 'Invalid%',
          },
        },
        {
          isbn: isbns,
          status: 'read',
          dateRead: {
            [Op.ne]: null,
            [Op.notLike]: 'Invalid%',
          },
        },
      ],
    },
  });
};

Book.sync();

module.exports = Book;
