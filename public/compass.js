// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

/* 初期化処理 */
function init() {
    os = detectOSSimply();  // os判定

    if (os == "iphone") {
        document.querySelector("#permit").addEventListener("click", permitDeviceOrientationForSafari);
        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else {
        window.alert("このデバイスには対応していません");
    }
}

/* 端末の方角を取得 */
function orientation(event) {
    const alpha = event.alpha;
    let degrees;

    if(os == "iphone") {
        degrees = 360 - event.webkitCompassHeading;
    } else {
        degrees = alpha;
    }


    // 35.09392818712668, 137.1554000139451

    // 35.09326980912067, 137.15660045747703

    // lat -> N, lon -> E
    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition((position) => {
        const lon1 = position.coords.longitude;
        const lat1 = position.coords.latitude;
        console.log(lon1, lat1)
        const lon2 = 35.075436;
        const lat2 = 137.143422;
        console.log(dirG(lon1, lat1, lon2, lat2));
        const rotate = degrees - dirG(lon1, lat1, lon2, lat2);
        console.log(rotate);
        // コンパスの針を回転
        // document.getElementById('needle').style.transform = 'rotate(' + rotate + 'deg)';
        document.getElementById('needle').style.transform = 'rotate(' + degrees + 'deg)';
    })
}

/* 目的地への方角を取得 */
function dirG(lon1, lat1, lon2, lat2) {
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
    return rotate;
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