import {clearCanvas, deleteImage, drawCanvas, getImage, postImage} from "./helpers";

const App = () => {
    const button: HTMLElement = document.getElementById('upload')!;
    const reset: HTMLElement = document.getElementById('reset')!;
    const videoContainer: HTMLElement = document.getElementById('video-container')!;
    const overlay: HTMLElement = document.getElementById('overlay')!;
    const takePhotoButton: HTMLElement = document.getElementById('take-a-photo')!;
    const canvas: HTMLCanvasElement = document.querySelector('#photo')!;
    const video: HTMLVideoElement = <HTMLVideoElement>document.getElementById('video')!;

    const toggleButtons = (isPhotoExist: boolean = false) => {
        if (isPhotoExist) {
            button.innerText = 'Change Photo';
            reset.removeAttribute('hidden');
            canvas.removeAttribute('hidden');
        } else {
            button.innerText = 'Upload Photo';
            reset.setAttribute('hidden', '');
            canvas.setAttribute('hidden', '');
        }
    }

    (async () => {
        const blob = await getImage();
        if (blob) {
            const img = await createImageBitmap(blob);
            if (img) {
                drawCanvas(canvas, img);
                toggleButtons(true);
            }
        }
    })();


    reset.onclick = async (e) => {
        e.preventDefault();
        await deleteImage();
        const bgCanvas: HTMLCanvasElement = document.querySelector('#bg')!;
        if (bgCanvas) {
            bgCanvas.remove();
        }
        clearCanvas(canvas);
        toggleButtons();
    };

    const toggleVideo = (hide: boolean = false): void => {
        if (hide) {
            const src = video.srcObject as MediaStream
            const tracks = src?.getTracks();

            tracks[0].stop();
            videoContainer.setAttribute('hidden', '');
            overlay.setAttribute('hidden', '');
        }
        else {
            videoContainer.removeAttribute('hidden');
            overlay.removeAttribute('hidden');
        }
    }

    button.onclick = async (e) => {
        e.preventDefault();
        // open camera and get stream
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        if (stream) {
            // show video and overlay
            toggleVideo();
            video.srcObject = stream;
        }
    };

    takePhotoButton.onclick = async (e) => {
        e.preventDefault();
        const stream = video.srcObject as MediaStream
        if (stream) {
            const track = stream?.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const blob = await imageCapture.takePhoto();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                postImage(reader.result)
            }
            const imageBitmap = await createImageBitmap(blob);
            if (imageBitmap) {
                const bgCanvas: HTMLCanvasElement = document.querySelector('#bg')!;
                if (bgCanvas) {
                    bgCanvas.remove();
                }
                drawCanvas(canvas, imageBitmap);
            }
            toggleButtons(true);
            toggleVideo(true);
        }
    };

    overlay.onclick = (e) => {
        e.preventDefault();

        toggleVideo(true);
    }
};

export default App;