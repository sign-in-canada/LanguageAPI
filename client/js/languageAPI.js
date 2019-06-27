function getLanguage(callback) {
    $.ajax({
        url: 'https://server.fjgc-gccf.gc.ca/api/Prefs',
        type: 'GET',
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) { callback(data.lang) },
        error: function (jqXHR, textStatus, errorThrown) { console.log(errorThrown); callback(textStatus)}
    });
}

function setLanguage(language) {
    $.ajax({
        url: 'https://server.fjgc-gccf.gc.ca/api/Prefs',
        type: 'PUT',
        datatype: 'application/json',
        contentType: 'application/json',
        async: false,
        data: `{lang: \"${language}\"}`,
        xhrFields: {
            withCredentials: true
        }
    });
}