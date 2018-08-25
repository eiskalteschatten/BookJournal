'use strict';

const $ = require('jquery');

const BookForm = require('../elements/bookForm');


$(window).on('bookFormLoaded', e => { // eslint-disable-line
    console.log('book form has loaded', e);
});

// $(document).on('keypress', '#bookForm', function(e) { // eslint-disable-line
//     return e.keyCode != 13;
// });

$(document).on('click', '#bookNotReadYet', function() { // eslint-disable-line
    if ($(this).prop('checked')) $('#bookDateRead').prop('disabled', true);
    else $('#bookDateRead').prop('disabled', false);
});


// Book Colors

$(document).on('click', '.js-book-form-color-stripe', function() { // eslint-disable-line
    $(this).siblings('.js-book-form-color-form').click();
});

$(document).on('change', '.js-book-form-color-form', function() { // eslint-disable-line
    const $colorForm = $(this);
    const color = $colorForm.val();
    $colorForm.siblings('.js-book-form-color-stripe').attr('style', `background-color: ${color}`);
});


// Tags

$(document).on('keypress', '.js-tag-input', async function(e) { // eslint-disable-line
    e.preventDefault();

    const $this = $(this);

    if (e.keyCode === 13) {
        const inputValue = $this.val().trim();

        if (inputValue !== '') {
            const $tagHidden = $this.prevAll('.js-tag-hidden:first');
            const $tagCluster = $this.nextAll('.js-tag-cluster:first');
            const newTags = inputValue.split(',');

            for (const i in newTags) {
                const tag = newTags[i].trim();
                const badge = await BookForm.renderTagBadge(tag);
                $tagCluster.append(badge);

                const hiddenValue = $tagHidden.val();
                const newValue = hiddenValue !== '' ? hiddenValue + ',' + tag : tag;
                $tagHidden.val(newValue);
            }

            $tagCluster.removeClass('hidden');

            $this.val('');
        }
    }
});


// Rating Stars

let starRestoreTimeout;

$(document).on('mouseout', '.js-rating-star', function() { // eslint-disable-line
    starRestoreTimeout = setTimeout(function() {
        $('.js-rating-star')
            .removeClass('temp-full')
            .removeClass('temp-empty');
    }, 100);
});

$(document).on('mouseover', '.js-rating-star', function() { // eslint-disable-line
    clearTimeout(starRestoreTimeout);

    $('.js-rating-star')
        .removeClass('temp-full')
        .addClass('temp-empty');

    $(this).prevAll()
        .removeClass('temp-empty')
        .addClass('temp-full');

    $(this)
        .removeClass('temp-empty')
        .addClass('temp-full');
});

$(document).on('click', '.js-rating-star', function() { // eslint-disable-line
    clearTimeout(starRestoreTimeout);

    $('.js-rating-star').each(function() {
        const $this = $(this);

        $this
            .removeClass('full')
            .removeClass('empty');

        if ($this.hasClass('temp-full')) {
            $(this).removeClass('temp-full').addClass('full');
        }
        else if ($this.hasClass('temp-empty')) {
            $(this).removeClass('temp-empty').addClass('empty');
        }
    });
});

$(document).on('click', '.js-remove-rating', function() { // eslint-disable-line
    $('.js-rating-star')
        .removeClass('full')
        .addClass('empty');
});
