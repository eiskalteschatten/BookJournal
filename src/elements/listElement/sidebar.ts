import ListElement from '.';
import { NunjucksRenderObject } from '../../interfaces/nunjucks';

export default class SidebarListElement extends ListElement {
  private queryType: string;

  constructor(displayName: string, iconPath = '', queryType: string) {
    super(displayName, iconPath);
    this.queryType = queryType;
    this.classes = 'list-element js-sidebar-list-element';
  }

  getNunjucksRenderObject(): NunjucksRenderObject {
    const object = super.getNunjucksRenderObject();

    object.dataFields = {
      'query-type': this.queryType,
    };

    return object;
  }
}
