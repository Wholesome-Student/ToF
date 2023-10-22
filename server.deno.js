import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { serveDir } from 'http/file_server.ts'
import "https://deno.land/std@0.193.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

// MySQLのDBにアクセスして、操作用のクライアントを生成
const sql = await new Client().connect({
    hostname: Deno.env.get("MYSQL_HOSTNAME"),
    username: Deno.env.get("MYSQL_USER"),
    password: Deno.env.get("MYSQL_PASSWORD"),
    db: Deno.env.get("MYSQL_DBNAME")
});

/* ユーザー名を検索 */
async function searchUser(username) {
    const response = await sql.execute(`
        SELECT * FROM TJ WHERE ?? = ? LIMIT 1;
    `, [
        "username",
        username
        ]
    )
    return response.rows.length;
}

/* ユーザーのログイン */
async function signin(username, password) {
    const response = await sql.execute(`
        SELECT * FROM TJ WHERE (
            ??, ??
        ) = (
            ?, ?
        ) LIMIT 1;
    `, [
        "username",
        "password",
        username,
        password
        ]
    )
    return response.rows.length;
}

/* ユーザーを追加 */
async function signup(username, password) {
    await sql.execute(`
        INSERT INTO TJ (
            ??, ??
        ) VALUES (
            ?, ?
        );
    `, [
        "username",
        "password",
        username,
        password
        ]
    )
}

/* ランキング */
async function rank() {
    const response = await sql.execute(`SELECT username, point FROM TJ ORDER BY point DESC LIMIT 3;`)
    return response.rows;
}

/* QR */
async function qrlist() {
    const response = await sql.execute(`SELECT * FROM LOCATION;`)
    return response.rows;
}

/* クイズリスト */
async function getQuiz(locate) {
    const response = 
        await sql.execute(`SELECT 
            question, choice1, choice2, choice3, answer FROM QUIZ 
            WHERE locate = ?;
        `, [
            locate
            ]
        )

    return response.rows;
}

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    if (req.method === "POST" && pathname === "/signup") {
        try {
            const reqJson = await req.json();
            const userExists = await searchUser(reqJson.username);
            if (!userExists) { // ユーザー未登録時
                signup(reqJson.username, reqJson.password);
                return new Response(null, {
                    status: 200,
                });
            } else {            // ユーザー既登録時
                return new Response(null, {
                    status: 409,
                });
            }
        } catch (error) {       // その他のエラー
            console.error(error);
            return new Response(null, {
                status: 500,
            });
        }
    } else if (req.method === "POST" && pathname === "/signin") {
        try {
            const reqJson = await req.json();
            const loginExists = await signin(reqJson.username, reqJson.password);
            if (loginExists) {  // サインイン成功
                signup(reqJson.username, reqJson.password);
                return new Response(null, {
                    status: 200,
                });
            } else {            // サインイン失敗
                return new Response(null, {
                    status: 401,
                });
            }
        } catch (error) {       // その他のエラー
            console.error(error);
            return new Response(null, {
                status: 500,
            });
        }
    } else if (req.method === "POST" && pathname === "/rank") {
        try {
            const ranking = await rank();
            return new Response(JSON.stringify(ranking), {
                status: 200,
            });
        } catch (error) {       // その他のエラー
            console.error(error);
            return new Response(null, {
                status: 500,
            });
        }
    } else if (req.method === "POST" && pathname === "/qrlist") {
        try {
            const ranking = await qrlist();
            return new Response(JSON.stringify(ranking), {
                status: 200,
            });
        } catch (error) {       // その他のエラー
            console.error(error);
            return new Response(null, {
                status: 500,
            });
        }
    } else if (req.method === "POST" && pathname === "/getQuiz") {
        try {
            const reqJson = await req.json();
            const quiz = await getQuiz(reqJson.locate);
            return new Response(JSON.stringify(quiz), {
                status: 200,
            });
        } catch (error) {       // その他のエラー
            console.error(error);
            return new Response(null, {
                status: 500,
            });
        }
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
      })
})