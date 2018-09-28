'use strict';

module.exports = {
    up: async (query, DataTypes) => {
        try {
            const desc = await query.describeTable('preferences');
            if (desc.fetchBooksByAuthor || desc.fetchBooksByAuthorLanguage) return Promise.resolve();
        }
        catch(error) {
            // Silently fail because the table most likely doesn't exist and will be
            // created later
            return Promise.resolve();
        }

        await query.addColumn(
            'preferences', 'fetchBooksByAuthor',
            DataTypes.BOOLEAN,
            {
                allowNull: true
            }
        );

        return query.addColumn(
            'preferences', 'fetchBooksByAuthorLanguage',
            DataTypes.STRING,
            {
                allowNull: false
            }
        );
    },

    down: query => {
        return query.sequelize.query(
            [
                'ALTER TABLE "preferences" DROP COLUMN "fetchBooksByAuthor";',
                'ALTER TABLE "preferences" DROP COLUMN "fetchBooksByAuthorLanguage";'
            ].join(''),
            { raw: true });
    }
};
