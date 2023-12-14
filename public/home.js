// 長押し時間
let pressStartTime;

/* タイマー */
const deadline = new Date('2023-12-24T00:00:00');
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
        document.getElementById("timer").textContent = "Our TJ-Program was Ended";
    }
    
}

window.onload = function () {
    countdown();
    document.getElementById("point").innerText = localStorage.getItem("score");
}

document.getElementById("hint").onclick = async (e) => {
    e.preventDefault();
    window.location.assign("map.html")
}

/* ボトムナビゲーション */
// [HOME]
document.getElementById("home").onclick = async (e) => {
    e.preventDefault();
    window.location.assign("home.html")
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

/*
 * 機能実装
*/
