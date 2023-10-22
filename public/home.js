// 長押し時間
let pressStartTime;

/* タイマー */
const deadline = new Date('2023-10-23T16:00:00');
const countdownInterval = setInterval(countdown, 1000);

function countdown() {
    const now = new Date();
    const remain = Math.floor((deadline - now) / 1000);
    if (remain > 0) {
        const hours = Math.floor(remain / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((remain - 3600 * hours) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(remain % 60).toString().padStart(2, '0');
        document.getElementById("timer").textContent = [hours, minutes, seconds].join(':');
    } else {
        document.getElementById("timer").textContent = "終了しました";
    }
    
}

window.onload = function () {
    countdown();
    document.getElementById("point").innerText = localStorage.getItem("score");
}

/* ボトムナビゲーション */
// [HOME]
document.getElementById('home').addEventListener('touchstart', function(event) {
    pressStartTime = new Date().getTime();
});

document.getElementById('home').addEventListener('touchend', function(event) {
    const pressEndTime = new Date().getTime();
    const pressDuration = pressEndTime - pressStartTime;
  
    if (pressDuration >= 750) {
        // 長押しの場合の処理（test.htmlにジャンプ）
        fullscreen();
    } else {
        // 短押しの場合の処理（index.htmlにジャンプ）
        document.location.assign('./home.html');
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
                    _element.webkitRequestFullscreen();
                }
            }
        }
    }
};

