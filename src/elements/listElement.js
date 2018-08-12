'use strict';

const $ = require('jquery');
const uuidv4 = require('uuid/v4');


class ListElement {
    constructor(displayName, iconPath = '') {
        this.displayName = displayName;
        this.iconPath = iconPath;
        this.id = uuidv4();
        this.classes = 'list-element js-list-element';
        this.$html = $(`<li id="${this.id}" class="${this.classes}"></li>`);
    }

    render() {
        this.$html.html(this.displayName);
        return this.$html;
    }
}

module.exports = ListElement;
