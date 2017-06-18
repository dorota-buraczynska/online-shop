$('.slider__items').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    focusOnSelect: true,
    autoplay: true,
    arrows: false,
    centerPadding: 0,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 1,
                dots: true
            }
        }
    ]
});