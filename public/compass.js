// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

// 初期化
function init() {
    // 簡易的なOS判定
    os = detectOSSimply();
    if (os == "iphone") {
        // safari用。DeviceOrientation APIの使用をユーザに許可して貰う
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
        window.alert("PC未対応サンプル");
    }
}


// ジャイロスコープと地磁気をセンサーから取得
function orientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    let degrees;

    if(os == "iphone") {
        degrees = event.webkitCompassHeading;
    } else {
        degrees = 360 - alpha;
    }

    let direction;
    if ((degrees > 337.5 && degrees < 360) || (degrees > 0 && degrees < 22.5)) {
        direction = "北";
    } else if (degrees > 22.5 && degrees < 67.5) {
        direction = "北東";
    } else if (degrees > 67.5 && degrees < 112.5) {
        direction = "東";
    } else if (degrees > 112.5 && degrees < 157.5) {
        direction = "東南";
    } else if (degrees > 157.5 && degrees < 202.5) {
        direction = "南";
    } else if (degrees > 202.5 && degrees < 247.5) {
        direction = "南西";
    } else if (degrees > 247.5 && degrees < 292.5) {
        direction = "西";
    } else if (degrees > 292.5 && degrees < 337.5) {
        direction = "北西";
    }

    const rotate = 360 - degrees;

    document.querySelector("#direction").innerHTML = direction + " : " + degrees;
    document.getElementById('needle').style.transform = 'rotate(' + rotate + 'deg)';
}

// 簡易OS判定
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