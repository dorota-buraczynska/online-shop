var scrollToElement = function (element) {
    var $targetElement = $(element);
    var position = $targetElement.offset().top;
    $('html, body').animate({scrollTop: position}, 1500);
};

$(window).on('scroll', function () {
    toggleBackToTopButton();
    toggleFixedFilter();
    stopFilterBeforeFooter();
});

$(window).on('resize', function () {
    fixPreviewPosition();
    fixModalBoxPosition();
    setFilterMaxHeight();
    addHeightToContainerSidebar();
});