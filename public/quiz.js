// パラメータ取得
let params = new URL(window.location.href).searchParams;
let locate = params.get("locate");

// 現在の問題番号
let number;
// 「次の問題へ」ボタン
const next = document.getElementById("next");
/* クイズ */
let questions;

// locate_idを取得
let locate_id;
try {
    const qrtoid = await fetch("/QRtoId", {
        method: 'POST',
        headers: {'Content-Type': 'text/json'},
        body: JSON.stringify({
            locate: locate
        })
    });
    const nn = await qrtoid?.json();
    locate_id = nn[0]["number"];
} catch (e) {
    console.log(e)
}

function decodeLS(ls) {
    let ans = ls;
    let lslist = [false, false, false]
    if (ans >= 4) {
        ans -= 4;
        lslist[2] = true;
    }
    if (ans >= 2) {
        ans -= 2;
        lslist[1] = true;
    }
    if (ans >= 1) {
        lslist[0] = true;
    }
    return lslist;
}

// デバッグ
// 現在のスコア
// localStorage.setItem("score", 0);
// // 現在の問題番号
// localStorage.setItem("number", 0);

// // QRポイントをすでにスキャンしたか
// localStorage.setItem("check_qr", 0);
// // クイズはすでに終了したか
// localStorage.setItem("check_quiz", 0);
// // 今受けているクイズ
// localStorage.setItem("check_now", -1);
localStorage.removeItem("qr");



/* 再試験防止 */
let check_quiz = Number(localStorage.getItem("check_quiz"));
const quiz_list = decodeLS(check_quiz);
if (quiz_list[locate_id]) {     // 試験終了済み
    alert("再試験はできません！");
    window.location.replace("home.html");
} else {                        
    /* 中抜け防止 */
    let check_now = Number(localStorage.getItem("check_now"));
    if (check_now == -1) {                  // 何もクイズを受けていない
        number = 0;
        localStorage.setItem("number", 0);              // 問題番号を0に
        localStorage.setItem("check_now", locate_id);   // 現在のクイズを更新
    } else if (check_now == locate_id) {    // 途中抜け
        number = Number(localStorage.getItem("number"));
    } else {                                // 前のクイズが終了していない
        alert("未完了のクイズがあります");
        window.location.replace("home.html");
    }
}

/* チェックポイントボーナス付与 */
let check_qr = Number(localStorage.getItem("check_qr"));
const qr_list = decodeLS(check_qr);
if (!qr_list[locate_id]) {     // 初スキャン
    // チェックポイントボーナスを追加
    let score = Number(localStorage.getItem("score")) + 5;
    // QR読み取り済み
    localStorage.setItem("score", score);
    check_qr += 2 ** locate_id;
    localStorage.setItem("check_qr", check_qr);
}

try {
    const quiz = await fetch("/getQuiz", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            locate: locate
        })
    })
    if (quiz.status === 200) {
        const json = await quiz?.json();
        questions = json.map(item => {
            const { question, choice1, choice2, choice3, answer } = item;
            const choices = [choice1, choice2, choice3];
            return { question, choices, answer };
        });
    } else {
        console.log("不具合が発生しました");
    }
} catch(error) {
    console.log("不具合が発生しました");
    console.log(error)
}


/* 問題を表示 */
function showQuestion() {
    // 問題番号
    document.getElementById("number").innerText = "第" + (number + 1) + "問";
    
    // 問題文
    const question = questions[number]["question"];
    document.getElementById("question").innerText = question;

    // 選択肢
    const choices = questions[number]["choices"];
    for (let i=0;i<3;i++) {
        const choice = document.getElementById("choice-"+String(i+1));
        choice.innerText = choices[i];
    }

    // ボタン動作
    for (let i=0;i<3;i++) {
        const button = document.getElementById("button-"+String(i+1));
        button.onclick = function () {
            checkAnswer(number, i+1);
        }
    }
}

/* 回答を確認 */
function checkAnswer(q, a) {
    if (questions[q]["answer"] == a) {  // 正解
        for (let i=0;i<3;i++) {
            // 選択肢
            const button = document.getElementById("button-"+String(i+1));
            // クラスをリセット
            button.classList.remove(...button.classList);
            button.classList.add("button", "is-size-4", "choice", "is-fullwidth");
            // 着色
            if (i+1 == questions[q]["answer"]) {    // 正答
                button.classList.add('is-success');
            } else {                                // 誤答
                button.classList.add('is-light');
            }
            // イベントを無効化
            button.onclick = function () {
                ;
            }
        }
        // ポイントを付与
        let score = Number(localStorage.getItem("score"));
        score += 10;
        localStorage.setItem("score", score);
    } else {                            // 不正解
        for (let i=0;i<3;i++) {
            // 選択肢
            const button = document.getElementById("button-"+String(i+1));
            // クラスをリセット
            button.classList.remove(...button.classList);
            button.classList.add("button", "is-size-4", "choice", "is-fullwidth");
            // 着色
            if (i+1 == questions[q]["answer"]) {    // 正答
                button.classList.add('is-success');
            } else if (i+1 == a) {                  // 選択
                button.classList.add('is-warning');
            } else {                                // 誤答
                button.classList.add('is-light');
            }
            // イベントを無効化
            button.onclick = function () {
                ;
            }
        }
    }

    // 正解を表示
    const ans = document.getElementById("number");
    ans.innerText = "正解: " + questions[q]["choices"][questions[q]["answer"] - 1];
    
    number++;
    localStorage.setItem("number", number);

    // 終了処理
    if (number >= 3) {
        localStorage.setItem("check_now", -1);
        check_quiz += 2 ** locate_id;
        localStorage.setItem("check_quiz", check_quiz);
        next.innerText = "ホームに戻る";
        /* 結果ページへ移動 */
        next.onclick = function () {
            window.location.replace("home.html");
        }
    }
    
    // 「次の問題へ」を表示
    next.style.visibility = "visible";
}

/* 次の問題へ移動 */
next.onclick = function () {
    // 「次の問題へ」ボタンを非表示
    next.style.visibility ="hidden";
    for (let i=0;i<3;i++) {
        // 選択肢
        const button = document.getElementById("button-"+String(i+1));
        // クラスをリセット
        button.classList.remove(...button.classList);
        button.classList.add("button", "is-info", "is-size-4", "choice", "is-fullwidth");
    }
    // 次の問題へ
    showQuestion();
}

showQuestion();