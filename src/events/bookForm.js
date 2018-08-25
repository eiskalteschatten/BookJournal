'use strict';

const $ = require('jquery');

const BookForm = require('../elements/bookForm');


$(window).on('bookFormLoaded', e => { // eslint-disable-line
    console.log('book form has loaded', e);
});

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


// Tags & Categories

function deleteBadge($deleteButton) {
    const $badge = $deleteButton.closest('.js-tag-badge');
    const $tagCluster = $deleteButton.closest('.js-tag-cluster');
    const $tagHidden = $tagCluster.siblings('.js-tag-hidden');
    const tagText = $badge.data('delete-id');
    const tags = $tagHidden.val().split(',');

    const newTags = tags.filter(tag => {
        return tag + '' !== tagText + '';
    });

    if ($tagCluster.hasClass('js-category-cluster')) {
        $tagCluster
            .siblings('.js-pre-tag-cluster-wrapper')
            .find('#bookCategories')
            .find(`option[value="${tagText}"]`)
            .prop('disabled', false);
    }

    $tagHidden.val(newTags);
    $badge.remove();
}

$(document).on('keypress', '#bookTags', async function(e) { // eslint-disable-line
    if (e.keyCode !== 13) return;
    e.preventDefault();

    const $this = $(this);
    const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
    const inputValue = $this.val().trim();

    if (inputValue !== '') {
        const $tagHidden = $wrapper.siblings('.js-tag-hidden');
        const $tagCluster = $wrapper.siblings('.js-tag-cluster');
        const newTags = inputValue.split(',');

        for (const i in newTags) {
            const tag = newTags[i].trim();
            if (tag !== '') {
                const badge = await BookForm.renderTagCategoryBadge(tag, tag, 'tag');
                $tagCluster.append(badge);

                const hiddenValue = $tagHidden.val();
                const newValue = hiddenValue !== '' ? hiddenValue + ',' + tag : tag;
                $tagHidden.val(newValue);
            }
        }

        $tagCluster.removeClass('hidden');
        $this.val('');
    }
});

$(document).on('click', '.js-delete-tag', function() { // eslint-disable-line
    deleteBadge($(this));
});

$(document).on('change', '#bookCategories', async function() { // eslint-disable-line
    const $this = $(this);
    const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
    const $selected = $this.find('option:selected');
    const $tagHidden = $wrapper.siblings('.js-tag-hidden');
    const $tagCluster = $wrapper.siblings('.js-tag-cluster');
    const categoryId = $this.val();

    const badge = await BookForm.renderTagCategoryBadge($selected.text(), categoryId, 'category');
    $tagCluster.append(badge);

    const hiddenValue = $tagHidden.val();
    const newValue = hiddenValue !== '' ? hiddenValue + ',' + categoryId : categoryId;
    $tagHidden.val(newValue);

    $tagCluster.removeClass('hidden');
    $selected.prop('disabled', true);
    $this.val('-1');
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
