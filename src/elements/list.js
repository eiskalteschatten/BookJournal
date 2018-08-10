'use strict';

const $ = require('jquery');

const ListElement = require('./listElement');


class List {
    constructor($anchor) {
        this.$anchor = $anchor;
        this.elements = [];
        this.$listHtml = $('<ul class="list"></ul>');
    }

    render() {
        const $anchor = this.$anchor;
        $anchor.html('');
        for(const element of this.elements) {
            this.$listHtml.append(element.render());
        }

        $anchor.html(this.$listHtml);
    }

    addElement(displayName, iconPath = '') {
        const element = new ListElement(displayName, iconPath);
        this.elements.push(element);
    }

    addElements(elements) {
        for(const element of elements) {
            this.addElements(element.displayName, element.iconPath);
        }
    }
}

module.exports = List;
