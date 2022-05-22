const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('ffmpeg');

function handleCutVideo (event, filePath, startTime, endTime) {
    let startUnits = startTime.split(':').map(x => parseInt(x));
    let endUnits = endTime.split(':').map(x => parseInt(x));
    let duration = (((endUnits[0] * 60 * 60) + (endUnits[1] * 60) + endUnits[2]) - ((startUnits[0] * 60 * 60) + (startUnits[1] * 60) + startUnits[2]));
    let fileParts = filePath.slice(filePath.lastIndexOf('\\') + 1).split('.');

    try {
        var process = new ffmpeg(filePath);
        process.then(function (video) {
            video
            .setVideoStartTime(startTime)
            .setVideoDuration(duration)
            .save(filePath.slice(0, filePath.lastIndexOf('\\') + 1) + fileParts[0] + '_cut.' + fileParts[1], function (error, file) {
                if (!error) {
                    console.log('Video file: ' + file);
                    event.sender.send('cut-video-result', 'success');
                } else {
                    console.log(error);
                    event.sender.sen('cut-video-result', 'error');
                }
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
}

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js')
      }
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