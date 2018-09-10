'use strict';

const helper = require('./events/helper');

const SidebarList = require('./elements/list/sidebar');
const AboutModal = require('./elements/modal/about');


async function renderSidebar() {
    const list = new SidebarList();
    await list.loadCategories();

    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = await list.render();
}

async function renderModals() {
    let rendered = '';

    const aboutModal = new AboutModal();
    rendered += await aboutModal.render();

    document.getElementById('modalAnchor').innerHTML = rendered;
}

async function postRender() {
    const {loadPreferences} = require('./initialPreferences');
    const preferences = await loadPreferences();

    localStorage.setItem('preferences', JSON.stringify(preferences));
    localStorage.setItem('theme', preferences.theme);

    helper.checkForUpdates();
}

async function render() {
    require('./events.js');

    const sortBy = localStorage.getItem('sortBy');
    if (sortBy) document.getElementById('bookSort').value = sortBy;

    await renderSidebar();
    const firstSidebarListItem = document.getElementsByClassName('js-sidebar-list-element')[0];
    firstSidebarListItem.click();

    document.getElementById('defaultCss').remove();

    await renderModals();
    await postRender();
}

render();
