const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
    title: "Activity Tracker",
    createNote: (data) => ipcRenderer.invoke('create-file', data)
})
