'use strict';

const $ = require('jquery');


$('.js-title-bar').dblclick(() => {
  require('electron').remote.getCurrentWindow().maximize();
});
