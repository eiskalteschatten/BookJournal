'use strict';

const { remote } = require('electron');

const Modal = require('../modal');


class About extends Modal {
  constructor() {
    super('about');
  }

  getNunjucksRenderObject() {
    const object = super.getNunjucksRenderObject();

    object.appVersion = remote.app.getVersion();
    object.nodeVersion = process.versions.node;
    object.chrominumVersion = process.versions.chrome;
    object.electronVersion = process.versions.electron;

    return object;
  }
}

module.exports = About;
