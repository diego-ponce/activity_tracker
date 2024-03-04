const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getPreferences, setPreferences  } = require('./settings.js')
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isDev = !app.isPackaged;
function createWindow ()  {
    const preferences = getPreferences ();
    const window = new BrowserWindow({
        x: preferences["win-pos"][0],
        y: preferences["win-pos"][1],
        width:preferences["win-size"][0],
        height:preferences["win-size"][1],
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    });
    ipcMain.handle('create-file', async (req, data) => {
        if (!validateSender(req.senderFrame)) return null
        if (!data || !data.content) return false;
        const filePath = path.join(__dirname, 'notes', data.content.timestamp + '.json');
        let content = JSON.stringify(data.content, null); 
        fs.writeFile(filePath, content, function (err) {
            if (err) throw err;
            console.log('wrote data to ' + filePath);
        }); 
        const configPath = path.join(__dirname, 'config.json');
        fs.writeFile(configPath, content, function (err) {
            if (err) throw err;
            console.log('wrote data to ' + configPath);
        }); 
        window.hide();
        remind_time = data.content.remind_time * 1000 * 60;
        await sleep(remind_time);
        console.log('waiting for ' + remind_time)
        window.show();
        return { success: true, filepath: filePath };
    })
    const preferenceEvents = ['resized','moved', 'close'];
    preferenceEvents.forEach((event) => {
        window.on(event, () => {setPreferences(preferences, window)});
    });
    window.loadFile('src/index.html');
    if (isDev) window.webContents.openDevTools();
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    app.quit();
})
