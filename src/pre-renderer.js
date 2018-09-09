'use strict';

function preRender() {
    const theme = localStorage.getItem('theme') || 'light';  // eslint-disable-line
    const themeCss = `${theme}Css`;

    document.getElementById(themeCss).disabled = false;  // eslint-disable-line
    //document.getElementById('defaultCss').remove();  // eslint-disable-line

    const body = document.getElementsByTagName('body')[0];  // eslint-disable-line
    body.classList.add(process.platform);

    const preferences = localStorage.getItem('preferences');  // eslint-disable-line

    document.getElementById('sidebarWrapper').style.width = `${preferences.sidebarWidth}px`;  // eslint-disable-line
    document.getElementById('bookListWrapper').style.width = `${preferences.middleColumnWidth}px`;  // eslint-disable-line
}

window.onload = preRender;  // eslint-disable-line
