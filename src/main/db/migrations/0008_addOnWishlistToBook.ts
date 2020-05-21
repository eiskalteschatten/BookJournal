import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: any) => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.onWishlist) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    return query.addColumn(
      'books',
      'onWishlist',
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: async (query: QueryInterface) => {
    return query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "onWishlist";'
      ].join(''),
      { raw: true });
  }
};
