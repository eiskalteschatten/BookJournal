'use strict';

const $ = require('jquery');
const uuidv4 = require('uuid/v4');


class ListElement {
    constructor(displayName, iconPath = '') {
        this.displayName = displayName;
        this.iconPath = iconPath;
        this.id = uuidv4();
        this.$html = $(`<li id="${this.id}" class="list-element"></li>`);
    }

    render() {
        this.$html.html(this.displayName);
        this.$html.click(this.onClick);
        return this.$html;
    }

    onClick() {

    }
}

module.exports = ListElement;
