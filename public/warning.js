// 地磁気センサーと加速度計のデータを格納する変数
let magneticData = null;
let accelerationData = null;

// HTMLの要素を取得
const speedElement = document.getElementById('speed');

// 地磁気センサーのデータを取得するイベントリスナー
window.addEventListener('deviceorientation', function(event) {
  magneticData = event;
});

// 加速度計のデータを取得するイベントリスナー
window.addEventListener('devicemotion', function(event) {
  accelerationData = event.acceleration;
});

// 移動速度を計算する関数
function calculateSpeed() {
  if (magneticData && accelerationData) {
    // 地磁気センサーのデータからスマートフォンの向きを取得
    const alpha = magneticData.alpha;
    const beta = magneticData.beta;
    const gamma = magneticData.gamma;

    // 加速度計のデータから加速度を取得
    const accelerationX = accelerationData.x;
    const accelerationY = accelerationData.y;
    const accelerationZ = accelerationData.z;

    // 移動速度を計算 (ここでは単純に3軸の加速度の絶対値を合算しています)
    const speed = Math.abs(accelerationX) + Math.abs(accelerationY) + Math.abs(accelerationZ);

    // 移動速度を表示
    speedElement.textContent = '速度: ' + speed;
  }
}

// 一定の間隔で移動速度を計算する
setInterval(calculateSpeed, 1000); // 1秒ごとに計算