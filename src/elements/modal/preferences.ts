import allLanguages from 'iso-639-1';

import Modal from '../modal';
import PreferencesModel from '../../models/preferences';

export default class Preferences extends Modal {
  constructor() {
    super('preferences');
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();
    const allLanguageCodes = allLanguages.getAllCodes();

    object.preferences = await PreferencesModel.findByPk(1);
    object.allLanguageCodes = allLanguageCodes;

    return object;
  }
}
