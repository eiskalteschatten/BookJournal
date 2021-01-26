'use strict';

const ListElement = require('../listElement');


class SpacerListElement extends ListElement {
  constructor() {
    super('', '');
    this.classes = 'list-element-spacer';
    this.type = 'spacer';
  }
}

module.exports = SpacerListElement;
