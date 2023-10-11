import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { serveDir } from 'http/file_server.ts'

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