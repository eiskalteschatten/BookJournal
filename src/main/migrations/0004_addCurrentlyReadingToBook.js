'use strict';

module.exports = {
  up: async (query, DataTypes) => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.currentlyReading) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    return query.addColumn(
      'books',
      'currentlyReading',
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: query => {
    return query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "currentlyReading";'
      ].join(''),
      { raw: true });
  }
};
