'use strict';

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
        console.log("clicked!");
    }
}

module.exports = SidebarListElement;
