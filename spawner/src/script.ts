
function webScript(){
    console.log("before mediadevices")

    window.navigator.mediaDevices.getDisplayMedia({
        video: {
            displaySurface: "browser"
        },
        audio: true,
        // @ts-ignore
        preferCurrentTab: true,
    }).then(async screenStream => {
        const audioContext = new AudioContext();
        const screenAudioStream = audioContext.createMediaStreamSource(screenStream)
        const audioEl1 = document.querySelectorAll("audio")[0];
        const audioEl2 = document.querySelectorAll("audio")[1];
        const audioEl3 = document.querySelectorAll("audio")[2];
        if (!(audioEl1?.srcObject instanceof MediaStream) ||
            !(audioEl2?.srcObject instanceof MediaStream) ||
            !(audioEl3?.srcObject instanceof MediaStream)) {
            console.error("One or more audio elements do not have a valid MediaStream.");
            return;
        }

        const audioElStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject)
        const audioElStream2 = audioContext.createMediaStreamSource(audioEl3.srcObject)
        const audioElStream3 = audioContext.createMediaStreamSource(audioEl2.srcObject)

        const dest = audioContext.createMediaStreamDestination();

        screenAudioStream.connect(dest)
        audioElStream1.connect(dest)
        audioElStream2.connect(dest)
        audioElStream3.connect(dest)


        // Combine screen and audio streams
        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
        ]);


        let retryCount = 0;
        let MAX_RETRY_COUNT = 3;

        function sendStreamDirectly(stream : MediaStream) {
            const signalingSocket = new WebSocket("ws://127.0.0.1:8080");
            const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});


            signalingSocket.onopen = () => {
                retryCount = 0;



                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        signalingSocket.send(event.data);
                        console.log("Sent chunk:", event.data);
                    }
                }
                recorder.onerror = (error) => {
                    console.error("MediaRecorder error:", error);
                };

                recorder.start(1000);
            }

            signalingSocket.onerror = (error) => {
                console.error("WebSocket error:", error);
                signalingSocket.close();
                recorder.stop();
            };
            signalingSocket.onclose = () => {
                console.log("WebSocket connection closed");
                if(retryCount < MAX_RETRY_COUNT){
                    retryCount ++;


                }else {
                    console.log("Mex tries are over.. give up");
                    signalingSocket.close();
                    recorder.stop();
                }
            };
        }
        console.log("sending the data")
        sendStreamDirectly(combinedStream);
    }).catch(error => {
        console.error(error);
    })

}





