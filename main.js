const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getPreferences, setPreferences  } = require('./settings.js')
const { getValues } = require('./initial_values.js');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const os = require ('os');
const username = os.userInfo ().username;
let converter = require('json-2-csv');

function getAllNotes () {
        try {
            const filePath = path.join(__dirname, 'notes', 'notes.jsonl');
            const data = fs.readFileSync(filePath, 'utf-8')
            return data
        }
        catch {
            console.log("failed to read file");
            return;
        }
}

function createWindow ()  {
    ipcMain.handle('getUsername', () => username);
    ipcMain.handle('getInitialValues', () => getValues());
    const preferences = getPreferences ();
    const window = new BrowserWindow({
        x: preferences["win-pos"][0],
        y: preferences["win-pos"][1],
        width:preferences["win-size"][0],
        height:preferences["win-size"][1],
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    ipcMain.handle('export-csv', async (req) => {
        data = getAllNotes();
        if (!data) return;
        const lines = data.trim().split(/\n/).map( obj => JSON.parse(obj) );
        const csv = converter.json2csv(lines); 
        const csvPath = path.join(__dirname,'notes.csv');
        fs.writeFile(csvPath, csv, function (err) {
            if (err) throw err;
            console.log('wrote data to ' + csvPath);

        });
    });
    ipcMain.handle('create-file', async (req, data) => {
        // TODO figure out how to do with local file
        // if (!validateSender(req.senderFrame)) return false;
        if (!data || !data.content) return false;
        const filePath = path.join(__dirname,'notes','notes.jsonl');
        let content = JSON.stringify(data.content, null); 
        content += "\n";
        fs.appendFile(filePath, content, function (err) {
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
    function validateSender (frame) {
      // Value the host of the URL using an actual URL parser and an allowlist
      if ((new URL(frame.url)).host === 'electronjs.org') return true
      return false
    }
    const preferenceEvents = ['resized','moved', 'close'];
    preferenceEvents.forEach((event) => {
        window.on(event, () => {setPreferences(window)});
    });
    window.loadFile('src/index.html');
    if (process.env.ELECTRON_DEBUG==='1') window.webContents.openDevTools();
}
app.whenReady().then(() => {
    const notesPath = path.join(__dirname, 'notes');
    fs.mkdirSync(notesPath, { recursive: true });
    createWindow()
});
app.on('window-all-closed', () => {
    app.quit();
})
