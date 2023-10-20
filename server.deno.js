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

async function signup(username, password) {
    // ユーザー追加
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

    if (req.method === "POST" && pathname === "/signup") {
        try {
            const reqJson = await req.json();
            signup(reqJson.username, reqJson.password);
            return new Response(null, {
                status: 200,
            });
        } catch (error) {
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