const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    cutVideo: (filePath, startTime, endTime) => ipcRenderer.send('cut-video', filePath, startTime, endTime),
    onCutVideoResult: (callback) => ipcRenderer.on('cut-video-result', callback),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
    onProcessingStarted: (callback) => ipcRenderer.on('processing-started', callback)
});