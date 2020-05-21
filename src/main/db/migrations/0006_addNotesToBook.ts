import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: any) => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.notes) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    return query.addColumn(
      'books',
      'notes',
      {
        type: DataTypes.TEXT,
        allowNull: true
      }
    );
  },

  down: async (query: QueryInterface) => {
    return query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "notes";'
      ].join(''),
      { raw: true });
  }
};
