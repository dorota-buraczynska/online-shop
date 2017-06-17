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
});

var renderEntries = function (entries) {
    var blogWrapper = $('.blog__wrapper');
    blogWrapper.empty();
    for (var i = 0; i < entries.length; i++) {
        var entry = $('<div>', {
            'class': 'blog__entry',
            'data-id': entries[i].id
        });
        var entryPhoto = $('<img>', {
            'class': "blog__entry-photo",
            'src': entries[i].img_src
        });
        var entriesWrapper = $('<div>', {
            'class': 'blog__entry-wrapper'
        });
        var entryTitle = $('<div>', {'class': 'blog__entry-title'}).text(entries[i].title);
        var entryText = $('<div>', {'class': 'blog__entry-text'}).text(entries[i].text);
        var entryDate = $('<div>', {'class': 'blog__entry-date'}).text(entries[i].date);
        var entryButton = $('<button>', {'class': 'blog__button'}).text('read more');

        blogWrapper.append(entry);
        entry
            .append(entryPhoto)
            .append(entriesWrapper);
        entriesWrapper
            .append(entryTitle)
            .append(entryDate)
            .append(entryText)
            .append(entryButton);
    }

    var entriesOnPage = $('.blog__wrapper .blog__entry');
    entriesOnPage.hide();
    entriesOnPage.slice(0, 3).show();
    $('.products__button-next').show();
};

var loadEntries = function () {
    $.ajax({
        url: 'db/entries.json',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        renderEntries(response.entries);
    }).fail(function (error) {
        console.log(error);
    })
};

loadEntries();

$('.blog__button-next').on('click', function () {
    showNextProducts('.blog__wrapper .blog__entry:hidden');
});

var cartArray = readCookie('cart') || [];

