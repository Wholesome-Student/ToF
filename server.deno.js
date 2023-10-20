import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { serveDir } from 'http/file_server.ts'
import "https://deno.land/std@0.193.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

// MySQLのDBにアクセスして、操作用のクライアントを生成
const mySqlClient = await new Client().connect({
    hostname: Deno.env.get("MYSQL_HOSTNAME"),
    username: Deno.env.get("MYSQL_USER"),
    password: Deno.env.get("MYSQL_PASSWORD"),
    db: Deno.env.get("MYSQL_DBNAME")
})


// // SELECTなど、取得用SQLを実行する
const selectResult = await mySqlClient.query(`SELECT * FROM teacher_futaba;`)
console.log(selectResult)

// // INSERTなど、書込用SQLを実行する
// const insertResult = await mySqlClient.execute(`
//     INSERT INTO teacher_futaba (
//         name, joining_date
//     ) VALUES (
//         ?, ?
//     );
// `, [
//     "じぐ美先生",
//     new Date()
//     ]
// )

serve(async (req) => {
    const pathname = new URL(req.url).pathname;

    if (req.method === "POST" && pathname === "/hello") {
        const reqJson = await req.json();
        let greet = "Hello, " + reqJson.msg + "!";
        return new Response(greet);
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
      })
})