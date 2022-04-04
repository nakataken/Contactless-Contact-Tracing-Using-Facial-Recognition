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

        if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.9) {
            // Stop and get image data
            video.pause();
            clearInterval(interval);
            let screenshot = document.getElementById('canvas');
            let context  = screenshot.getContext('2d');
            context.fillRect(0,0,displaySize.width,displaySize.height);
            context.drawImage(video,0,0,displaySize.width,displaySize.height);
            
            screenshot.toBlob( async function(blob){
                $('#loading').show();
                var form = new FormData();
                form.append("check", blob, "check.png");
                if(!fetched) {
                    fetched = true;
                    await fetch('/visitor/check', { 
                        method: 'POST', 
                        body: form
                    })
                    .then((response)=> {
                        response.json().then((data) => {
                            console.log()
                            if(data.success) {
                                setTimeout(() => {
                                    $('#result').text("No face found. Redirecting to detect 1..."); 
                                    window.location.href = "/visitor/detect/1";
                                }, 5000);
                            } else {
                                setTimeout(() => {
                                    $('#result').text("Face already existing. Redirecting to login..."); 
                                    window.location.href = "/visitor/login";
                                }, 5000);
                            }
                        })
                    });
                }
            }, "image/png");
        }
    }, 100);
})