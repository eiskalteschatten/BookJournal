'use strict';

const path = require('path');
const Umzug = require('umzug');

const db = require('./db');

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: db,
    },

    migrations: {
        params: [
            db.getQueryInterface(),
            db.constructor,
            function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
        path: path.join(__dirname, 'migrations'),
        pattern: /\.js$/
    },

    logging: function() {
        console.log.apply(null, arguments);
    },
});

function logUmzugEvent(eventName) {
    return function(name) {
        console.log(`${ name } ${ eventName }`);
    };
}

umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));


function cmdStatus() {
    const result = {};

    return umzug.executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        }).then(pending => {
            result.pending = pending;
            return result;
        }).then(({ executed, pending }) => {
            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
            const status = {
                current: current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file),
            };

            console.log(JSON.stringify(status, null, 2));

            return { executed, pending };
        });
}

function cmdMigrate() {
    return umzug.up();
}

function cmdMigrateNext() {
    return cmdStatus()
        .then(({ pending }) => {
            if (pending.length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            const next = pending[0].name;
            return umzug.up({ to: next });
        });
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdResetPrev() {
    return cmdStatus()
        .then(({ executed }) => {
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }
            const prev = executed[executed.length - 1].name;
            return umzug.down({ to: prev });
        });
}


module.exports = {
    cmdStatus,
    cmdMigrate,
    cmdMigrateNext,
    cmdReset,
    cmdResetPrev
};
