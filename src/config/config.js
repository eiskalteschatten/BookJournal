'use strict';

const path = require('path');
const os = require('os');

const packageJson = require('../../package');


module.exports = {
    'app': {
        'name': 'Book Journal',
        'version': packageJson.version
    },
    'database': {
        'path': path.join(os.homedir(), '.bookjournal'),
        'fileName': 'bookjournal.sqlite'
    }
};
