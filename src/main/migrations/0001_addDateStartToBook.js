'use strict';

module.exports = {
  up: async (query, DataTypes) => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.dateStarted) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    return query.addColumn(
      'books', 'dateStarted',
      DataTypes.DATEONLY,
      {
        allowNull: true
      }
    );
  },

  down: query => {
    return query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "dateStarted";'
      ].join(''),
      { raw: true });
  }
};