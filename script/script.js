var app = {
    initPage: {}
};

var products;

var loadPageContent = function (href) {
    $.ajax({
        url: href
    }).done(function (response) {
        var $content = $(response).filter('div.container');
        $('div.container').html($content);
        if (href in app.initPage) {
            app.initPage[href]();
        }
    }).fail(function (error) {
        console.log(error);
    })
};