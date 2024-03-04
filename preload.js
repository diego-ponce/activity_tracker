const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
    title: "Activity Tracker",
    createNote: (data) => ipcRenderer.invoke('create-file', data),
    getInitialValues: () => ipcRenderer.invoke('getInitialValues'),
    getUsername: () => ipcRenderer.invoke('getUsername'),
    exportCsv: (data) => ipcRenderer.invoke('export-csv')
})
