'use strict';

const $ = require('jquery');

const helper = require('./events/helper');

const SidebarList = require('./elements/list/sidebar');
const AboutModal = require('./elements/modal/about');


async function render() {
    await renderSidebar();
    $('.js-sidebar-list-element').first().trigger('click');
    await renderModals();
    helper.checkForUpdates();
}

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

render();
