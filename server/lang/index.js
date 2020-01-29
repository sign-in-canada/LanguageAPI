module.exports = async function (context, req) {
    const host = req.headers.host;
    commonDomain = host.substring(host.indexOf('.'));

    if (req.method === "PUT" || req.method === "POST") {
        if (typeof req.body != "undefined"
            && "lang" in req.body
            && ["eng", "fra"].includes(req.body.lang)) {
            // Set the language
            context.res = {
                "status": (req.method === "PUT" ? 200 : 201),
                "headers": {
                    "Set-Cookie": `_gc_lang=${req.body.lang}; domain=${commonDomain}; path=/; secure; HttpOnly`,
                    "Content-Type": "application/json"
                },
                "body": `{\"lang\": \"${req.body.lang}\"}`
            }
        } else {
            context.res = {
                "status": 400, // Bad request
                "headers": {},
                "body": "Request must specify language as \"eng\" or \"fra\""
            }
        }
    } else if (req.method === "GET") {
        if (typeof req.headers != "undefined"
            && "cookie" in req.headers
            && (matches = req.headers.cookie.match("_gc_lang=(eng|fra)")) != null) {
            context.log(req.headers.cookie);
            context.res = {
                "status": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": `{\"lang\": \"${matches[1]}\"}`
            }
        } else {
            context.res = {
                "status": 404, // Not Found
                "headers": {},
                "body": "The language cookie is missing or invalid."
            }
        }
    }
    // Take care of CORS
        if ("origin" in req.headers
            && /(?:canada|gc)\.ca(?:\:\d+)?$/.test(req.headers.origin))  { // GC domains only
        context.res.headers["Access-Control-Allow-Credentials"] = "true";
        context.res.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, OPTIONS";
        context.res.headers["Access-Control-Allow-Origin"] = req.headers.origin;
        context.res.headers["Access-Control-Allow-Headers"] = "Host, Accept, Origin, Content-Type, Content-Length, X-Requested-With";
        context.res.headers["Access-Control-Max-Age"] = "0" /*"86400"*/;
    }
};