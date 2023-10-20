function isPhone() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  }

function isLogin() {
    const result = localStorage.getItem('username');
    if (result === null) {
        return false;
    } else {
        return true;
    }
}

window.onload = function () {
    // スマホ
    if (isPhone()) {
        if (isLogin()) {    // ログイン済
            window.location.replace('./home.html');
        } else {
            window.location.replace('./signin.html');
        }
    } else {
        window.location.replace('./unsupporteddevice.html');
    }
}