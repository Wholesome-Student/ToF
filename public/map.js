var imageContainer = document.querySelector('.image-container');
var image = imageContainer.querySelector('img');
var dot = document.getElementById('dot');
var initialDistance = 0;
var initialScale = 1;
var scaleFactor = 1;

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialScale = parseFloat(image.style.transform.replace('scale(', '').replace(')', ''));
    }
}

function handleTouchMove(event) {
    if (event.touches.length === 2) {
        var currentDistance = getDistance(event.touches[0], event.touches[1]);
        var scale = initialScale * (currentDistance / initialDistance);
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
    var dx = touch1.clientX - touch2.clientX;
    var dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

imageContainer.addEventListener('touchstart', handleTouchStart);
imageContainer.addEventListener('touchmove', handleTouchMove);
imageContainer.addEventListener('touchend', handleTouchEnd);

// 追加: 点の座標を設定する関数
function setDotPosition(gps_latitude, gps_longitude) {
    const LN = 35.1044600;
    const LS = 35.1025900;
    const LW = 137.1466500;
    const LE = 137.1496500;

    let nowN = gps_latitude;
    let nowE = gps_longitude;
    console.log(nowN, nowE);

    var mapRect = document.getElementById("map").getBoundingClientRect();
    var mapWidth = mapRect.right - mapRect.left;
    var mapHeight = mapRect.bottom - mapRect.top;

    let mapN = (nowN - LN) / (LS - LN) * mapHeight;
    let mapE = (nowE - LW) / (LE - LW) * mapWidth;

    console.log(mapN, mapE);
    dot.style.left = mapE + mapRect.left + 'px';
    dot.style.top = mapN + mapRect.top + 'px';
}

window.onload = function() {
    if ('geolocation' in navigator) {
        const geolocation = navigator.geolocation;
        geolocation.getCurrentPosition((position) => {
            const gps_latitude = position.coords.latitude;
            const gps_longitude = position.coords.longitude;
            setDotPosition(gps_latitude, gps_longitude);
        });
    } else {
        console.error('this browser has not support geolocation.');
    }
}
