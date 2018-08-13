'use strict';

const path = require('path');
const os = require('os');

module.exports = {
    'database': {
        'path': path.join(os.homedir(), '.bookjournal'),
        'fileName': 'bookjournal.sqlite'
    }
};
