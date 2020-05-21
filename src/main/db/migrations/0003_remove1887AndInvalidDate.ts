import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: any) => {
    try {
      const books = await query.describeTable('books');
      if (!books) return Promise.resolve();
    }
    catch (error) {
      // Silently fail because the table doesn't exist and will be
      // created later
      return Promise.resolve();
    }

    await query.sequelize.query(
      'UPDATE "books" SET dateStarted = NULL where dateStarted LIKE "1887%" OR dateStarted LIKE "Invalid%";',
      { raw: true }
    );

    return await query.sequelize.query(
      'UPDATE "books" SET dateRead = NULL where dateRead LIKE "1887%" OR dateRead LIKE "Invalid%";',
      { raw: true }
    );
  },

  down: async (query: QueryInterface) => {
    await query.sequelize.query(
      'UPDATE "books" SET dateStarted = "1887-09-16" where dateStarted is NULL;',
      { raw: true }
    );

    return await query.sequelize.query(
      'UPDATE "books" SET dateRead = "1887-09-16" where dateRead is NULL;',
      { raw: true }
    );
  }
};
