import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.notes) {
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
      'notes',
      {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    );
  },

  down: async (query: QueryInterface): Promise<void> => {
    await query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "notes";',
      ].join(''),
      { raw: true });
  },
};
