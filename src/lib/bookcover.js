'use strict';

const path = require('path');

const config = require('../config/config');


function pruneCoverPath(bookcoverPath) {
    bookcoverPath = 'file:///' + path.join(config.bookcovers.path, bookcoverPath);
    return bookcoverPath.replace(/\\/g, '/');
}

module.exports = {
    pruneCoverPath
};
