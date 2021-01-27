import ListElement from '.';

export default class SpacerListElement extends ListElement {
  constructor() {
    super('', '');
    this.classes = 'list-element-spacer';
    this.type = 'spacer';
  }
}
