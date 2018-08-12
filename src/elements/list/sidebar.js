'use strict';

const $ = require('jquery');

const List = require('../list');
const ListElement = require('../listElement/sidebar');


class Sidebar extends List {
    addElement(displayName, iconPath = '', query) {
        const element = new ListElement(displayName, iconPath, query);
        this.elements.push(element);
    }
}

module.exports = Sidebar;
