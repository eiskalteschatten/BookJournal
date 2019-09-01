'use strict';

const Preferences = require('../../models/preferences');


module.exports = async values => {
    let preferences = await Preferences.findByPk(1);
    preferences = await preferences.update(values);

    localStorage.setItem('preferences', JSON.stringify(preferences));

    return preferences;
};
