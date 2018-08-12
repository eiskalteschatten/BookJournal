'use strict';

const $ = require('jquery');

const ListElement = require('../listElement');


class SidebarListElement extends ListElement {
    constructor(displayName, iconPath = '', queryType) {
        super(displayName, iconPath);
        this.queryType = queryType;
        this.classes = 'list-element js-sidebar-list-element';
    }

    getNunjucksRenderObject() {
        const object = super.getNunjucksRenderObject();

        object.dataFields = {
            'query-type': this.queryType
        };

        return object;
    }

    static onClick($element) {
        $('.js-sidebar-list-element').removeClass('selected');
        $element.addClass('selected');
    }
}

module.exports = SidebarListElement;
