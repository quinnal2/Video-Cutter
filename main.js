const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

function handleCutVideo (event, filePath, startTime, endTime) {
    let startUnits = startTime.split(':').map(x => parseInt(x));
    let endUnits = endTime.split(':').map(x => parseInt(x));
    let cutDuration = (((endUnits[0] * 60 * 60) + (endUnits[1] * 60) + endUnits[2]) - ((startUnits[0] * 60 * 60) + (startUnits[1] * 60) + startUnits[2]));
    let fileParts = filePath.slice(filePath.lastIndexOf('\\') + 1).split('.');
    let originalDuration = 0;

    ffmpeg(filePath)
        .ffprobe(function(err, data) {
            originalDuration = data.format.duration;
        });

    ffmpeg(filePath)
        .setStartTime(startTime)
        .duration(cutDuration)
        .on('start', function(commandLine) {
            event.sender.send('processing-started');
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('progress', function(progress) {
            if(progress.percent) { // Sometimes percent is undefined
                let scaledPercent = Math.round(originalDuration / cutDuration * progress.percent);

                console.log('Processing: ' + scaledPercent + '% done');
                event.sender.send('update-progress', scaledPercent);
            }
        })
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            event.sender.send('cut-video-result', 'error');
        })
        .on('end', function() {
            console.log('Processing finished !');
            event.sender.send('cut-video-result', 'success');
        })
        .save(filePath.slice(0, filePath.lastIndexOf('\\') + 1) + fileParts[0] + '_cut.' + fileParts[1]);
}

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js')
      },
      resizable: false
    });

    win.setMenu(null);
    win.loadFile('index.html');
};

app.whenReady().then(() => {
    ipcMain.on('cut-video', handleCutVideo);
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});