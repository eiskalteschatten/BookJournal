'use strict';

const ListElement = require('../listElement');


class TitleListElement extends ListElement {
  constructor(displayName) {
    super(displayName, '');
    this.classes = 'list-element-title';
    this.type = 'title';
  }
}

module.exports = TitleListElement;
