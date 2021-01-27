import ListElement from '.';

export default class TitleListElement extends ListElement {
  constructor(displayName: string) {
    super(displayName, '');
    this.classes = 'list-element-title';
    this.type = 'title';
  }
}
