import Preferences from './models/preferences';

// TODO: use interface!
export let preferences;

// TODO: use interface!
export async function loadPreferences(): Promise<any> {
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
