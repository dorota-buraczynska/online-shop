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
    scrollToElement('.filter__wrapper');
});

$('.filter__reset-button').on('click', function () {
    $('input[type=checkbox]').each(function () {
        this.checked = false;
    });
    $('.filter__price-range input[name=max]').val(100);
    $('.products__item').show();
    $('.products__not-found').hide();
});

var scrollToElement = function (element) {
    var $targertElement = $(element);
    var position = $targertElement.offset().top;
    var filterHeight = $('.filter__wrapper').height();

    $('html, body').animate({scrollTop: position + filterHeight}, 1500);
};

// show only three products
$('.products__wrapper .products__item').slice(0, 3).show();

var showThreeProducts = function () {
    var items = $('.products__wrapper .products__item:hidden');
    var nextItems = items.slice(0, 3);

    if (nextItems.length < 3) {
        $('.products__button-next').hide();
        $('.products__button-top').show();
    }

    nextItems.show();
};

$('.products__button-next').on('click', function () {
    showThreeProducts();
});

//back to top
$('.products__button-top').on('click', function () {
    $('html, body').animate({scrollTop: 0}, 1500);
});

//add products to small basket, modal-box
$('.products__button').on('click', function () {
    var productIndex = $(this).closest('.products__item').index();
    console.log(cartArray.length + 1);
    $('.modal-box').show();
    addProductToCart(productIndex);
    $('.nav__basket-amount').text(cartArray.length);
});

$('.modal-box__shopping-button, .modal-box__close-button').on('click', function () {
    $('.modal-box').hide();
});

//preview
var fixPreviewPosition = function () {
    var contentHeight = $('.preview__content').height();
    var windowHeight = $(window).height();
    $('.preview__content').toggleClass('preview__content--large', contentHeight > windowHeight);
};

var showPreview = function (productIndex) {
    var photoSrc = $('.products__item').eq(productIndex).find('.products__photo').attr('src');
    var productFabric = $('.products__item').eq(productIndex).data('fabric');
    var productSize = $('.products__item').eq(productIndex).data('size');
    var productPrice = $('.products__item').eq(productIndex).data('price');
    var productTitle = $('.products__item').eq(productIndex).find('.products__title').text();
    var productDescription = $('.products__item').eq(productIndex).find('.products__description').text();
    var photoNumber = $('.products__item').eq(productIndex).index();

    $('.preview').show();
    $('.preview__photo-item').attr('src', photoSrc);

    $('.preview__product-fabric span').text(productFabric);
    $('.preview__product-size span').text(productSize);
    $('.preview__product-price span').text('$' + productPrice);
    $('.preview__product-title').text(productTitle);
    $('.preview__product-description-text').text(productDescription);
    $('.preview__content').data('product-number', photoNumber);
    $('.preview__content').data('price', productPrice);

    fixPreviewPosition();
};

$('.products__preview').on('click', function () {
    var productIndex = $(this).closest('.products__item').index();
    showPreview(productIndex);
});

$('.preview__next-button').on('click', function () {
    var productIndex = $(this).closest('.preview__content').data('product-number') + 1;
    if (productIndex === $('.products__item').length) {
        showPreview(0);
    } else {
        showPreview(productIndex);
    }
});

$('.preview__prev-button').on('click', function () {
    var productIndex = $(this).closest('.preview__content').data('product-number') - 1;
    showPreview(productIndex);
});

$('.preview__close-button, .preview__shopping-button').on('click', function () {
    $('.preview').hide();
});

$(window).on('resize', function () {
    fixPreviewPosition();
});

//cart
var cartArray = [];
var priceArray = [];

var addProductToCart = function (productIndex) {
    var product = {
        path: $('.products__item').eq(productIndex).find('.products__photo').attr('src'),
        price: $('.products__item').eq(productIndex).data('price'),
        size: $('.products__item').eq(productIndex).data('size'),
        index: $('.products__item').eq(productIndex).index()
    };
    cartArray.push(product);
    priceArray.push(product.price);
};


$('.nav__basket').on('click', function () {
    $('.shopping-list__wrapper .shopping-list__product-wrapper').remove();

    var buttonsWrapper = ('<div class="shopping-list__buttons-wrapper"><div class="shopping-list__plus-button">&#43;</div><div class="shopping-list__minus-button">&#45;</div></div>');
    var totalSum = 0;

    for (var i = 0; i < cartArray.length; i++) {
        var productPhoto = ('<img class="shopping-list__product-photo" src="' + cartArray[i].path + '">');
        var productAmount = ('<div class="shopping-list__product-amount">1 ' + buttonsWrapper + '</div>');
        var productPrice = ('<div class="shopping-list__product-price">$' + cartArray[i].price + '</div>');
        var productSize = ('<div class="shopping-list__product-size">'+ cartArray[i].size + '</div>');

        $('.shopping-list__wrapper')
            .prepend(' <div class="shopping-list__product-wrapper">'+ productPhoto + productSize + productAmount + productPrice +'</div>');
    }

    for (var i = 0; i < priceArray.length; i++) {
        totalSum += priceArray[i];
        $('.shopping-list__product-total-price span').text('$' + totalSum);
    }
});

$('.preview__basket-button').on('click', function () {
    var productIndex = $(this).closest('.preview__content').data('product-number');
    addProductToCart(productIndex);
    $('.nav__basket-amount').text(cartArray.length);
    $('.preview').hide();
    $('.modal-box').show();
    console.log(cartArray);
});


