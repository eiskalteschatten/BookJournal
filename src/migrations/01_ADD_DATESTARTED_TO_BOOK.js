'use strict';

module.exports = {
    up: (query, DataTypes) => {
        return query.addColumn(
            'books', 'dateStarted',
            DataTypes.DATEONLY,
            {
                allowNull: true
            }
        );
    },

    down: query => {
        return query.sequelize.query(
            [
                'ALTER TABLE "books" DROP COLUMN "dateStarted";'
            ].join(''),
            { raw: true });
    }
};
