import Preferences from './db/models/Preferences';

export let preferences: Preferences;

export const loadPreferences = async (): Promise<Preferences> => {
  try {
    preferences = await Preferences.findByPk(1);

    if (!preferences) {
      preferences = await Preferences.create();
      console.log('Created the preferences table');
    }

    return preferences;
  }
  catch (error) {
    throw error;
  }
};
