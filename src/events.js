'use strict';

require('./events/sidebar');
require('./events/categories');

if (process.platform === 'darwin') {
    require('./events/macos');
}
