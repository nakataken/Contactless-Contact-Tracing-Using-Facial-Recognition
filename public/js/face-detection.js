const video = document.getElementById('video')
const image = document.getElementById('image')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.6) {
            let canvas=document.querySelector('canvas');
            let context=canvas.getContext('2d');
            context.fillRect(0,0,displaySize.width,displaySize.height);
            context.drawImage(video,0,0,displaySize.width,displaySize.height);
            var img_data = canvas.toDataURL('image/jpg');
            // video.pause();
            downloadImage(img_data)
        }
        
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 10000)
})

async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'image file name here'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}