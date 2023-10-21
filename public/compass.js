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

    // lon -> 経度(N), lat -> 緯度(E)
    const lon1 = 137.1554000139451;
    const lat1 = 35.09392818712668;
    const lon2 = 137.15660045747703;
    const lat2 = 35.09326980912067;
    const rotate =  dirG(lon1, lat1, lon2, lat2) - degrees;
    console.log(rotate);
    // コンパスの針を回転
    document.getElementById('needle').style.transform = 'rotate(' + rotate + 'deg)';
    
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