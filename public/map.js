const imageContainer = document.querySelector('.image-container');
const image = imageContainer.querySelector('img');
const dot = document.getElementById('dot');
let initialDistance = 0;
let initialScale = 1;
let scaleFactor = 1;

const updateGPS = setInterval(setDotPosition, 1000);

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialScale = parseFloat(image.style.transform.replace('scale(', '').replace(')', ''));
    }
}

function handleTouchMove(event) {
    if (event.touches.length === 2) {
        const currentDistance = getDistance(event.touches[0], event.touches[1]);
        const scale = initialScale * (currentDistance / initialDistance);
        image.style.transform = 'scale(' + scale + ')';
        scaleFactor = scale;
        setDotPosition(event.touches[0].clientX, event.touches[0].clientY);
    }
}

function handleTouchEnd() {
    initialDistance = 0;
    initialScale = 1;
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

imageContainer.addEventListener('touchstart', handleTouchStart);
imageContainer.addEventListener('touchmove', handleTouchMove);
imageContainer.addEventListener('touchend', handleTouchEnd);

// 追加: 点の座標を設定する関数
function setDotPosition(gps_latitude, gps_longitude) {
    /* 地図の範囲(緯度経度) */
    const LN = 35.1044600;
    const LS = 35.1025900;
    const LW = 137.1466500;
    const LE = 137.1496500;

    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition((position) => {
        const nowN = position.coords.latitude;
        const nowE = position.coords.longitude;
        console.log(nowN, nowE);

        const mapRect = document.getElementById("map").getBoundingClientRect();
        const mapWidth = mapRect.right - mapRect.left;
        const mapHeight = mapRect.bottom - mapRect.top;

        const mapN = (nowN - LN) / (LS - LN) * mapHeight;
        const mapE = (nowE - LW) / (LE - LW) * mapWidth;

        console.log(mapN, mapE);
        dot.style.left = mapE + mapRect.left + 'px';
        dot.style.top = mapN + mapRect.top + 'px';
    });
}

window.onload = function() {
    setDotPosition();
}

// [HOME]
document.getElementById('home').addEventListener('touchstart', function(event) {
    pressStartTime = new Date().getTime();
});

document.getElementById('home').onclick = async (e) => {
    e.preventDefault();
    document.location.assign('./index.html');
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