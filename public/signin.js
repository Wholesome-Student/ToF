// 使用可能な文字列か確認
function checkRegex(s) {
    const regex = /^[a-zA-Z0-9]+$/;
  
    // 正規表現に合致しない文字が存在するかをチェック
    const unmatched = s.replace(regex, '');
    
    // 合致しない文字の有無を返す
    return (unmatched.length == 0);
}

document.getElementById("signin").onclick = async (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if(username === "") {
        document.getElementById("log").textContent = "ユーザー名を入力してください"
    } else if(password === "") {
        document.getElementById("log").textContent = "パスワードを入力してください"
    } else if(!checkRegex(username)) {
        document.getElementById("log").textContent = "ユーザー名には英数字のみ使用できます"
    } else if(!checkRegex(password)) {
        document.getElementById("log").textContent = "パスワードには英数字のみ使用できます"
    } else {
        try {
            const res = await fetch("/signin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            if(res.status === 200) {
                localStorage.setItem("username", username)
                // デバッグ
                // 現在のスコア
                localStorage.setItem("score", 0);
                // 現在の問題番号
                localStorage.setItem("number", 0);
                // QRポイントをすでにスキャンしたか
                localStorage.setItem("check_qr", 0);
                // クイズはすでに終了したか
                localStorage.setItem("check_quiz", 0);
                // 今受けているクイズ
                localStorage.setItem("check_now", -1);
                // フルスクリーン
                localStorage.setItem("fullscreen", 0);
                
                // 回る順序
                const r = Math.floor(Math.random() * 6);
                const l = [1234, 1324, 2134, 2314, 3124, 3214];
                localStorage.setItem("random", l[r]);
                // 回った場所の数
                localStorage.setItem("location", 0);
                
                // if (!localStorage.hasOwnProperty("score")) {
                //     localStorage.setItem("score", 0);
                // }
                // if (!localStorage.hasOwnProperty("number")) {
                //     localStorage.setItem("number", 0);
                // }
                // if (!localStorage.hasOwnProperty("check_qr")) {
                //     localStorage.setItem("check_qr", 0);
                // }
                // if (!localStorage.hasOwnProperty("check_quiz")) {
                //     localStorage.setItem("check_quiz", 0);
                // }
                // if (!localStorage.hasOwnProperty("check_now")) {
                //     localStorage.setItem("check_now", -1);
                // }
                // if (!localStorage.hasOwnProperty("random")) {
                //     const r = Math.floor(Math.random() * (6 + 1));
                //     const l = [1234, 1324, 2134, 2314, 3124, 3214];
                //     localStorage.setItem("random", l[r]);
                // }
                // if (!localStorage.hasOwnProperty("location")) {
                //     localStorage.setItem("location", 0);
                // }
                window.location.assign("./home.html");
            } else if(res.status === 401) {
                document.getElementById("log").textContent = "サインインに失敗しました"
            } else {
                document.getElementById("log").textContent = "サーバー側の不具合が発生しました"
            }
        } catch(error) {
            document.getElementById("log").textContent = "クライアント側の不具合が発生しました"
            console.log(error)
        }
  }
}

document.getElementById("signup").onclick = async(e) => {
    e.preventDefault();
    window.location.assign("./signup.html");
}