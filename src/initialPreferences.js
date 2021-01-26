'use strict';

const Preferences = require('./models/preferences');

let preferences;

async function loadPreferences() {
  try {
    preferences = await Preferences.findByPk(1);

    if (!preferences) {
      preferences = await Preferences.create();
      console.log('Created the preferences table');
    }

    return preferences;
  }
  catch (error) {
    console.error('An error occurred while loading preferences:', error);
    return;
  }
}

module.exports = {
  preferences,
  loadPreferences,
};
