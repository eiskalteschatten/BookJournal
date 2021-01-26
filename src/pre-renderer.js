'use strict';

function preRender() {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    const themeCss = `${theme}Css`;

    document.getElementById(themeCss).disabled = false;

    const body = document.getElementsByTagName('body')[0];
    body.classList.add(process.platform);

    let preferences = localStorage.getItem('preferences');

    if (preferences) {
      preferences = JSON.parse(preferences);
      document.getElementById('sidebarWrapper').style.width = `${preferences.sidebarWidth}px`;
      document.getElementById('bookListWrapper').style.width = `${preferences.middleColumnWidth}px`;
    }
  }
  catch (error) {
    console.error(error);
  }
}

window.onload = preRender;
