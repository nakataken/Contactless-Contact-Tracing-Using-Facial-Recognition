const video = document.getElementById('video')
const image = document.getElementById('image')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    $('#loading').hide();
    let fetched = false;
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    
    const interval = setInterval(async () => {
        // Detect and draw 
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

        if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.8) {
            // Stop and get image data
            clearInterval(interval);
            let screenshot = document.getElementById('canvas');
            let context  = screenshot.getContext('2d');
            context.fillRect(0,0,displaySize.width,displaySize.height);
            context.drawImage(video,0,0,displaySize.width,displaySize.height);
            video.pause();
            screenshot.toBlob( async function(blob){
                $('#loading').show();
                var form = new FormData();
                form.append("verify", blob, "verify.png");
                if(!fetched) {
                    fetched = true;
                    await fetch('/establishment/verify', { 
                        method: 'POST', 
                        body: form
                    })
                    .then((response)=> {
                        response.json().then((data) => {
                            $('#person').text(`${data.message}`); 
                            setTimeout(() => {
                                $('#person').text(""); 
                                window.location.href = "/establishment/verify";
                            }, 5000);
                        })
                    });
                }
            }, "image/png");
        }
    }, 100);
})