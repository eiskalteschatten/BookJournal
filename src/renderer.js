'use strict';

const $ = require('jquery');

const helper = require('./events/helper');

const SidebarList = require('./elements/list/sidebar');
const AboutModal = require('./elements/modal/about');


async function renderSidebar() {
    const list = new SidebarList();
    await list.loadCategories();

    const rendered = await list.render();
    const $sidebar = $('#sidebar');
    $sidebar.html(rendered);
    $sidebar.removeClass('loading');
}

async function renderModals() {
    const $modalAnchor = $('#modalAnchor');

    const aboutModal = new AboutModal();
    const rendered = await aboutModal.render();
    $modalAnchor.append(rendered);
}

async function postRender() {
    const {loadPreferences} = require('./initialPreferences');
    const preferences = await loadPreferences();

    localStorage.setItem('preferences', JSON.stringify(preferences));  // eslint-disable-line
    localStorage.setItem('theme', preferences.theme);  // eslint-disable-line

    helper.checkForUpdates();
}

async function render() {
    require('./events.js');

    await renderSidebar();
    $('.js-sidebar-list-element').first().trigger('click');
    document.getElementById('defaultCss').remove();  // eslint-disable-line

    await renderModals();
    await postRender();
}

render();
