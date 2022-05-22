function cutVideo() {
    let filePath = document.getElementById('video-select-button').files[0].path;
    let startTime = document.getElementById('start-time-button').value;
    let endTime = document.getElementById('end-time-button').value;
    
    window.electronAPI.cutVideo(filePath, startTime, endTime);
}

window.electronAPI.onCutVideoResult((_event, value) => {
    if(value === 'success') {
        alert('Video Successfully Processed');
    } else {
        alert('Error Processing Video');
    }
})