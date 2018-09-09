'use strict';

const Modal = require('../modal');
const PreferencesModel = require('../../models/preferences');


class Preferences extends Modal {
    constructor() {
        super('preferences');
    }

    async getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.preferences = await PreferencesModel.findById(1);

        return object;
    }
}

module.exports = Preferences;
