'use strict';

function preRender() {
    const theme = localStorage.getItem('theme') || 'light';
    const themeCss = `${theme}Css`;

    document.getElementById(themeCss).disabled = false;

    const body = document.getElementsByTagName('body')[0];
    body.classList.add(process.platform);

    const preferences = localStorage.getItem('preferences');

    document.getElementById('sidebarWrapper').style.width = `${preferences.sidebarWidth}px`;
    document.getElementById('bookListWrapper').style.width = `${preferences.middleColumnWidth}px`;
}

window.onload = preRender;
