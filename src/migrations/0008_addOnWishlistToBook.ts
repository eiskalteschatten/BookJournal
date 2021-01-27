import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.onWishlist) {
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
      'onWishlist',
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    );
  },

  down: async (query: QueryInterface): Promise<void> => {
    await query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "onWishlist";',
      ].join(''),
      { raw: true });
  },
};
