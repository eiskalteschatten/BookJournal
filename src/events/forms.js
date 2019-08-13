'use strict';

const $ = require('jquery');

$(document).on('click', '.js-selector', function() {
    const $inputField = $(this).closest('.js-selector-input');
    $inputField.val($(this).data('value'));
    $(this).siblings('.selected').removeClass('selected');
    $(this).addClass('selected');
});
