// 現在の問題番号
let number = 0;
// 現在のスコア
let score = 0;
// 「次の問題へ」ボタン
const next = document.getElementById("next");
/* クイズ */
let questions;
try {
    const quiz = await fetch("/getQuiz", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            locate: "e798582707b6ca5e930168259d61e797020f89190dea9faf6064ff45c3a7860c"
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

            // ポイントを付与
            score += 10;
        }
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

    const ans = document.getElementById("number");
    ans.innerText = "正解: " + questions[q]["choices"][questions[q]["answer"] - 1];



    // 最終問題の場合
    if (number == 2) {
        next.innerText = "結果を表示";
        /* 結果ページへ移動 */
        next.onclick = function () {
            window.location.replace("result.html?score=" + score);
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
    number++;
    showQuestion();
}

showQuestion();