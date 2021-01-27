import $ from 'jquery';

$(document).on('click', '.js-selector', (): void => {
  const $inputField = $(this).parents('.js-selection-bar').find('.js-selector-input');
  $inputField.val($(this).data('value')).trigger('change');
  $(this).siblings('.selected').removeClass('selected');
  $(this).addClass('selected');
});
