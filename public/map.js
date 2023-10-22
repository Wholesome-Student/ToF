const imageContainer = document.querySelector('.image-container');
const image = imageContainer.querySelector('img');
const dot = document.getElementById('dot');
const target = document.getElementById('target');
let initialDistance = 0;
let initialScale = 1;
let scaleFactor = 1;

// const updateGPS = setInterval(setDotPosition, 5000);

const r = localStorage.getItem("random");
const l = Number(localStorage.getItem("location"));
const target_id = Number(r[1]) - 1;
let target_lat;
let target_lon;
try {
    const idtoll = await fetch("/IdtoLL", {
        method: 'POST',
        headers: {'Content-Type': 'text/json'},
        body: JSON.stringify({
            id: target_id
        })
    });
    const nn = await idtoll?.json();
    target_lat = nn[0]["lat"];
    target_lon = nn[0]["lon"];
} catch (e) {
    console.log(e);
}

/* 地図の範囲(緯度経度) */
const LN = 35.1044600;
const LS = 35.1025900;
const LW = 137.1466500;
const LE = 137.1496500;

const mapRect = document.getElementById("map").getBoundingClientRect();
const mapWidth = mapRect.right - mapRect.left;
const mapHeight = mapRect.bottom - mapRect.top;

const tagN = (target_lat - LN) / (LS - LN) * mapHeight;
const tagE = (target_lon - LW) / (LE - LW) * mapWidth;

target.style.left = tagE + mapRect.left + 'px';
target.style.top = tagN + mapRect.top + 'px';


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
        // setDotPosition();
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
function setDotPosition() {
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
    // setDotPosition();
}

// [HOME]
document.getElementById('home').addEventListener('touchstart', function(event) {
    pressStartTime = new Date().getTime();
});

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