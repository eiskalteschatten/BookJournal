'use strict';

const $ = require('jquery');

const ListElement = require('../listElement');


class SidebarListElement extends ListElement {
    constructor(displayName, iconPath = '', query) {
        super(displayName, iconPath);
        this.query = query;
    }
}

module.exports = SidebarListElement;
