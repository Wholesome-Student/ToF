const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const loadingMessage = document.getElementById("loadingMessage");

// ウィンドウのサイズに応じてビデオ要素のサイズを調整する
function adjustVideoSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspectRatio = videoWidth / videoHeight;

    let targetWidth;
    let targetHeight;

    // ウィンドウのアスペクト比とビデオのアスペクト比を比較して、適切なサイズを計算する
    if (windowWidth / windowHeight > videoAspectRatio) {
        targetWidth = windowWidth;
        targetHeight = windowWidth / videoAspectRatio;
    } else {
        targetWidth = windowHeight * videoAspectRatio;
        targetHeight = windowHeight;
    }

    // ビデオ要素のサイズを設定する
    video.style.width = targetWidth + "px";
    video.style.height = targetHeight + "px";
}

window.addEventListener("resize", adjustVideoSize);

// フロントカメラから映像を取得
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    /* 映像が有効になった時 */
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // loadingを非表示
        loadingMessage.hidden = true;
        canvasElement.hidden = false;


        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        // QRコードの読み取り
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        /* QRコードを検出 */
        if (code) {
            console.log(code.data);
        } else {
            ;
        }
    }
    requestAnimationFrame(tick);
}