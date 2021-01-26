'use strict';

const allLanguages = require('iso-639-1');
const Modal = require('../modal');
const PreferencesModel = require('../../models/preferences');



class Preferences extends Modal {
  constructor() {
    super('preferences');
  }

  async getNunjucksRenderObject() {
    const object = super.getNunjucksRenderObject();
    const allLanguageCodes = allLanguages.getAllCodes();

    object.preferences = await PreferencesModel.findByPk(1);
    object.allLanguageCodes = allLanguageCodes;

    return object;
  }
}

module.exports = Preferences;
