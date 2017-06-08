var products;

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

$('.filter__reset-button').on('click', function () {
    $('input[type=checkbox]').each(function () {
        this.checked = false;
    });
    $('.filter__price-range input[name=max]').val(100);
    renderProducts(products);
});

var scrollToElement = function (element) {
    var $targetElement = $(element);
    var position = $targetElement.offset().top;
    var filterHeight = $('.filter__wrapper').height();

    $('html, body').animate({scrollTop: position + filterHeight}, 1500);
};

//back to top
$('.products__button-top').on('click', function () {
    $('html, body').animate({scrollTop: 0}, 1500);
});

//add products to small basket, modal-box
$('.products__wrapper').on('click', '.products__button', function () {
    var productIndex = $(this).closest('.products__item').index();
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

$('.products__wrapper').on('click', '.products__preview', function () {
    var productIndex = $(this).closest('.products__item').index();
    showPreview(productIndex);
    console.log('ok');
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
var indexArray = [];

var addProductToCart = function (productIndex) {
    var product = {
        path: $('.products__item').eq(productIndex).find('.products__photo').attr('src'),
        price: $('.products__item').eq(productIndex).data('price'),
        size: $('.products__item').eq(productIndex).data('size'),
        index: $('.products__item').eq(productIndex).index()
    };
    cartArray.push(product);
    priceArray.push(product.price);
    indexArray.push(product.index);
};


$('.nav__basket').on('click', function () {
    $('.shopping-list__wrapper .shopping-list__product-wrapper').remove();

    var buttonsWrapper = ('<div class="shopping-list__buttons-wrapper"><div class="shopping-list__plus-button">&#43;</div><div class="shopping-list__minus-button">&#45;</div></div>');
    var deleteButton = ('<button class="shopping-list__delete-button">delete</button>');
    var totalSum = 0;

    for (var i = 0; i < cartArray.length; i++) {
        var productPhoto = ('<img class="shopping-list__product-photo" src="' + cartArray[i].path + '">');
        var productAmount = ('<div class="shopping-list__product-amount">1 ' + buttonsWrapper + '</div>');
        var productPrice = ('<div class="shopping-list__product-price">$' + cartArray[i].price + ' </div>');
        var productSize = ('<div class="shopping-list__product-size">' + cartArray[i].size + '</div>');

        $('.shopping-list__wrapper')
            .prepend(' <div class="shopping-list__product-wrapper">' + productPhoto + productSize + productAmount + productPrice + deleteButton + '</div>');

    }

    for (var i = 0; i < priceArray.length; i++) {
        totalSum += priceArray[i];
        $('.shopping-list__product-total-price span').text('$' + totalSum);
    }

    //delete product from shopping list
    $('.shopping-list__delete-button').on('click', function () {
        var allPrice = $(this).closest('.shopping-list__product-wrapper').find('.shopping-list__product-price').text();
        var number = parseInt(allPrice.slice(1, 4));
        totalSum -= number;
        $('.shopping-list__product-total-price span').text('$' + totalSum);
        $(this).closest('.shopping-list__product-wrapper').remove();
    });


});


$('.preview__basket-button').on('click', function () {
    var productIndex = $(this).closest('.preview__content').data('product-number');
    addProductToCart(productIndex);
    $('.nav__basket-amount').text(cartArray.length);
    $('.preview').hide();
    $('.modal-box').show();

});

//create products
var url = 'http://localhost:3000';
var productsWrapper = $('.products__wrapper');

var renderProducts = function (products) {
    for (var i = 0; i < products.length; i++) {
        var productItem = $('<div>', {
            'class': 'products__item',
            'data-color': products[i].color,
            'data-size': products[i].size,
            'data-fabric': products[i].fabric,
            'data-price': products[i].price
        });
        var productImage = $('<img>', {
            'class': 'products__photo',
            'src': products[i].src,
            'alt': products[i].alt
        });
        var productTitle = $('<div>', {'class': 'products__title'}).text(products[i].title);
        var productInfo = $('<div>', {'class': 'products__info'});
        var productSizeLabel = $('<div>', {'class': 'products__size-label'}).text('size: ');
        var productSize = $('<span>', {'class': 'products__size'}).text(products[i].size);
        var productPriceLabel = $('<div>', {'class': 'products__price-label'}).text('price: ');
        var productPrice = $('<span>', {'class': 'products__price'}).text(products[i].price + '$');
        var productDescription = $('<div>', {'class': 'products__description'}).text(products[i].description);
        var productButton = $('<button class="products__button">add to cart</button>');
        var productPreviev = $('<div class="products__preview"><i class="fa fa-search" aria-hidden="true"></i></div>');

        productsWrapper.append(productItem);
        productItem
            .append(productImage)
            .append(productTitle)
            .append(productInfo)
            .append(productDescription)
            .append(productButton)
            .append(productPreviev);
        productInfo
            .append(productSizeLabel)
            .append(productPriceLabel);
        productSizeLabel.append(productSize);
        productPriceLabel.append(productPrice);
    }
};

var filteredProducts = function (products) {
    $('.products__wrapper').html('');
    var max = parseInt($('.filter__price-range input[name=max]').val());
    var min = parseInt($('.filter__price-range input[name=min]').val());

    var colorArray = makeColorArray();
    var sizeArray = makeSizeArray();
    var fabricsArray = makeFabricsArray();
    var filtered = products;
    filtered = filterByBlingPrices(filtered, min, max);
    filtered = filterByColors(filtered, colorArray);
    filtered = filterBySizes(filtered, sizeArray);
    filtered = filterByFabrics(filtered, fabricsArray);
    renderProducts(filtered);
};

var loadProducts = function () {
    $.ajax({
        url: url + '/products',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        products = response;
        renderProducts(products);
    }).fail(function (error) {
        console.log(error);
    })
};

loadProducts();

var filterByBlingPrices = function (products, min, max) {
    return products.filter(function (value) {
        return value.price >= min && value.price <= max;
    });
};

var filterByColors = function (products, colorArray) {
    if (colorArray.length === 0) {
        return products;
    }
    return products.filter(function (value) {
        for (var i = 0; i < colorArray.length; i++) {
            if (value.color === colorArray[i]) {
                return true;
            }
        }
    });
};

var filterBySizes = function (products, sizeArray) {
    if (sizeArray.length > 0) {
        return products.filter(function (value) {
            for (var i = 0; i < sizeArray.length; i++) {
                if (value.size === sizeArray[i]) {
                    return true;
                }
            }
        });
    } else {
        return products;
    }
};

var filterByFabrics = function (products, fabricArray) {
    if (fabricArray.length > 0) {
        return products.filter(function (value) {
            for (var i = 0; i < fabricArray.length; i++) {
                if (value.fabric === fabricArray[i]) {
                    return true;
                }
            }
        });
    } else {
        return products;
    }
};
//filter arrays
var makeColorArray = function () {
    var selectedColors = [];
    $('.colors input:checked').each(function () {
        selectedColors.push($(this).attr('name'));
    });

    return selectedColors;
};

var makeSizeArray = function () {
    var selectedSizes = [];
    $('.sizes input:checked').each(function () {
        selectedSizes.push($(this).attr('name'));
    });

    return selectedSizes;
};

var makeFabricsArray = function () {
    var selectedFabrics = [];
    $('.fabrics input:checked').each(function () {
        selectedFabrics.push($(this).attr('name'));
    });

    return selectedFabrics;
};

$('.filter__button').on('click', function () {
    filteredProducts(products);
    scrollToElement('.filter__wrapper');
});
