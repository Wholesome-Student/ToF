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

/* 方角を取得 */
function orientation(event) {
    const alpha = event.alpha;
    let degrees;

    if(os == "iphone") {
        degrees = 360 - event.webkitCompassHeading;
    } else {
        degrees = alpha;
    }

    // コンパスの針を回転
    document.getElementById('needle').style.transform = 'rotate(' + degrees + 'deg)';
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

// iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
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