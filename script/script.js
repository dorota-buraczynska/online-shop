//nav
$('.nav__button').on('click', function (event) {
    var buttonActiveClass = 'nav__button--active';
    $(this).toggleClass(buttonActiveClass);
    $('.nav__menu').toggleClass('visible');
});

$('.nav__menu-item').on('click', function (event) {
    // event.preventDefault();
    var listItemActiveClass = 'nav__menu-item--active';
    $(this).siblings().removeClass(listItemActiveClass);
    $(this).addClass(listItemActiveClass);
});

//slider
var changeActiveDot = function (index) {
    $('.slider__dot')
        .eq(index)
        .addClass('slider__dot--active')
        .siblings().removeClass('slider__dot--active');
};

var changeActivePhoto = function (index) {
    $('.slider__slide')
        .eq(index)
        .addClass('slider__slide--active')
        .siblings().removeClass('slider__slide--active');
};

var getCurrentPhotoIndex = function () {
    return $('.slider__slide.slider__slide--active').index();
};

var onDotClick = function (event) {
    clearInterval(autoSlide);
    changeActiveDot($(this).index());
    changeActivePhoto($(this).index());
    currentIndex = getCurrentPhotoIndex();
    startSlideshow();
};

$('.slider__dot').on('click', onDotClick);

var autoSlide;
var currentIndex = 0;
var photos = $('.slider__slide');

var startSlideshow = function () {
    autoSlide = setInterval(function () {
        currentIndex++;
        if (currentIndex > photos.length - 1) {
            currentIndex = 0;
        }
        // console.log(currentIndex);
        changeActivePhoto(currentIndex);
        changeActiveDot(currentIndex);

    }, 5000);
};

startSlideshow();

//map
function initMap() {
    var position = {lat: 51.102075, lng: 17.049262};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: position,
        zoomControl: true,
        scaleControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true
    });
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
}

//shop by
$('.filter__title').on('click', function () {
    var visibleClass = 'filter__wrapper--visible';
    var buttonActiveClass = 'filter__title--active';
    $('.filter__wrapper').fadeToggle(visibleClass);
    $(this).toggleClass(buttonActiveClass);
});

//filter
var makeProductsArray = function (product) {
    var productColor = $(product).data('color');
    var productSize = $(product).data('size');
    var productFabric = $(product).data('fabric');

    return [productColor, productSize, productFabric];
};

var makeFilterArray = function () {
    var selected = [];
    $('.filter input:checked').each(function () {
        selected.push($(this).attr('name'));
    });

    return selected;
};

var filterByPrices = function () {
    $('.products__item').hide();
    $('.products__not-found').hide();

    var max = parseInt($('.filter__price-range input[name=max]').val());
    var min = parseInt($('.filter__price-range input[name=min]').val());

    $('.products__item').each(function () {
        var price = parseInt($(this).find('.products__price').text());

        if (price >= min &&
            price <= max) {
            $(this).show();
        }
        if ($('.products__item:visible').length === 0) {
            $('.products__not-found').show();
        }
    })
};

var filterProducts = function () {
    var filterArray = makeFilterArray();
    var productArray;

    if (filterArray.length === 0) {
        return;
    }

    $('.products__item:visible').each(function (i, e) {
        var newArray = [];
        productArray = makeProductsArray(this);

        for (var i = 0; i < productArray.length; i++) {
            for (var j = 0; j < filterArray.length; j++) {
                if (productArray[i] === filterArray[j]) {
                    newArray.push(productArray[i]);
                }
            }
        }

        if (newArray.length > 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    if ($('.products__item:visible').length === 0) {
        $('.products__not-found').show();
    }
};

$('.filter__button').on('click', function () {
    filterByPrices();
    filterProducts();
    scrollToProducts('.filter__wrapper');
});

$('.filter__reset-button').on('click', function () {
    $('input[type=checkbox]').each(function()
    {
        this.checked = false;
    });
    $('.filter__price-range input[name=max]').val(100);
    $('.products__item').show();
    $('.products__not-found').hide();
});

var scrollToProducts = function (element) {
    var $targertElement = $(element);
    var position = $targertElement.offset().top;
    var filterHeight = $('.filter__wrapper').height();

    $('html, body').animate({scrollTop: position + filterHeight}, 1500);
};

