import { remote } from 'electron';

import Modal from '../modal';

export default class About extends Modal {
  constructor() {
    super('about');
  }

  async getNunjucksRenderObject(): Promise<any> {
    const object = await super.getNunjucksRenderObject();

    object.appVersion = remote.app.getVersion();
    object.nodeVersion = process.versions.node;
    object.chrominumVersion = process.versions.chrome;
    object.electronVersion = process.versions.electron;

    return object;
  }
}
