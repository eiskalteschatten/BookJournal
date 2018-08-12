'use strict';

const $ = require('jquery');

const ListElement = require('../listElement');


class SidebarListElement extends ListElement {
    constructor(displayName, iconPath = '', query) {
        super(displayName, iconPath);
        this.query = query;
        this.classes = 'list-element js-sidebar-list-element';
        this.$html = $(`<li id="${this.id}" class="${this.classes}"></li>`);
    }

    static onClick($element) {
        console.log("clicked!");
    }
}

module.exports = SidebarListElement;
