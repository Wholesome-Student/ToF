const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const loadingMessage = document.getElementById("loadingMessage");

let enable = 1;

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

// localStorage.setItem("location", 0);

function decodeLS(ls) {
    let ans = ls;
    let lslist = [false, false, false]
    if (ans >= 4) {
        ans -= 4;
        lslist[2] = true;
    }
    if (ans >= 2) {
        ans -= 2;
        lslist[1] = true;
    }
    if (ans >= 1) {
        lslist[0] = true;
    }
    return lslist;
}

window.addEventListener("resize", adjustVideoSize);

const qrjson = await fetch("/qrlist", {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: null
});

let json;

if (qrjson.status === 200) {
    json = await qrjson?.json();
}

// フロントカメラから映像を取得
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

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
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            for (let i=0;i<3;i++) {
                if (code.data == json[i]["qr"]) {
                    let lsv = Number(localStorage.getItem("location"));
                    const checklist = decodeLS(lsv);
                    console.log(checklist);
                    if (!checklist[i]) {
                        enable = 0;
                        lsv += 2 ** i;
                        localStorage.setItem("location", lsv);
                        document.location.assign('./check.html'
                            + '?location=' + json[i]["qr"]);
                    } else {
                        alert("同じ地点を2回登録することはできません!");
                    }
                }
            }
        }
    }
    if (enable) {
        requestAnimationFrame(tick);
    }
}

// [HOME]
document.getElementById('home').onclick = async (e) => {
    e.preventDefault();
    document.location.assign('./home.html');
}

// [ITEM]
document.getElementById("item").onclick = async (e) => {
    e.preventDefault();
    document.getElementById('item-mordal').classList.toggle('open');
    if (document.getElementById('other-mordal').classList.contains('open')) {
        document.getElementById('other-mordal').classList.toggle('open');
    }
}

// [OTHER]
document.getElementById("other").onclick = async (e) => {
    e.preventDefault();
    document.getElementById('other-mordal').classList.toggle('open');
    if (document.getElementById('item-mordal').classList.contains('open')) {
        document.getElementById('item-mordal').classList.toggle('open');
    }
}