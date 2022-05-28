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

function cutVideo() {
    let filePath = document.getElementById('video-select-button').files[0].path;
    let startTime = document.getElementById('start-time-button').value;
    let endTime = document.getElementById('end-time-button').value;
    
    window.electronAPI.cutVideo(filePath, startTime, endTime);
}

window.electronAPI.onProcessingStarted((_event) => {
    for(let input of document.getElementsByTagName('input')) {
        input.setAttribute('readonly', '');
    }
    toastr.success('Video Processing Started');
    document.getElementById('submit-button-container').style.display = 'none';
    document.getElementById('progress-bar').classList.remove('d-none');
});

window.electronAPI.onUpdateProgress((_event, value) => {
    let progressBarInner = document.getElementById('progress-bar-inner');

    progressBarInner.style.width = value + '%';
    progressBarInner.innerText = value + '%';
});

window.electronAPI.onCutVideoResult((_event, value) => {
    if(value === 'success') {
        let progressBarInner = document.getElementById('progress-bar-inner');

        for(let input of document.getElementsByTagName('input')) {
            input.removeAttribute('readonly');
        }
        document.getElementById('progress-bar').classList.add('d-none');
        progressBarInner.innerText = '';
        progressBarInner.style.width = '0%';
        document.getElementById('submit-button-container').style.display = 'flex';
        toastr.success('Video Successfully Processed');
    } else {
        toastr.error('Error Processing Video');
    }
});