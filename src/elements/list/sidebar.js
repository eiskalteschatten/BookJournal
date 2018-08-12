'use strict';

const List = require('../list');
const ListElement = require('../listElement/sidebar');


class Sidebar extends List {
    addElement(displayName, iconPath = '', queryType) {
        const element = new ListElement(displayName, iconPath, queryType);
        this.elements.push(element);
    }
}

module.exports = Sidebar;
