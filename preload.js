const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    cutVideo: (filePath, startTime, endTime) => ipcRenderer.send('cut-video', filePath, startTime, endTime),
    onCutVideoResult: (callback) => ipcRenderer.on('cut-video-result', callback)
});