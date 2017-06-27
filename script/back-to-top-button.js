var toggleBackToTopButton = function () {
    var menuHeight = $('.nav').height();
    var documentPosition = $(window).scrollTop();
    if (documentPosition > menuHeight) {
        $('.back-to-top__button').show();
    } else {
        $('.back-to-top__button').hide();
    }
};

$('.back-to-top__button').on('click', function () {
    renderProducts(products);
    $('html, body').animate({scrollTop: 0}, 1500);
    $('.products__not-found').hide();
});
