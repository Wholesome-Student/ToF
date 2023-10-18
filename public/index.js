// 長押し時間
let pressStartTime;

/* ボトムナビゲーション */
// [HOME]
document.getElementById('home').addEventListener('touchstart', function(event) {
    pressStartTime = new Date().getTime();
});

document.getElementById('home').addEventListener('touchend', function(event) {
    const pressEndTime = new Date().getTime();
    const pressDuration = pressEndTime - pressStartTime;
  
    if (pressDuration >= 1000) {
        // 長押しの場合の処理（test.htmlにジャンプ）
        fullscreen();
    } else {
        // 短押しの場合の処理（index.htmlにジャンプ）
        document.location.assign('index.html');
    }
});

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

/*
 * 機能実装
*/

// 全画面化
function fullscreen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
        if (document.cancelFullScreen) {
        document.cancelFullScreen();
        } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
            }
        }
        }
    } else {
        const _element = document.documentElement;
        if (_element.requestFullscreen) {
        _element.requestFullscreen();
        } else {
        if (_element.mozRequestFullScreen) {
            _element.mozRequestFullScreen();
        } else {
            if (_element.webkitRequestFullscreen) {
            _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }
        }
    }
    };

    const userAgent = window.navigator.userAgent;

    const iPadSafari =
    !!userAgent.match(/iPad/i) &&     // Detect iPad first.
    !!userAgent.match(/WebKit/i) &&   // Filter browsers with webkit engine only
    !userAgent.match(/CriOS/i) &&   // Eliminate Chrome & Brave
    !userAgent.match(/OPiOS/i) &&   // Rule out Opera
    !userAgent.match(/FxiOS/i) &&   // Rule out Firefox
    !userAgent.match(/FocusiOS/i);    // Eliminate Firefox Focus as well!

    const element = document.getElementById('fullScreenButton');

    function iOS() {
    if (userAgent.match(/ipad|iphone|ipod/i)) {
        const iOS = {};
        iOS.majorReleaseNumber = +userAgent.match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace('OS ', '');
        return iOS;
    }
    }

    if (element !== null) {
    if (userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        element.className += ' hidden';
    } else if (userAgent.match(/iPad/i) && iOS().majorReleaseNumber < 12) {
        element.className += ' hidden';
    } else if (userAgent.match(/iPad/i) && !iPadSafari) {
        element.className += ' hidden';
    } else {
        element.addEventListener('click', _toggleFullScreen, false);
    }
}
