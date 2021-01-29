import $ from 'jquery';

$('.js-title-bar').on('dblclick', function() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron').remote.getCurrentWindow().maximize();
});
