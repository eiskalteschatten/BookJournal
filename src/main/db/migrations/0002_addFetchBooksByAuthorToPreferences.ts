import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: any) => {
    try {
      const desc = await query.describeTable('preferences');
      if (desc.fetchBooksByAuthor || desc.fetchBooksByAuthorLanguage) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    await query.addColumn(
      'preferences',
      'fetchBooksByAuthor',
      {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    );

    await query.sequelize.query(
      'UPDATE "preferences" SET fetchBooksByAuthor = TRUE;',
      { raw: true }
    );

    await query.addColumn(
      'preferences',
      'fetchBooksByAuthorLanguage',
      {
        type: DataTypes.STRING,
        allowNull: false
      }
    );

    return await query.sequelize.query(
      'UPDATE "preferences" SET fetchBooksByAuthorLanguage = "en";',
      { raw: true }
    );
  },

  down: async (query: QueryInterface) => {
    return query.sequelize.query(
      [
        'ALTER TABLE "preferences" DROP COLUMN "fetchBooksByAuthor";',
        'ALTER TABLE "preferences" DROP COLUMN "fetchBooksByAuthorLanguage";'
      ].join(''),
      { raw: true });
  }
};