// cookies
function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        try {
            if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
        } catch (error) {
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

var addProductToCart = function (productId) {
    var product = {
        path: products[productId].src,
        price: products[productId].price,
        size: products[productId].size,
        id: products[productId].id,
        amount: 1
    };

    // if (cartArray.length === 0) {
    //     cartArray.push(product);
    //     createCookie('cart', cartArray, 365);
    // }
    // for (var i = 0; i < cartArray.length; i++) {
    //     var newArray = [];
    //     if (cartArray[i].id === productId) {
    //         newArray.push(cartArray[i]);
    //     }
    //     console.log(newArray);
    //     if (newArray.length === 0) {
    //         console.log(newArray);
    //
    //         cartArray.push(product);
    //         createCookie('cart', cartArray, 365);
    //     }
    //
    // }
    cartArray.push(product);
    createCookie('cart', cartArray, 365);

};

var renderCart = function () {
    var buttonsWrapper = ('<div class="shopping-list__buttons-wrapper"><div class="shopping-list__plus-button">&#43;</div><div class="shopping-list__minus-button">&#45;</div></div>');
    var deleteButton = ('<button class="shopping-list__delete-button">delete</button>');

    for (var i = 0; i < cartArray.length; i++) {
        var productPhoto = ('<img class="shopping-list__product-photo" src="' + cartArray[i].path + '">');
        var productAmount = ('<div class="shopping-list__product-amount">' + cartArray[i].amount + buttonsWrapper + '</div>');
        var productPrice = ('<div class="shopping-list__product-price">$' + cartArray[i].price + ' </div>');
        var productSize = ('<div class="shopping-list__product-size">' + cartArray[i].size + '</div>');

        $('.shopping-list__wrapper')
            .prepend(' <div class="shopping-list__product-wrapper" data-id=' + cartArray[i].id + '>' + productPhoto + productSize + productAmount + productPrice + deleteButton + '</div>');

    }
};

var totalSum = function () {
    var deliveryPrice = parseInt($('.shopping-list__delivery-price').text());
    var totalSum = 0;
    for (var i = 0; i < cartArray.length; i++) {
        totalSum += parseInt(cartArray[i].price);
    }
    if (cartArray.length === 0) {
        deliveryPrice = 0;
    }
    return '$' + (totalSum + deliveryPrice);
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var deleteProductFromBasket = function (productId) {
    for (var i = 0; i < cartArray.length; i++) {

        if (cartArray[i].id === productId) {
            var index = cartArray.indexOf(cartArray[i]);
            console.log(index);
            cartArray.remove(index);
        }

    }
    $('.shopping-list__product-wrapper').empty();
    renderCart();
    console.log(cartArray);
    createCookie('cart', cartArray, 365);
    $('.shopping-list__product-total-price span').text(totalSum());
    $('.nav__basket-amount').text(cartArray.length);

    if (cartArray.length === 0) {
        $('.shopping-list__empty-basket').show();
        $('.shopping-list__buy-button-link').on('click', function (event) {
            event.preventDefault();
        });
    }
};

if ($('.shopping-list').length !== 0) {
    renderCart();
}

if (cartArray.length === 0) {
    $('.shopping-list__empty-basket').show();
    $('.shopping-list__buy-button-link').on('click', function (event) {
        event.preventDefault();
    });
}

$('.shopping-list__wrapper').on('click', '.shopping-list__delete-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    deleteProductFromBasket(productId);
});

$('.shopping-list__product-total-price span').text(totalSum());
$('.nav__basket-amount').text(cartArray.length);


//add products to cart
$('.products__wrapper').on('click', '.products__button', function () {
    var productId = $(this).closest('.products__item').index();
    $('.modal-box').show();
    addProductToCart(productId);
    $('.nav__basket-amount').text(cartArray.length);
});


var validateForm = function () {
    var isValid = true;

    var emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var postalCodeRe = /[0-9]{2}\-[0-9]{3}/;
    var phoneNrRe = /[0-9]$/;

    var $email = $('.form input[type=email]');
    var $postalCode = $('.form input[name=postal-code]');
    var $phoneNumber = $('.form input[name=phone-number]');

    var isEmail = emailRe.test($email.val());
    var isPostalCode = postalCodeRe.test($postalCode.val());
    var isPhoneNr = phoneNrRe.test($phoneNumber.val());

    $('.form input').each(function () {
        if ($(this).val() == '') {
            isValid = false;
            $(this).addClass('form__input--error');
        } else {
            $(this).removeClass('form__input--error');
        }
    });
    $email.each(function () {
        if (!isEmail) {
            $(this).addClass('form__input--error');
        } else {
            $(this).removeClass('form__input--error');
        }
    });
    $postalCode.each(function () {
        if (!isPostalCode) {
            $(this).addClass('form__input--error');
        } else {
            $(this).removeClass('form__input--error');
        }
    });
    $phoneNumber.each(function () {
        if (!isPhoneNr || $phoneNumber.val().length < 9) {
            $(this).addClass('form__input--error');
            isValid = false;
        } else {
            $(this).removeClass('form__input--error');
        }
    });
    if (isValid && isEmail && isPostalCode && isPhoneNr) {
        $('.address-data').hide();
        completeShippingAddress();
        $('.cart-wrapper').show();
    }
};

//read in a form's data and convert it to a key:value object
function getFormData(form) {
    var out = {};
    var data = $(form).serializeArray();
    //transform into simple data/value object
    for (var i = 0; i < data.length; i++) {
        var record = data[i];
        out[record.name] = record.value;
    }
    return out;
}

$('.address-data__buy-button').on('click', function (event) {
    validateForm();
    $('.shopping-list__product-total-price span').text(totalSum());
    scrollToElement('.shopping-list');
});

$('.address-data__form').on('submit', function (event) {
    event.preventDefault();
    fixModalBoxPosition();
    $('.modal-box--form').show();
    var formData = getFormData('#address-data');
    console.log(formData);
});
var toggleFixedFilter = function () {
    var $filter = $('.filter');

    if (!$filter.length) {
        return;
    }

    var documentPosition = $(window).scrollTop();
    var filterOffset = $filter.parent().offset().top;
    if (documentPosition >= filterOffset) {
        $filter.addClass('filter--fixed');
    } else {
        $filter.removeClass('filter--fixed');
    }
};

var setFilterMaxHeight = function () {
    if ($('.filter').height() > $(window).height()) {
        $('.filter').css('max-height', $(window).height())
    } else {
        $('.filter').css('max-height', '');
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

//filter products
var filterByBlingPrices = function (products, min, max) {
    console.log(products);
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
    if (sizeArray.length === 0) {
        return products;
    }
    return products.filter(function (value) {
        for (var i = 0; i < sizeArray.length; i++) {
            if (value.size === sizeArray[i]) {
                return true;
            }
        }
    });
};

var filterByFabrics = function (products, fabricArray) {
    if (fabricArray.length === 0) {
        return products;
    }
    return products.filter(function (value) {
        for (var i = 0; i < fabricArray.length; i++) {
            if (value.fabric === fabricArray[i]) {
                return true;
            }
        }
    });
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
    scrollToElement('.products__wrapper');
});

setFilterMaxHeight();

$('.filter__title-button').on('click', function () {
    var visibleClass = 'filter__wrapper--visible';
    var buttonActiveClass = 'filter__title--active';
    $('.filter__wrapper').fadeToggle(visibleClass);
    $(this).toggleClass(buttonActiveClass);
});

$('.filter__reset-button').on('click', function () {
    renderProducts(products);
    $('input[type=checkbox]').each(function () {
        this.checked = false;
    });
    $('.filter__price-range input[name=max]').val(100);
});

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

var fixModalBoxPosition = function () {
    var contentHeight = $('.modal-box__content').height();
    var windowHeight = $(window).height();
    $('.modal-box__content').toggleClass('modal-box__content--large', contentHeight > windowHeight);
};

$('.modal-box__shopping-button, .modal-box__close-button').on('click', function () {
    $('.modal-box').hide();
});

$('.nav__button').on('click', function (event) {
    var buttonActiveClass = 'nav__button--active';
    $(this).toggleClass(buttonActiveClass);
    $('.nav__menu').toggleClass('visible');
});
var fixPreviewPosition = function () {
    var contentHeight = $('.preview__content').height();
    var windowHeight = $(window).height();
    $('.preview__content').toggleClass('preview__content--large', contentHeight > windowHeight);
};

var showPreview = function (productId) {
    var photoSrc = products[productId].src;
    var productFabric = products[productId].fabric;
    var productSize = products[productId].size;
    var productPrice = products[productId].price;
    var productTitle = products[productId].title;
    var productDescription = products[productId].description;

    $('.preview').show();
    $('.preview__photo-item').attr('src', photoSrc);
    $('.preview__product-fabric span').text(productFabric);
    $('.preview__product-size span').text(productSize);
    $('.preview__product-price span').text('$' + productPrice);
    $('.preview__product-title').text(productTitle);
    $('.preview__product-description-text').text(productDescription);
    $('.preview__content').data('id', products[productId].id);
    $('.preview__content').data('price', productPrice);

    fixPreviewPosition();
};

$('.products__wrapper').on('click', '.products__preview', function () {
    var productId = $(this).closest('.products__item').index();
    showPreview(productId);
});

$('.preview__next-button').on('click', function () {
    var productId = $(this).closest('.preview__content').data('id') + 1;
    if (productId === products.length) {
        showPreview(0);
    } else {
        showPreview(productId);
    }
});

$('.preview__prev-button').on('click', function () {
    var productId = $(this).closest('.preview__content').data('id') - 1;
    if (productId === -1) {
        showPreview(products.length - 1);
    } else {
        showPreview(productId);
    }
});

$('.preview__close-button, .preview__shopping-button').on('click', function () {
    $('.preview').hide();
});

$('.preview__basket-button').on('click', function () {
    var productId = $(this).closest('.preview__content').data('id');
    addProductToCart(productId);
    $('.nav__basket-amount').text(cartArray.length);
    $('.preview').hide();
    $('.modal-box').show();
});
var products;
var productsWrapper = $('.products__wrapper');

var renderProducts = function (products) {
    productsWrapper.html('');
    for (var i = 0; i < products.length; i++) {
        var productItem = $('<div>', {
            'class': 'products__item',
            'data-color': products[i].color,
            'data-size': products[i].size,
            'data-fabric': products[i].fabric,
            'data-price': products[i].price
        });
        var productImage = $('<div>', {
            'class': 'products__photo',
            'style': 'background-image: url(' + products[i].src + ')'
        });
        var productTitle = $('<div>', {'class': 'products__title'}).text(products[i].title);
        var productInfo = $('<div>', {'class': 'products__info'});
        var productSizeLabel = $('<div>', {'class': 'products__size-label'}).text('size: ');
        var productSize = $('<span>', {'class': 'products__size'}).text(products[i].size);
        var productPriceLabel = $('<div>', {'class': 'products__price-label'}).text('price: ');
        var productPrice = $('<span>', {'class': 'products__price'}).text('$' + products[i].price);
        var productDescription = $('<div>', {'class': 'products__description'}).text(products[i].description);
        var productButton = $('<button class="products__button">add to cart</button>');
        var productPreview = $('<div class="products__preview"><i class="fa fa-search" aria-hidden="true"></i></div>');

        productsWrapper.append(productItem);
        productItem
            .append(productImage)
            .append(productTitle)
            .append(productInfo)
            .append(productDescription)
            .append(productButton)
            .append(productPreview);
        productInfo
            .append(productSizeLabel)
            .append(productPriceLabel);
        productSizeLabel.append(productSize);
        productPriceLabel.append(productPrice);
    }

    var productsOnPage = $('.products__wrapper .products__item');
    productsOnPage.hide();
    productsOnPage.slice(0, 4).show();
    if (productsOnPage.length > 4) {
        $('.products__button-next').show();
    } else {
        $('.products__button-next').hide();
    }
};

var loadProducts = function () {
    $.ajax({
        url: 'db/products.json',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        products = response.products;
        renderProducts(products);
    }).fail(function (error) {
        console.log(error);
    })
};

//show next products
var showNextProducts = function (element) {
    var items = $(element);
    var nextItems = items.slice(0, 4);

    if (nextItems.length < 4) {
        $('.products__button-next').hide();
        $('.blog__button-next').hide();
    }

    nextItems.show();
};

loadProducts();

$('.products__button-next').on('click', function () {
    showNextProducts('.products__wrapper .products__item:hidden');
});
var scrollToElement = function (element) {
    var $targetElement = $(element);
    var position = $targetElement.offset().top;
    $('html, body').animate({scrollTop: position}, 1500);
};

$(window).on('scroll', function () {
    toggleBackToTopButton();
    toggleFixedFilter();
});

$(window).on('resize', function () {
    fixPreviewPosition();
    fixModalBoxPosition();
    setFilterMaxHeight();
});
var completeShippingAddress = function () {
    var title = $('.form select').val();
    var firstName = $('.form input[name=first-name]').val();
    var lastName = $('.form input[name=last-name]').val();
    var street = $('.form input[name=street]').val();
    var homeNr = $('.form input[name=home-number]').val();
    var flatNr = $('.form input[name=flat-number]').val();
    var postalCode = $('.form input[name=postal-code]').val();
    var city = $('.form input[name=city]').val();
    var country = $('.form input[name=country]').val();
    var phone = $('.form input[name=phone-number]').val();
    var email = $('.form input[name=email]').val();

    $('.shipping-address__name').text(title + ' ' + firstName + ' ' + lastName);
    $('.shipping-address__street').text(street + ' ' + homeNr + ' ' + flatNr);
    $('.shipping-address__postal-code').text(postalCode);
    $('.shipping-address__city').text(city);
    $('.shipping-address__country').text(country);
    $('.shipping-address__phone').text(phone);
    $('.shipping-address__email').text(email);
};

$('.shipping-address__edit-button').on('click', function () {
    $('.address-data').show();
    $('.address-data__go-back-button').hide();
    $('.cart-wrapper').hide();
    scrollToElement('.address-data');
});

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

$('.slider__dot').on('click', onDotClick);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0b2dnbGVCYWNrVG9Ub3BCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbnVIZWlnaHQgPSAkKCcubmF2JykuaGVpZ2h0KCk7XG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPiBtZW51SGVpZ2h0KSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuaGlkZSgpO1xuICAgIH1cbn07XG5cbiQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSwgMTUwMCk7XG59KTtcbiIsInZhciByZW5kZXJFbnRyaWVzID0gZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICB2YXIgYmxvZ1dyYXBwZXIgPSAkKCcuYmxvZ19fd3JhcHBlcicpO1xuICAgIGJsb2dXcmFwcGVyLmVtcHR5KCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5JyxcbiAgICAgICAgICAgICdkYXRhLWlkJzogZW50cmllc1tpXS5pZFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5UGhvdG8gPSAkKCc8aW1nPicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6IFwiYmxvZ19fZW50cnktcGhvdG9cIixcbiAgICAgICAgICAgICdzcmMnOiBlbnRyaWVzW2ldLmltZ19zcmNcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyaWVzV3JhcHBlciA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXdyYXBwZXInXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cnlUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10aXRsZSd9KS50ZXh0KGVudHJpZXNbaV0udGl0bGUpO1xuICAgICAgICB2YXIgZW50cnlUZXh0ID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXRleHQnfSkudGV4dChlbnRyaWVzW2ldLnRleHQpO1xuICAgICAgICB2YXIgZW50cnlEYXRlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LWRhdGUnfSkudGV4dChlbnRyaWVzW2ldLmRhdGUpO1xuICAgICAgICB2YXIgZW50cnlCdXR0b24gPSAkKCc8YnV0dG9uPicsIHsnY2xhc3MnOiAnYmxvZ19fYnV0dG9uJ30pLnRleHQoJ3JlYWQgbW9yZScpO1xuXG4gICAgICAgIGJsb2dXcmFwcGVyLmFwcGVuZChlbnRyeSk7XG4gICAgICAgIGVudHJ5XG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5UGhvdG8pXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJpZXNXcmFwcGVyKTtcbiAgICAgICAgZW50cmllc1dyYXBwZXJcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUaXRsZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlEYXRlKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVRleHQpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5QnV0dG9uKTtcbiAgICB9XG5cbiAgICB2YXIgZW50cmllc09uUGFnZSA9ICQoJy5ibG9nX193cmFwcGVyIC5ibG9nX19lbnRyeScpO1xuICAgIGVudHJpZXNPblBhZ2UuaGlkZSgpO1xuICAgIGVudHJpZXNPblBhZ2Uuc2xpY2UoMCwgMykuc2hvdygpO1xuICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG59O1xuXG52YXIgbG9hZEVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnZGIvZW50cmllcy5qc29uJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJlbmRlckVudHJpZXMocmVzcG9uc2UuZW50cmllcyk7XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG59O1xuXG5sb2FkRW50cmllcygpO1xuXG4kKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2hvd05leHRQcm9kdWN0cygnLmJsb2dfX3dyYXBwZXIgLmJsb2dfX2VudHJ5OmhpZGRlbicpO1xufSk7XG4iLCJ2YXIgY2FydEFycmF5ID0gcmVhZENvb2tpZSgnY2FydCcpIHx8IFtdO1xuXG4vLyBjb29raWVzXG5mdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbiAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKGRheXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xufVxuXG5mdW5jdGlvbiByZWFkQ29va2llKG5hbWUpIHtcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PSAwKSByZXR1cm4gSlNPTi5wYXJzZShjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG4gICAgY3JlYXRlQ29va2llKG5hbWUsIFwiXCIsIC0xKTtcbn1cblxudmFyIGFkZFByb2R1Y3RUb0NhcnQgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgdmFyIHByb2R1Y3QgPSB7XG4gICAgICAgIHBhdGg6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjLFxuICAgICAgICBwcmljZTogcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZSxcbiAgICAgICAgc2l6ZTogcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplLFxuICAgICAgICBpZDogcHJvZHVjdHNbcHJvZHVjdElkXS5pZCxcbiAgICAgICAgYW1vdW50OiAxXG4gICAgfTtcblxuICAgIC8vIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgIGNhcnRBcnJheS5wdXNoKHByb2R1Y3QpO1xuICAgIC8vICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG4gICAgLy8gfVxuICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgIHZhciBuZXdBcnJheSA9IFtdO1xuICAgIC8vICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAvLyAgICAgICAgIG5ld0FycmF5LnB1c2goY2FydEFycmF5W2ldKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBjb25zb2xlLmxvZyhuZXdBcnJheSk7XG4gICAgLy8gICAgIGlmIChuZXdBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKG5ld0FycmF5KTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgY2FydEFycmF5LnB1c2gocHJvZHVjdCk7XG4gICAgLy8gICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vIH1cbiAgICBjYXJ0QXJyYXkucHVzaChwcm9kdWN0KTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG5cbn07XG5cbnZhciByZW5kZXJDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25zV3JhcHBlciA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2J1dHRvbnMtd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wbHVzLWJ1dHRvblwiPiYjNDM7PC9kaXY+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvblwiPiYjNDU7PC9kaXY+PC9kaXY+Jyk7XG4gICAgdmFyIGRlbGV0ZUJ1dHRvbiA9ICgnPGJ1dHRvbiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2RlbGV0ZS1idXR0b25cIj5kZWxldGU8L2J1dHRvbj4nKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9kdWN0UGhvdG8gPSAoJzxpbWcgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXBob3RvXCIgc3JjPVwiJyArIGNhcnRBcnJheVtpXS5wYXRoICsgJ1wiPicpO1xuICAgICAgICB2YXIgcHJvZHVjdEFtb3VudCA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtYW1vdW50XCI+JyArIGNhcnRBcnJheVtpXS5hbW91bnQgKyBidXR0b25zV3JhcHBlciArICc8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcHJpY2VcIj4kJyArIGNhcnRBcnJheVtpXS5wcmljZSArICcgPC9kaXY+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtc2l6ZVwiPicgKyBjYXJ0QXJyYXlbaV0uc2l6ZSArICc8L2Rpdj4nKTtcblxuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpXG4gICAgICAgICAgICAucHJlcGVuZCgnIDxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXJcIiBkYXRhLWlkPScgKyBjYXJ0QXJyYXlbaV0uaWQgKyAnPicgKyBwcm9kdWN0UGhvdG8gKyBwcm9kdWN0U2l6ZSArIHByb2R1Y3RBbW91bnQgKyBwcm9kdWN0UHJpY2UgKyBkZWxldGVCdXR0b24gKyAnPC9kaXY+Jyk7XG5cbiAgICB9XG59O1xuXG52YXIgdG90YWxTdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbGl2ZXJ5UHJpY2UgPSBwYXJzZUludCgkKCcuc2hvcHBpbmctbGlzdF9fZGVsaXZlcnktcHJpY2UnKS50ZXh0KCkpO1xuICAgIHZhciB0b3RhbFN1bSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG90YWxTdW0gKz0gcGFyc2VJbnQoY2FydEFycmF5W2ldLnByaWNlKTtcbiAgICB9XG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsaXZlcnlQcmljZSA9IDA7XG4gICAgfVxuICAgIHJldHVybiAnJCcgKyAodG90YWxTdW0gKyBkZWxpdmVyeVByaWNlKTtcbn07XG5cbi8vIEFycmF5IFJlbW92ZSAtIEJ5IEpvaG4gUmVzaWcgKE1JVCBMaWNlbnNlZClcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbnZhciBkZWxldGVQcm9kdWN0RnJvbUJhc2tldCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FydEFycmF5LmluZGV4T2YoY2FydEFycmF5W2ldKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcbiAgICAgICAgICAgIGNhcnRBcnJheS5yZW1vdmUoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpLmVtcHR5KCk7XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGNvbnNvbGUubG9nKGNhcnRBcnJheSk7XG4gICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuXG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX2VtcHR5LWJhc2tldCcpLnNob3coKTtcbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX2J1eS1idXR0b24tbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuaWYgKCQoJy5zaG9wcGluZy1saXN0JykubGVuZ3RoICE9PSAwKSB7XG4gICAgcmVuZGVyQ2FydCgpO1xufVxuXG5pZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX2J1eS1idXR0b24tbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xufVxuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG5cblxuLy9hZGQgcHJvZHVjdHMgdG8gY2FydFxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpLmluZGV4KCk7XG4gICAgJCgnLm1vZGFsLWJveCcpLnNob3coKTtcbiAgICBhZGRQcm9kdWN0VG9DYXJ0KHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG59KTtcblxuIiwidmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG5cbiAgICB2YXIgZW1haWxSZSA9IC9eW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOS1dKyg/OlxcLlthLXpBLVowLTktXSspKiQvO1xuICAgIHZhciBwb3N0YWxDb2RlUmUgPSAvWzAtOV17Mn1cXC1bMC05XXszfS87XG4gICAgdmFyIHBob25lTnJSZSA9IC9bMC05XSQvO1xuXG4gICAgdmFyICRlbWFpbCA9ICQoJy5mb3JtIGlucHV0W3R5cGU9ZW1haWxdJyk7XG4gICAgdmFyICRwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKTtcbiAgICB2YXIgJHBob25lTnVtYmVyID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1waG9uZS1udW1iZXJdJyk7XG5cbiAgICB2YXIgaXNFbWFpbCA9IGVtYWlsUmUudGVzdCgkZW1haWwudmFsKCkpO1xuICAgIHZhciBpc1Bvc3RhbENvZGUgPSBwb3N0YWxDb2RlUmUudGVzdCgkcG9zdGFsQ29kZS52YWwoKSk7XG4gICAgdmFyIGlzUGhvbmVOciA9IHBob25lTnJSZS50ZXN0KCRwaG9uZU51bWJlci52YWwoKSk7XG5cbiAgICAkKCcuZm9ybSBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnJykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRlbWFpbC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc0VtYWlsKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBvc3RhbENvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQb3N0YWxDb2RlKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBob25lTnVtYmVyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUGhvbmVOciB8fCAkcGhvbmVOdW1iZXIudmFsKCkubGVuZ3RoIDwgOSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChpc1ZhbGlkICYmIGlzRW1haWwgJiYgaXNQb3N0YWxDb2RlICYmIGlzUGhvbmVOcikge1xuICAgICAgICAkKCcuYWRkcmVzcy1kYXRhJykuaGlkZSgpO1xuICAgICAgICBjb21wbGV0ZVNoaXBwaW5nQWRkcmVzcygpO1xuICAgICAgICAkKCcuY2FydC13cmFwcGVyJykuc2hvdygpO1xuICAgIH1cbn07XG5cbi8vcmVhZCBpbiBhIGZvcm0ncyBkYXRhIGFuZCBjb252ZXJ0IGl0IHRvIGEga2V5OnZhbHVlIG9iamVjdFxuZnVuY3Rpb24gZ2V0Rm9ybURhdGEoZm9ybSkge1xuICAgIHZhciBvdXQgPSB7fTtcbiAgICB2YXIgZGF0YSA9ICQoZm9ybSkuc2VyaWFsaXplQXJyYXkoKTtcbiAgICAvL3RyYW5zZm9ybSBpbnRvIHNpbXBsZSBkYXRhL3ZhbHVlIG9iamVjdFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmVjb3JkID0gZGF0YVtpXTtcbiAgICAgICAgb3V0W3JlY29yZC5uYW1lXSA9IHJlY29yZC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuJCgnLmFkZHJlc3MtZGF0YV9fYnV5LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhbGlkYXRlRm9ybSgpO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgnLnNob3BwaW5nLWxpc3QnKTtcbn0pO1xuXG4kKCcuYWRkcmVzcy1kYXRhX19mb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgICQoJy5tb2RhbC1ib3gtLWZvcm0nKS5zaG93KCk7XG4gICAgdmFyIGZvcm1EYXRhID0gZ2V0Rm9ybURhdGEoJyNhZGRyZXNzLWRhdGEnKTtcbiAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG59KTsiLCJ2YXIgdG9nZ2xlRml4ZWRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRmaWx0ZXIgPSAkKCcuZmlsdGVyJyk7XG5cbiAgICBpZiAoISRmaWx0ZXIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZG9jdW1lbnRQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgZmlsdGVyT2Zmc2V0ID0gJGZpbHRlci5wYXJlbnQoKS5vZmZzZXQoKS50b3A7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPj0gZmlsdGVyT2Zmc2V0KSB7XG4gICAgICAgICRmaWx0ZXIuYWRkQ2xhc3MoJ2ZpbHRlci0tZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkZmlsdGVyLnJlbW92ZUNsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfVxufTtcblxudmFyIHNldEZpbHRlck1heEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCgnLmZpbHRlcicpLmhlaWdodCgpID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAkKHdpbmRvdykuaGVpZ2h0KCkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmZpbHRlcicpLmNzcygnbWF4LWhlaWdodCcsICcnKTtcbiAgICB9XG59O1xuXG52YXIgZmlsdGVyZWRQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuICAgICQoJy5wcm9kdWN0c19fd3JhcHBlcicpLmh0bWwoJycpO1xuICAgIHZhciBtYXggPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoKSk7XG4gICAgdmFyIG1pbiA9IHBhcnNlSW50KCQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWluXScpLnZhbCgpKTtcblxuICAgIHZhciBjb2xvckFycmF5ID0gbWFrZUNvbG9yQXJyYXkoKTtcbiAgICB2YXIgc2l6ZUFycmF5ID0gbWFrZVNpemVBcnJheSgpO1xuICAgIHZhciBmYWJyaWNzQXJyYXkgPSBtYWtlRmFicmljc0FycmF5KCk7XG4gICAgdmFyIGZpbHRlcmVkID0gcHJvZHVjdHM7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUJsaW5nUHJpY2VzKGZpbHRlcmVkLCBtaW4sIG1heCk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUNvbG9ycyhmaWx0ZXJlZCwgY29sb3JBcnJheSk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeVNpemVzKGZpbHRlcmVkLCBzaXplQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlGYWJyaWNzKGZpbHRlcmVkLCBmYWJyaWNzQXJyYXkpO1xuICAgIHJlbmRlclByb2R1Y3RzKGZpbHRlcmVkKTtcbn07XG5cbi8vZmlsdGVyIHByb2R1Y3RzXG52YXIgZmlsdGVyQnlCbGluZ1ByaWNlcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgbWluLCBtYXgpIHtcbiAgICBjb25zb2xlLmxvZyhwcm9kdWN0cyk7XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnByaWNlID49IG1pbiAmJiB2YWx1ZS5wcmljZSA8PSBtYXg7XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlDb2xvcnMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIGNvbG9yQXJyYXkpIHtcbiAgICBpZiAoY29sb3JBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jb2xvciA9PT0gY29sb3JBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlTaXplcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgc2l6ZUFycmF5KSB7XG4gICAgaWYgKHNpemVBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLnNpemUgPT09IHNpemVBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlGYWJyaWNzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBmYWJyaWNBcnJheSkge1xuICAgIGlmIChmYWJyaWNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhYnJpY0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuZmFicmljID09PSBmYWJyaWNBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cbi8vZmlsdGVyIGFycmF5c1xudmFyIG1ha2VDb2xvckFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZENvbG9ycyA9IFtdO1xuICAgICQoJy5jb2xvcnMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZENvbG9ycy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZENvbG9ycztcbn07XG5cbnZhciBtYWtlU2l6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZFNpemVzID0gW107XG4gICAgJCgnLnNpemVzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRTaXplcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZFNpemVzO1xufTtcblxudmFyIG1ha2VGYWJyaWNzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmFicmljcyA9IFtdO1xuICAgICQoJy5mYWJyaWNzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRGYWJyaWNzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkRmFicmljcztcbn07XG5cbiQoJy5maWx0ZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWx0ZXJlZFByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xufSk7XG5cbnNldEZpbHRlck1heEhlaWdodCgpO1xuXG4kKCcuZmlsdGVyX190aXRsZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpc2libGVDbGFzcyA9ICdmaWx0ZXJfX3dyYXBwZXItLXZpc2libGUnO1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICdmaWx0ZXJfX3RpdGxlLS1hY3RpdmUnO1xuICAgICQoJy5maWx0ZXJfX3dyYXBwZXInKS5mYWRlVG9nZ2xlKHZpc2libGVDbGFzcyk7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG59KTtcblxuJCgnLmZpbHRlcl9fcmVzZXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICAkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoMTAwKTtcbn0pO1xuIiwiZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB7bGF0OiA1MS4xMDIwNzUsIGxuZzogMTcuMDQ5MjYyfTtcbiAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgem9vbTogMTUsXG4gICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBtYXBUeXBlQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IHRydWUsXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiB0cnVlXG4gICAgfSk7XG4gICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgIG1hcDogbWFwXG4gICAgfSk7XG59XG4iLCJ2YXIgZml4TW9kYWxCb3hQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGVudEhlaWdodCA9ICQoJy5tb2RhbC1ib3hfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5tb2RhbC1ib3hfX2NvbnRlbnQnKS50b2dnbGVDbGFzcygnbW9kYWwtYm94X19jb250ZW50LS1sYXJnZScsIGNvbnRlbnRIZWlnaHQgPiB3aW5kb3dIZWlnaHQpO1xufTtcblxuJCgnLm1vZGFsLWJveF9fc2hvcHBpbmctYnV0dG9uLCAubW9kYWwtYm94X19jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm1vZGFsLWJveCcpLmhpZGUoKTtcbn0pO1xuIiwiJCgnLm5hdl9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGJ1dHRvbkFjdGl2ZUNsYXNzID0gJ25hdl9fYnV0dG9uLS1hY3RpdmUnO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoYnV0dG9uQWN0aXZlQ2xhc3MpO1xuICAgICQoJy5uYXZfX21lbnUnKS50b2dnbGVDbGFzcygndmlzaWJsZScpO1xufSk7IiwidmFyIGZpeFByZXZpZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGVudEhlaWdodCA9ICQoJy5wcmV2aWV3X19jb250ZW50JykuaGVpZ2h0KCk7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdwcmV2aWV3X19jb250ZW50LS1sYXJnZScsIGNvbnRlbnRIZWlnaHQgPiB3aW5kb3dIZWlnaHQpO1xufTtcblxudmFyIHNob3dQcmV2aWV3ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIHZhciBwaG90b1NyYyA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjO1xuICAgIHZhciBwcm9kdWN0RmFicmljID0gcHJvZHVjdHNbcHJvZHVjdElkXS5mYWJyaWM7XG4gICAgdmFyIHByb2R1Y3RTaXplID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplO1xuICAgIHZhciBwcm9kdWN0UHJpY2UgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnByaWNlO1xuICAgIHZhciBwcm9kdWN0VGl0bGUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnRpdGxlO1xuICAgIHZhciBwcm9kdWN0RGVzY3JpcHRpb24gPSBwcm9kdWN0c1twcm9kdWN0SWRdLmRlc2NyaXB0aW9uO1xuXG4gICAgJCgnLnByZXZpZXcnKS5zaG93KCk7XG4gICAgJCgnLnByZXZpZXdfX3Bob3RvLWl0ZW0nKS5hdHRyKCdzcmMnLCBwaG90b1NyYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtZmFicmljIHNwYW4nKS50ZXh0KHByb2R1Y3RGYWJyaWMpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXNpemUgc3BhbicpLnRleHQocHJvZHVjdFNpemUpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXByaWNlIHNwYW4nKS50ZXh0KCckJyArIHByb2R1Y3RQcmljZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtdGl0bGUnKS50ZXh0KHByb2R1Y3RUaXRsZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtZGVzY3JpcHRpb24tdGV4dCcpLnRleHQocHJvZHVjdERlc2NyaXB0aW9uKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJywgcHJvZHVjdHNbcHJvZHVjdElkXS5pZCk7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdwcmljZScsIHByb2R1Y3RQcmljZSk7XG5cbiAgICBmaXhQcmV2aWV3UG9zaXRpb24oKTtcbn07XG5cbiQoJy5wcm9kdWN0c19fd3JhcHBlcicpLm9uKCdjbGljaycsICcucHJvZHVjdHNfX3ByZXZpZXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJykuaW5kZXgoKTtcbiAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5wcmV2aWV3X19uZXh0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgKyAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IHByb2R1Y3RzLmxlbmd0aCkge1xuICAgICAgICBzaG93UHJldmlldygwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xuICAgIH1cbn0pO1xuXG4kKCcucHJldmlld19fcHJldi1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpIC0gMTtcbiAgICBpZiAocHJvZHVjdElkID09PSAtMSkge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0cy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xuICAgIH1cbn0pO1xuXG4kKCcucHJldmlld19fY2xvc2UtYnV0dG9uLCAucHJldmlld19fc2hvcHBpbmctYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5wcmV2aWV3JykuaGlkZSgpO1xufSk7XG5cbiQoJy5wcmV2aWV3X19iYXNrZXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKTtcbiAgICBhZGRQcm9kdWN0VG9DYXJ0KHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG4gICAgJCgnLm1vZGFsLWJveCcpLnNob3coKTtcbn0pOyIsInZhciBwcm9kdWN0cztcbnZhciBwcm9kdWN0c1dyYXBwZXIgPSAkKCcucHJvZHVjdHNfX3dyYXBwZXInKTtcblxudmFyIHJlbmRlclByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG4gICAgcHJvZHVjdHNXcmFwcGVyLmh0bWwoJycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb2R1Y3RJdGVtID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX2l0ZW0nLFxuICAgICAgICAgICAgJ2RhdGEtY29sb3InOiBwcm9kdWN0c1tpXS5jb2xvcixcbiAgICAgICAgICAgICdkYXRhLXNpemUnOiBwcm9kdWN0c1tpXS5zaXplLFxuICAgICAgICAgICAgJ2RhdGEtZmFicmljJzogcHJvZHVjdHNbaV0uZmFicmljLFxuICAgICAgICAgICAgJ2RhdGEtcHJpY2UnOiBwcm9kdWN0c1tpXS5wcmljZVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RJbWFnZSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ3Byb2R1Y3RzX19waG90bycsXG4gICAgICAgICAgICAnc3R5bGUnOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBwcm9kdWN0c1tpXS5zcmMgKyAnKSdcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwcm9kdWN0VGl0bGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3RpdGxlJ30pLnRleHQocHJvZHVjdHNbaV0udGl0bGUpO1xuICAgICAgICB2YXIgcHJvZHVjdEluZm8gPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX2luZm8nfSk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19zaXplLWxhYmVsJ30pLnRleHQoJ3NpemU6ICcpO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemUgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19zaXplJ30pLnRleHQocHJvZHVjdHNbaV0uc2l6ZSk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2VMYWJlbCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fcHJpY2UtbGFiZWwnfSkudGV4dCgncHJpY2U6ICcpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlID0gJCgnPHNwYW4+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fcHJpY2UnfSkudGV4dCgnJCcgKyBwcm9kdWN0c1tpXS5wcmljZSk7XG4gICAgICAgIHZhciBwcm9kdWN0RGVzY3JpcHRpb24gPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX2Rlc2NyaXB0aW9uJ30pLnRleHQocHJvZHVjdHNbaV0uZGVzY3JpcHRpb24pO1xuICAgICAgICB2YXIgcHJvZHVjdEJ1dHRvbiA9ICQoJzxidXR0b24gY2xhc3M9XCJwcm9kdWN0c19fYnV0dG9uXCI+YWRkIHRvIGNhcnQ8L2J1dHRvbj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmV2aWV3ID0gJCgnPGRpdiBjbGFzcz1cInByb2R1Y3RzX19wcmV2aWV3XCI+PGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+PC9kaXY+Jyk7XG5cbiAgICAgICAgcHJvZHVjdHNXcmFwcGVyLmFwcGVuZChwcm9kdWN0SXRlbSk7XG4gICAgICAgIHByb2R1Y3RJdGVtXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbWFnZSlcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFRpdGxlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0SW5mbylcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdERlc2NyaXB0aW9uKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0QnV0dG9uKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0UHJldmlldyk7XG4gICAgICAgIHByb2R1Y3RJbmZvXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RTaXplTGFiZWwpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmljZUxhYmVsKTtcbiAgICAgICAgcHJvZHVjdFNpemVMYWJlbC5hcHBlbmQocHJvZHVjdFNpemUpO1xuICAgICAgICBwcm9kdWN0UHJpY2VMYWJlbC5hcHBlbmQocHJvZHVjdFByaWNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvZHVjdHNPblBhZ2UgPSAkKCcucHJvZHVjdHNfX3dyYXBwZXIgLnByb2R1Y3RzX19pdGVtJyk7XG4gICAgcHJvZHVjdHNPblBhZ2UuaGlkZSgpO1xuICAgIHByb2R1Y3RzT25QYWdlLnNsaWNlKDAsIDQpLnNob3coKTtcbiAgICBpZiAocHJvZHVjdHNPblBhZ2UubGVuZ3RoID4gNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxufTtcblxudmFyIGxvYWRQcm9kdWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdkYi9wcm9kdWN0cy5qc29uJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHByb2R1Y3RzID0gcmVzcG9uc2UucHJvZHVjdHM7XG4gICAgICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICB9KS5mYWlsKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbn07XG5cbi8vc2hvdyBuZXh0IHByb2R1Y3RzXG52YXIgc2hvd05leHRQcm9kdWN0cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIGl0ZW1zID0gJChlbGVtZW50KTtcbiAgICB2YXIgbmV4dEl0ZW1zID0gaXRlbXMuc2xpY2UoMCwgNCk7XG5cbiAgICBpZiAobmV4dEl0ZW1zLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICAgICAgJCgnLmJsb2dfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgIH1cblxuICAgIG5leHRJdGVtcy5zaG93KCk7XG59O1xuXG5sb2FkUHJvZHVjdHMoKTtcblxuJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzaG93TmV4dFByb2R1Y3RzKCcucHJvZHVjdHNfX3dyYXBwZXIgLnByb2R1Y3RzX19pdGVtOmhpZGRlbicpO1xufSk7IiwidmFyIHNjcm9sbFRvRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyICR0YXJnZXRFbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB2YXIgcG9zaXRpb24gPSAkdGFyZ2V0RWxlbWVudC5vZmZzZXQoKS50b3A7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogcG9zaXRpb259LCAxNTAwKTtcbn07XG5cbiQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIHRvZ2dsZUJhY2tUb1RvcEJ1dHRvbigpO1xuICAgIHRvZ2dsZUZpeGVkRmlsdGVyKCk7XG59KTtcblxuJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgZml4UHJldmlld1Bvc2l0aW9uKCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgIHNldEZpbHRlck1heEhlaWdodCgpO1xufSk7IiwidmFyIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZSA9ICQoJy5mb3JtIHNlbGVjdCcpLnZhbCgpO1xuICAgIHZhciBmaXJzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZpcnN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIGxhc3ROYW1lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1sYXN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIHN0cmVldCA9ICQoJy5mb3JtIGlucHV0W25hbWU9c3RyZWV0XScpLnZhbCgpO1xuICAgIHZhciBob21lTnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWhvbWUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBmbGF0TnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZsYXQtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKS52YWwoKTtcbiAgICB2YXIgY2l0eSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y2l0eV0nKS52YWwoKTtcbiAgICB2YXIgY291bnRyeSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y291bnRyeV0nKS52YWwoKTtcbiAgICB2YXIgcGhvbmUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgZW1haWwgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWVtYWlsXScpLnZhbCgpO1xuXG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX25hbWUnKS50ZXh0KHRpdGxlICsgJyAnICsgZmlyc3ROYW1lICsgJyAnICsgbGFzdE5hbWUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19zdHJlZXQnKS50ZXh0KHN0cmVldCArICcgJyArIGhvbWVOciArICcgJyArIGZsYXROcik7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bvc3RhbC1jb2RlJykudGV4dChwb3N0YWxDb2RlKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY2l0eScpLnRleHQoY2l0eSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2NvdW50cnknKS50ZXh0KGNvdW50cnkpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19waG9uZScpLnRleHQocGhvbmUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19lbWFpbCcpLnRleHQoZW1haWwpO1xufTtcblxuJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VkaXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5hZGRyZXNzLWRhdGEnKS5zaG93KCk7XG4gICAgJCgnLmFkZHJlc3MtZGF0YV9fZ28tYmFjay1idXR0b24nKS5oaWRlKCk7XG4gICAgJCgnLmNhcnQtd3JhcHBlcicpLmhpZGUoKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5hZGRyZXNzLWRhdGEnKTtcbn0pO1xuIiwidmFyIGNoYW5nZUFjdGl2ZURvdCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICQoJy5zbGlkZXJfX2RvdCcpXG4gICAgICAgIC5lcShpbmRleClcbiAgICAgICAgLmFkZENsYXNzKCdzbGlkZXJfX2RvdC0tYWN0aXZlJylcbiAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fZG90LS1hY3RpdmUnKTtcbn07XG5cbnZhciBjaGFuZ2VBY3RpdmVQaG90byA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICQoJy5zbGlkZXJfX3NsaWRlJylcbiAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAuYWRkQ2xhc3MoJ3NsaWRlcl9fc2xpZGUtLWFjdGl2ZScpXG4gICAgICAgIC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX3NsaWRlLS1hY3RpdmUnKTtcbn07XG5cbnZhciBnZXRDdXJyZW50UGhvdG9JbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJCgnLnNsaWRlcl9fc2xpZGUuc2xpZGVyX19zbGlkZS0tYWN0aXZlJykuaW5kZXgoKTtcbn07XG5cbnZhciBvbkRvdENsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgY2xlYXJJbnRlcnZhbChhdXRvU2xpZGUpO1xuICAgIGNoYW5nZUFjdGl2ZURvdCgkKHRoaXMpLmluZGV4KCkpO1xuICAgIGNoYW5nZUFjdGl2ZVBob3RvKCQodGhpcykuaW5kZXgoKSk7XG4gICAgY3VycmVudEluZGV4ID0gZ2V0Q3VycmVudFBob3RvSW5kZXgoKTtcbiAgICBzdGFydFNsaWRlc2hvdygpO1xufTtcblxudmFyIGF1dG9TbGlkZTtcbnZhciBjdXJyZW50SW5kZXggPSAwO1xudmFyIHBob3RvcyA9ICQoJy5zbGlkZXJfX3NsaWRlJyk7XG5cbnZhciBzdGFydFNsaWRlc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBhdXRvU2xpZGUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCsrO1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gcGhvdG9zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudEluZGV4KTtcbiAgICAgICAgY2hhbmdlQWN0aXZlUGhvdG8oY3VycmVudEluZGV4KTtcbiAgICAgICAgY2hhbmdlQWN0aXZlRG90KGN1cnJlbnRJbmRleCk7XG5cbiAgICB9LCA1MDAwKTtcbn07XG5cbnN0YXJ0U2xpZGVzaG93KCk7XG5cbiQoJy5zbGlkZXJfX2RvdCcpLm9uKCdjbGljaycsIG9uRG90Q2xpY2spOyJdfQ==
