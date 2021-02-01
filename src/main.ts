import { app, BrowserWindow, BrowserWindowConstructorOptions, Menu } from 'electron';
import path from 'path';

import config from './config';
import appMenu from './menus/config/app';
import { loadPreferences } from './initialPreferences';
import { setupSequelize } from './db';

const { app: appConfig } = config;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

async function createWindow(): Promise<void> {
  await setupSequelize();

  const preferences = await loadPreferences();

  // Create the browser window.
  const browserWindow: BrowserWindowConstructorOptions = {
    width: preferences?.windowWidth,
    height: preferences?.windowHeight,
    icon: path.join(__dirname, './assets/images/icon128.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hidden': 'default',
    backgroundColor: preferences.theme === 'dark' ? '#222222' : '#f0f0f0',
  };

  if (preferences?.windowX && preferences?.windowY) {
    browserWindow.x = preferences?.windowX;
    browserWindow.y = preferences?.windowY;
  }

  mainWindow = new BrowserWindow(browserWindow);

  if (preferences?.windowIsMaximized) {
    mainWindow.maximize();
  }

  mainWindow.setFullScreen(preferences?.windowIsFullScreen || false);
  mainWindow.loadFile('./dist/ts/html/index.html');
  // mainWindow.webContents.openDevTools();

  mainWindow.on('close', async (): Promise<void> => {
    try {
      const windowBounds = mainWindow.getBounds();

      const values = {
        windowWidth: windowBounds.width,
        windowHeight: windowBounds.height,
        windowX: windowBounds.x,
        windowY: windowBounds.y,
        windowIsFullScreen: mainWindow.isFullScreen(),
        windowIsMaximized: mainWindow.isMaximized(),
      };

      await preferences.update(values);
    }
    catch (error) {
      console.error(error);
    }
  });

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(appMenu);
  const menuItem = `${preferences.theme}Theme`;
  Menu.setApplicationMenu(menu);
  menu.getMenuItemById(menuItem).checked = true;
}

app.setName(appConfig.name);
app.on('ready', createWindow);
app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', (): void => {
  if (mainWindow === null) {
    createWindow();
  }
});

require('./menus');
