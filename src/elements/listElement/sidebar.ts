import ListElement from '.';

export default class SidebarListElement extends ListElement {
  private queryType: string;

  constructor(displayName: string, iconPath = '', queryType: string) {
    super(displayName, iconPath);
    this.queryType = queryType;
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
