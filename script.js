const video = document.getElementById('video')


Promise.all([ //Carica tutti i prossimi processi asincroni in parallelo
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
	faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)



// Per collegare la webcam all'elemento video
function startVideo() {
	navigator.getUserMedia(
		{ video: {} }, // Quale oggetto vogliamo usare
		// Attacca la telecamera (stream) all'oggetto video oppure dai un errore
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

video.addEventListener('play', () => {
	const canvas = faceapi.createCanvasFromMedia(video) // Frame processato dalla face api
	document.body.append(canvas) // aggiungiamo il canvas alla pagina web, lo appendiamo perche' tanto è posizionato absolute
	const displaySize = { width: video.width, height: video.height } // salviamo le dimensioni dellimmagine della webcam

	faceapi.matchDimensions(canvas, displaySize)

// Vogliamo eseguirlo più volte quindi usiamo setInterval
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		const resizedDetections = faceapi.resizeResults(detections, displaySize)

		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		faceapi.draw.drawDetections(canvas, resizedDetections)
		faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
	}, 100) // ogni 100 millisecondi
})