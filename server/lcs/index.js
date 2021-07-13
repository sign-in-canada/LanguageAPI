module.exports = async function (context, req) {
    const host = req.headers.host;
    const commonDomain = host.substring(host.indexOf('.'));

    let target = req.query.return || req.headers.referer;
    let lang = req.query.lang;
    let idp;
    let clf = req.query.clf;

    if (! /^https:\/\/.*\.(id(\.alpha)?\.canada|id\.tbs-sct\.gc|catslab)\.ca\//.test(target)) {
        // Invalid Target
        context.res = {
            status: 400,
            body: null
        }
        return
    }

    context.res = {
        status: 302,
        body: null
    }

    if (lang && ["eng", "fra"].includes(lang)) {  // Set the cookie
        context.res.headers = {
            "Set-Cookie" : "_gc_lang=" + lang + "; domain=" + commonDomain + "; path=/; SameSite=None; secure; HttpOnly",
            "Location" : target
            }
    }
    else {  //Read the cookie
        context.log("Reading cookie")
        if (typeof req.headers != "undefined" && "cookie" in req.headers) {
            if ((matches = req.headers.cookie.match("_gc_lang=(eng|fra)")) != null) {
                lang = matches[1];
            }
            if ((matches = req.headers.cookie.match("_saml_idp=([^;/s]*)")) != null) {
                idp = matches[1];
            }

        target = target.replace(/-(eng|fra).jsp/, "-" + lang + ".jsp")
                + "?_gc_lang=" + lang + "&_saml_idp=" + idp

        context.res.headers = {
            "Location" : target
            }
        }
    }
}
