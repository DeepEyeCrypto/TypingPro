const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform === 'win32') {
    if (require('electron-squirrel-startup')) {
        app.quit();
    }
}

let mainWindow = null;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'TypingPro',
        icon: path.join(__dirname, 'dist/logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'), // Updated to .cjs
            sandbox: true,
        },
        show: false,
        backgroundColor: '#0B1120',
    });

    // Load the index.html of the app.
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    } else {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.whenReady().then(() => {
    createWindow();

    // Check for updates
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('check-for-updates', () => {
    if (app.isPackaged) {
        return autoUpdater.checkForUpdatesAndNotify();
    } else {
        log.info('App not packaged, skipping update check.');
        return null; // Or mock response
    }
});

/* Auto Updater Events */
autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
    log.info('Update available.', info);
});
autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.', info);
});
autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    log.info(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded', info);
});
