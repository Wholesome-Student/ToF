var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");

/* 辺の描画 */
function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

// ウィンドウのサイズに応じてビデオ要素のサイズを調整する
function adjustVideoSize() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var videoWidth = video.videoWidth;
    var videoHeight = video.videoHeight;
    var videoAspectRatio = videoWidth / videoHeight;

    var targetWidth;
    var targetHeight;

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
        outputContainer.hidden = false;


        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        // QRコードの読み取り
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            // QRコードの場所に四角形を描画
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            outputMessage.hidden = true;
            outputData.parentElement.hidden = false;
            outputData.innerText = code.data;
        } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
        }
    }
    requestAnimationFrame(tick);
}