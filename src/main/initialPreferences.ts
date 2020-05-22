import Preferences from './db/models/Preferences';

export let preferences: Preferences;

export const loadPreferences = async (): Promise<Preferences> => {
  preferences = await Preferences.findByPk(1, { raw: true });

  if (!preferences) {
    preferences = await Preferences.create({ raw: true });
    console.log('Created the preferences table');
  }

  return preferences;
};
