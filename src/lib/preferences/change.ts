import Preferences from '../../models/preferences';

export default async (values: Preferences): Promise<Preferences> => {
  let preferences = await Preferences.findByPk(1);
  preferences = await preferences.update(values);

  localStorage.setItem('preferences', JSON.stringify(preferences));

  return preferences;
};
