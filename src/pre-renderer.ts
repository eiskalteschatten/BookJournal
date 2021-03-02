import Preferences from './models/preferences';

function preRender(): void {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    const themeCss = `${theme}Css`;

    (document.getElementById(themeCss) as any).disabled = false;

    const body = document.getElementsByTagName('body')[0];
    body.classList.add(window.process.platform);

    const preferencesString = localStorage.getItem('preferences');

    if (preferencesString) {
      const preferences: Preferences = JSON.parse(preferencesString);
      document.getElementById('sidebarWrapper').style.width = `${preferences.sidebarWidth}px`;
      document.getElementById('bookListWrapper').style.width = `${preferences.middleColumnWidth}px`;
    }
  }
  catch (error) {
    console.error(error);
  }
}

window.onload = preRender;
