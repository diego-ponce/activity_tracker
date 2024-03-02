const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow ()  {
    const win = new BrowserWindow({
        width:400,
        height:300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.handle('create-file', (req, data) => {
        if (!data || !data.title || !data.content) return false;

        const filePath = path.join(__dirname, 'notes', 'activity_tracker.csv');
        fs.appendFile(filePath, data.content, function (err) {
            if (err) throw err;
            console.log('Saved!');
        }); 
        app.quit()
        return { success: true, filepath: filePath };




    })
    win.loadFile('src/index.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
})
