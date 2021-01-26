'use strict';

const Sequelize = require('sequelize');

module.exports = {
  up: async (query, DataTypes) => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.status) {
        return Promise.resolve(); 
      }
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    await query.addColumn(
      'books',
      'status',
      {
        type: DataTypes.ENUM(['notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak']),
        defaultValue: 'notReadYet',
      }
    );

    await query.sequelize.query(
      [
        'UPDATE "books" SET "status"=\'currentlyReading\' where "currentlyReading" = 1;',
      ].join(''),
      { raw: true });

    await query.removeColumn('books', 'notReadYet');
    return query.removeColumn('books', 'currentlyReading');
  },

  down: async query => {
    await query.addColumn(
      'books',
      'notReadYet',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    );

    await query.addColumn(
      'books',
      'currentlyReading',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    );
    return query.removeColumn('books', 'status');
  },
};
