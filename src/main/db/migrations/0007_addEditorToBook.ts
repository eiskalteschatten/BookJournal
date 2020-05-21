import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: any): Promise<void> => {
    try {
      const booksDesc = await query.describeTable('books');
      if (booksDesc.editor) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    return query.addColumn(
      'books',
      'editor',
      {
        type: DataTypes.STRING,
        allowNull: true
      }
    );
  },

  down: async (query: QueryInterface): Promise<void> => {
    return query.sequelize.query(
      [
        'ALTER TABLE "books" DROP COLUMN "editor";'
      ].join(''),
      { raw: true });
  }
};
