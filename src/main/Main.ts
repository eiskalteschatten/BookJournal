import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import path from 'path';


export default class Main {
  static mainWindow: Electron.BrowserWindow | undefined;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  private static onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      Main.application.quit();
    }
  }

  private static onClose(): void {
    // Dereference the window object.
    Main.mainWindow = undefined;
  }

  private static onReady(): void {
    if (process.env.NODE_ENV === 'development') {
      // Open the DevTools.
      // Main.BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    }

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
      Main.mainWindow.loadURL(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../index.html')}`
      );

      Main.mainWindow.on('closed', Main.onClose);
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
    Main.application.on('ready', Main.onReady);
  }
}
