'use strict';

const $ = require('jquery');

const ListElement = require('../listElement');
const filterBooks = require('../../filters/books');


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

    static async onClick($element) {
        $('.js-sidebar-list-element').removeClass('selected');
        $element.addClass('selected');
        return await filterBooks($element.data('query-type'), $element.data('id'));
    }
}

module.exports = SidebarListElement;
