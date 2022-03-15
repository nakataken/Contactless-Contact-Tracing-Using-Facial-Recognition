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
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.8) {
            clearInterval(interval);
            let canvas=document.querySelector('canvas');
            let context=canvas.getContext('2d');
            context.fillRect(0,0,displaySize.width,displaySize.height);
            context.drawImage(video,0,0,displaySize.width,displaySize.height);
            
            var img_data = canvas.toDataURL('image/jpg');

            $("#face").attr("src",img_data);
            const input = await $('#face')[0];

            const detection = await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceDescriptor();
            
            const description = await detection.descriptor

            if(!fetched) {
                fetched = true;
                await fetch('/visitor/detect/1', { 
                    method: 'POST', 
                    headers: {
                        "content-type": "application/json"
                    }, 
                    body:  JSON.stringify({ description }) 
                })
                .then((response)=> {
                    if(response.redirected) {
                        window.location.href = response.url;
                    }
                });
            }
        }
    }, 100);
})