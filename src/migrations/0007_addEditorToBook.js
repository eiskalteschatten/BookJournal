'use strict';

module.exports = {
    up: async (query, DataTypes) => {
        try {
            const booksDesc = await query.describeTable('books');
            if (booksDesc.editor) return Promise.resolve();
        }
        catch(error) {
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

    down: query => {
        return query.sequelize.query(
            [
                'ALTER TABLE "books" DROP COLUMN "editor";'
            ].join(''),
            { raw: true });
    }
};
