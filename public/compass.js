// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

let mode = 0;

const r = localStorage.getItem("random");
const l = Number(localStorage.getItem("location"));
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

function adjust() {
    mode = 1;
    document.getElementById("tutorial").innerText = "10秒間スマホを傾けて針を回してください";
    setTimeout(reset, 10000);
}

function reset() {    
    mode = 0;
    document.getElementById("tutorial").innerText = "補正完了";
}

/* 初期化処理 */
function init() {
    os = detectOSSimply();  // os判定

    if (os == "iphone") {
        document.querySelector("#permit").addEventListener("click", permitDeviceOrientationForSafari);
        document.querySelector("#permit").innerText = "許可";
        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        document.querySelector("#permit").addEventListener("click", adjust);
        document.querySelector("#permit").innerText = "補正";
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else {
        window.alert("このデバイスには対応していません");
    }
}

function compassHeading(alpha, beta, gamma) {
    const degtorad = Math.PI / 180; // Degree-to-Radian conversion

    const _x = beta ? beta * degtorad : 0; // beta value
    const _y = gamma ? gamma * degtorad : 0; // gamma value
    const _z = alpha ? alpha * degtorad : 0; // alpha value

    const cX = Math.cos(_x);
    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

/* 端末の方角を取得 */
function orientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    let degrees;

    if(os == "iphone") {
        degrees = 360 - event.webkitCompassHeading;
    } else {
        if (!mode) {
            degrees = alpha;
        } else {
            degrees = compassHeading(alpha, beta, gamma);
        }
    }

    // lat -> N(緯度), lon -> E(経度)
    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition((position) => {
        // 現在位置を取得
        const lat1 = position.coords.latitude;
        const lon1 = position.coords.longitude;
        console.log("現在地:\n", Math.round(lat1 * 1000) / 1000, Math.round(lon1 * 1000) / 1000);
        console.log("https://www.google.co.jp/maps/place/"+String(lat1)+"N+"+String(lon1)+"E")

        // 目的地を取得
        // 高専
        
        const lat2 = target_lat;
        const lon2 = target_lon;
        console.log("目的地:\n", Math.round(lat2 * 1000) / 1000, Math.round(lon2 * 1000) / 1000);
        console.log("https://www.google.co.jp/maps/place/"+String(lat2)+"N+"+String(lon2)+"E")

        // 背景を変更
        const distance = strength(lat1, lon1, lat2, lon2);
        document.getElementById('radar').src = "img/radar_"+String(distance)+".png";


        let needle;

        console.log(getBearing(lat1, lon1, lat2, lon2))

        // コンパスの針を回転
        needle = degrees - getBearing(lat1, lon1, lat2, lon2);
        // needle = degrees;
        document.getElementById('needle').style.transform = 'rotate(' + needle + 'deg)';
    })
}

function getBearing(lat1, lon1, lat2, lon2) {
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    return bearing;
  }

/* 目的地への方角を取得 */
function dirG(lat1, lon1, lat2, lon2) {
    const degToRad = Math.PI / 180;
    const radToDeg = 180 / Math.PI;

    const x1 = lon1 * degToRad;
    const y1 = lat1 * degToRad;
    const x2 = lon2 * degToRad;
    const y2 = lat2 * degToRad;

    const rotate = 90 - Math.atan(
        (Math.sin(x2 - x1) / 
            (Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(x2 - x1))
        )) * radToDeg;
    console.log("方角:", rotate);
    return rotate;
}

/* 目的地への距離を取得 */
function strength(lat1, lon1, lat2, lon2) {
    const degToRad = Math.PI / 180;
    const earthRadiusKm = 6371;
  
    const dLat = (lat2 - lat1) * degToRad;
    const dLon = (lon2 - lon1) * degToRad;
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * degToRad) * Math.cos(lat2 * degToRad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadiusKm * c * 1000;

    console.log("距離:", Math.round(distance), "[m]");
    if (distance <= 20) {
        return 5;
    } else if (distance <= 40) {
        return 4;
    } else if (distance <= 60) {
        return 3;
    } else if (distance <= 80) {
        return 2;
    } else if (distance <= 100) {
        return 1;
    } else {
        return 0;
    }
}
/* OSを判定 */
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

/* APIの許可申請 */
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    detectDirection
                );
            }
        })
        .catch(console.error);
}

/* ボトムナビゲーション */
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