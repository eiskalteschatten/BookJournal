'use strict';

const Preferences = require('./models/preferences');

let preferences;

async function loadPreferences() {
    try {
        preferences = await Preferences.findOrCreate({where: {id: 1}});
        preferences = preferences[0];
        return preferences;
    }
    catch(error) {
        console.error('An error occurred while loading preferences:', error);
        return;
    }
}

module.exports = {
    preferences,
    loadPreferences
};
