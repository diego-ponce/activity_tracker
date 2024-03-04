const { contextBridge, ipcRenderer } = require('electron');
const { getPreferences, setPreferences  } = require('./settings.js')
const { getValues } = require('./initial_values.js');


contextBridge.exposeInMainWorld('api', {
    title: "Activity Tracker",
    createNote: (data) => ipcRenderer.invoke('create-file', data),
    initialValues: getValues()
})
