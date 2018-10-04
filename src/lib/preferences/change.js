'use strict';

const Preferences = require('../../models/preferences');


module.exports = async values => {
    let preferences = await Preferences.findById(1);
    preferences = await preferences.updateAttributes(values);

    localStorage.setItem('preferences', JSON.stringify(preferences));

    return preferences;
};
