'use strict';

const Modal = require('../modal');


class Preferences extends Modal {
    constructor() {
        super('preferences');
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();


        return object;
    }
}

module.exports = Preferences;
