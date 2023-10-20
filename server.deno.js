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
        SELECT * FROM login WHERE ?? = ? LIMIT 1;
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
        SELECT * FROM login WHERE (
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
        INSERT INTO login (
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

serve(async (req) => {
    const pathname = new URL(req.url).pathname;

    /* ユーザー登録 */
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
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
      })
})