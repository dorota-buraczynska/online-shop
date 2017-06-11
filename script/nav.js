$('.nav__button').on('click', function (event) {
    var buttonActiveClass = 'nav__button--active';
    $(this).toggleClass(buttonActiveClass);
    $('.nav__menu').toggleClass('visible');
});

$('.nav__menu-item').on('click', function (event) {
    event.preventDefault();
    var listItemActiveClass = 'nav__menu-item--active';
    $(this).siblings().removeClass(listItemActiveClass);
    $(this).addClass(listItemActiveClass);
    var href = $('a', this).attr('href');
    $('.nav__menu').removeClass('visible');
    $('.nav__button').removeClass('nav__button--active');
    loadPageContent(href);
});

