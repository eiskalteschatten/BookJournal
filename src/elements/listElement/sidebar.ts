import ListElement from '.';

export default class SidebarListElement extends ListElement {
  constructor(displayName: string, iconPath = '', queryType: string) {
    super(displayName, iconPath, queryType);
    this.classes = 'list-element js-sidebar-list-element';
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();

    object.dataFields = {
      'query-type': this.queryType,
    };

    return object;
  }
}
