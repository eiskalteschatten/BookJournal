function preRender(): void {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    const themeCss = `${theme}Css`;

    (document.getElementById(themeCss) as any).disabled = false;

    const body = document.getElementsByTagName('body')[0];
    body.classList.add(process.platform);

    const preferencesString = localStorage.getItem('preferences');

    if (preferencesString) {
      // TODO: add preferences interface
      const preferences = JSON.parse(preferencesString);
      document.getElementById('sidebarWrapper').style.width = `${preferences.sidebarWidth}px`;
      document.getElementById('bookListWrapper').style.width = `${preferences.middleColumnWidth}px`;
    }
  }
  catch (error) {
    console.error(error);
  }
}

window.onload = preRender;
