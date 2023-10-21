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
                if (!localStorage.hasOwnProperty("location")) {
                    localStorage.setItem("location", 0)
                }
                window.location.assign("./home.html")
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