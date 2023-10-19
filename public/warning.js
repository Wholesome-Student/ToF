// // 地磁気センサーと加速度計のデータを格納する変数
// let magneticData = null;
// let accelerationData = null;

// let maxSpeed = 0;

// // HTMLの要素を取得
// const speedElement = document.getElementById('speed');
// const maxElement = document.getElementById('maxspeed');

// // 地磁気センサーのデータを取得するイベントリスナー
// window.addEventListener('deviceorientation', function(event) {
//   magneticData = event;
// });

// // 加速度計のデータを取得するイベントリスナー
// window.addEventListener('devicemotion', function(event) {
//   accelerationData = event.acceleration;
// });

// navigator.geolocation.getCurrentPosition(successCallback);

// // 移動速度を計算する関数
// function calculateSpeed() {
//     var speed = position.coords.speed;

//     // 移動速度を表示
//     speedElement.textContent = '速度: ' + speed;

//     if (speed > maxSpeed) {
//         maxSpeed = speed;
//     }
//     maxElement.textContent = '最高速度: ' + maxSpeed;
  
// }

// // 一定の間隔で移動速度を計算する
// setInterval(calculateSpeed, 1000); // 1秒ごとに計算

// 位置情報の取得に成功した場合に呼び出されるコールバック関数
function successCallback(position) {
    // 速度を取得する
    var speed = position.coords.speed;

    // 速度が利用可能な場合は、値を表示する
    if (speed !== null) {
      document.getElementById("speed").textContent = speed;
    } else {
      document.getElementById("speed").textContent = "Speed information is not available.";
    }
  }

  // ユーザーの現在の位置情報を取得する
  navigator.geolocation.getCurrentPosition(successCallback);