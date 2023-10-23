const imageContainer = document.querySelector('.image-container');
const image = imageContainer.querySelector('img');
const dot = document.getElementById('dot');
const target = document.getElementById('target');
let initialDistance = 0;
let initialScale = 1;
let scaleFactor = 1;

class Random {
    constructor(seed = 88675123) {
      this.x = 123456789;
      this.y = 362436069;
      this.z = 521288629;
      this.w = seed;
    }
    
    // XorShift
    next() {
      let t;
   
      t = this.x ^ (this.x << 11);
      this.x = this.y; this.y = this.z; this.z = this.w;
      return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
    }
    
    // min以上max以下の乱数を生成する
    nextInt(min, max) {
      const rr = Math.abs(this.next());
      return min + (rr % (max + 1 - min));
    }
  }

/* 地図の範囲(緯度経度) */
const LN = 35.10448;
const LS = 35.10186;
const LW = 137.14690;
const LE = 137.15115;

let mapRect;
let mapWidth;
let mapHeight;

window.onload = async function() {
    const r = localStorage.getItem("random");
    const l = Number(localStorage.getItem("location"));
    const updateGPS = setInterval(setDotPosition, 5000);
    const target_id = Number(r[l]) - 1;
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

    mapRect = document.getElementById("map").getBoundingClientRect();
    mapWidth = mapRect.right - mapRect.left;
    mapHeight = mapRect.bottom - mapRect.top;

    const random = new Random(Number(r));
    const ranN = random.nextInt(0, 10);
    const ranE = random.nextInt(0, 10);

    const tagN = (target_lat - LN) / (LS - LN) * mapHeight;
    const tagE = (target_lon - LW) / (LE - LW) * mapWidth;

    target.style.left = tagE + ranN + mapRect.left + 'px';
    target.style.top = tagN + ranE + mapRect.top + 'px';

    setDotPosition();
}



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

        console.log(nowN, nowE)

        const mapN = (nowN - LN) / (LS - LN) * mapHeight;
        const mapE = (nowE - LW) / (LE - LW) * mapWidth;

        dot.style.left = mapE + mapRect.left + 'px';
        dot.style.top = mapN + mapRect.top + 'px';
    });
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