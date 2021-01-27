import Preferences from './models/preferences';

export let preferences: Preferences;

export async function loadPreferences(): Promise<Preferences> {
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
  }
}
