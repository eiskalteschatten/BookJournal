import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import path from 'path';

import config from '../config';

import { setupSequelize } from './db';

export default class Main {
  static mainWindow: Electron.BrowserWindow | undefined;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  private static onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      Main.application.quit();
    }
  }

  private static async onClose(): Promise<void> {
    try {
      if (Main.mainWindow) {
        const windowBounds = Main.mainWindow.getBounds();

        const values = {
          windowWidth: windowBounds.width,
          windowHeight: windowBounds.height,
          windowX: windowBounds.x,
          windowY: windowBounds.y,
          windowIsFullScreen: Main.mainWindow.isFullScreen(),
          windowIsMaximized: Main.mainWindow.isMaximized(),
        };

        // await preferences.update(values);

        Main.mainWindow = undefined;
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  private static async onReady(): Promise<void> {
    await setupSequelize();
    // if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    // Main.BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    // }

    const browserWindowOptions: BrowserWindowConstructorOptions = {
      width: 800,//preferences.windowWidth,
      height: 600,//preferences.windowHeight,
      icon: path.join(__dirname, '../assets/images/icon128.png'),
      webPreferences: {
        nodeIntegration: true
      }
    };

    if (process.platform === 'darwin') {
      browserWindowOptions.titleBarStyle = 'hidden';
    }

    // if (preferences.windowX && preferences.windowY) {
    //   browserWindowOptions.x = preferences.windowX;
    //   browserWindowOptions.y = preferences.windowY;
    // }

    Main.mainWindow = new Main.BrowserWindow(browserWindowOptions);

    if (Main.mainWindow) {
      // if (preferences.windowIsMaximized) {
      //   Main.mainWindow.maximize();
      // }

      // Main.mainWindow.setFullScreen(preferences.windowIsFullScreen || false);

      Main.mainWindow.loadURL(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../index.html')}`
      );

      Main.mainWindow.on('closed', Main.onClose);
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
    Main.application.on('ready', Main.onReady);
    Main.application.setName(config.app.name);
  }
}
