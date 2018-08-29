'use strict';

const $ = require('jquery');

const SidebarList = require('./elements/list/sidebar');


async function render() {
    await renderSidebar();
    $('.js-sidebar-list-element').first().trigger('click');
}

async function renderSidebar() {
    const list = new SidebarList();
    await list.loadCategories();

    const rendered = await list.render();
    const $sidebar = $('#sidebar');
    $sidebar.html(rendered);
    $sidebar.removeClass('loading');
}

render();
