var scrollToElement = function (element) {
    var $targetElement = $(element);
    var position = $targetElement.offset().top;
    $('html, body').animate({scrollTop: position}, 1500);
};

$(window).on('scroll', function () {
    toggleBackToTopButton();
    if ($(window).width() > 920) {
        toggleFixedFilter();
        stopFilterBeforeFooter();
    }
});

$(window).on('resize', function () {
    fixPreviewPosition();
    fixModalBoxPosition();
    if ($(window).width() > 920) {
        setFilterMaxHeight();
        addHeightToContainerSidebar();
    }
});