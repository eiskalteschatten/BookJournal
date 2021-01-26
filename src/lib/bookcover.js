'use strict';

const path = require('path');

const config = require('../config').default;


function pruneCoverPath(bookcoverPath) {
    bookcoverPath = 'file:///' + path.join(config.bookcovers.path, bookcoverPath);
    return bookcoverPath.replace(/\\/g, '/');
}

module.exports = {
    pruneCoverPath
};
