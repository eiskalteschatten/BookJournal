'use strict';

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const { setupMigration, migrate } = require('sequelize-migration-wrapper');

const config = require('./config/config');
const appConfig = config.app;
const appMenu = require('./menus/config/app');

// Database
const { sequelize } = require('./db');
setupMigration({
    sequelize,
    path: path.join(__dirname, 'migrations')
});
migrate();

// Preferences
const {loadPreferences} = require('./initialPreferences');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow() {
    const preferences = await loadPreferences();

    // Create the browser window.
    const browserWindow = {
        width: preferences.windowWidth,
        height: preferences.windowHeight,
        icon: path.join(__dirname, './assets/images/icon128.png'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    };

    if (process.platform === 'darwin')
        browserWindow.titleBarStyle = 'hidden';

    if (preferences.windowX && preferences.windowY) {
        browserWindow.x = preferences.windowX;
        browserWindow.y = preferences.windowY;
    }

    mainWindow = new BrowserWindow(browserWindow);

    if (preferences.windowIsMaximized)
        mainWindow.maximize();

    mainWindow.setFullScreen(preferences.windowIsFullScreen || false);


    // and load the index.html of the app.
    mainWindow.loadFile('./src/html/index.html');


    // Open the DevTools.
    // mainWindow.webContents.openDevTools();


    mainWindow.on('close', async () => {
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
        catch(error) {
            console.error(error);
        }
    });


    mainWindow.on('closed', () => {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    const menu = Menu.buildFromTemplate(appMenu);
    const menuItem = `${preferences.theme}Theme`;
    Menu.setApplicationMenu(menu);
    menu.getMenuItemById(menuItem).checked = true;
}

app.setName(appConfig.name);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});


// Menus
require('./menus/menus');
