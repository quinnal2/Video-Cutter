function cutVideo() {
    let filePath = document.getElementById('video-select-button').files[0].path;
    let startTime = document.getElementById('start-time-button').value;
    let endTime = document.getElementById('end-time-button').value;
    
    window.electronAPI.cutVideo(filePath, startTime, endTime);
}

window.electronAPI.onCutVideoResult((_event, value) => {
    if(value === 'success') {
        toastr.success('Video Successfully Processed');
    } else {
        toastr.error('Error Processing Video');
    }
})

function loadVideo() {
    let videoSelect = document.getElementById('video-select-button');
    let videoPlayer = document.getElementById('video-player');

    if(videoSelect.files[0]) {
        let source = document.createElement('source');
        source.src = videoSelect.files[0].path;
        source.type = videoSelect.files[0].type;
        while(videoPlayer.firstChild) {
            videoPlayer.remove(videoPlayer.firstChild);
        }
        videoPlayer.append(source);
        videoPlayer.style.display = 'block';
    } else {
        videoPlayer.style.display = 'none';
    }
}