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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9nZ2xlQmFja1RvVG9wQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW51SGVpZ2h0ID0gJCgnLm5hdicpLmhlaWdodCgpO1xuICAgIHZhciBkb2N1bWVudFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID4gbWVudUhlaWdodCkge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLmhpZGUoKTtcbiAgICB9XG59O1xuXG4kKCcuYmFjay10by10b3BfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDE1MDApO1xufSk7XG4iLCJ2YXIgcmVuZGVyRW50cmllcyA9IGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgdmFyIGJsb2dXcmFwcGVyID0gJCgnLmJsb2dfX3dyYXBwZXInKTtcbiAgICBibG9nV3JhcHBlci5lbXB0eSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZW50cnkgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeScsXG4gICAgICAgICAgICAnZGF0YS1pZCc6IGVudHJpZXNbaV0uaWRcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyeVBob3RvID0gJCgnPGltZz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiBcImJsb2dfX2VudHJ5LXBob3RvXCIsXG4gICAgICAgICAgICAnc3JjJzogZW50cmllc1tpXS5pbWdfc3JjXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cmllc1dyYXBwZXIgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeS13cmFwcGVyJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5VGl0bGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktdGl0bGUnfSkudGV4dChlbnRyaWVzW2ldLnRpdGxlKTtcbiAgICAgICAgdmFyIGVudHJ5VGV4dCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10ZXh0J30pLnRleHQoZW50cmllc1tpXS50ZXh0KTtcbiAgICAgICAgdmFyIGVudHJ5RGF0ZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS1kYXRlJ30pLnRleHQoZW50cmllc1tpXS5kYXRlKTtcbiAgICAgICAgdmFyIGVudHJ5QnV0dG9uID0gJCgnPGJ1dHRvbj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2J1dHRvbid9KS50ZXh0KCdyZWFkIG1vcmUnKTtcblxuICAgICAgICBibG9nV3JhcHBlci5hcHBlbmQoZW50cnkpO1xuICAgICAgICBlbnRyeVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVBob3RvKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyaWVzV3JhcHBlcik7XG4gICAgICAgIGVudHJpZXNXcmFwcGVyXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5RGF0ZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUZXh0KVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdmFyIGVudHJpZXNPblBhZ2UgPSAkKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnknKTtcbiAgICBlbnRyaWVzT25QYWdlLmhpZGUoKTtcbiAgICBlbnRyaWVzT25QYWdlLnNsaWNlKDAsIDMpLnNob3coKTtcbiAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykuc2hvdygpO1xufTtcblxudmFyIGxvYWRFbnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL2VudHJpZXMuanNvbicsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZW5kZXJFbnRyaWVzKHJlc3BvbnNlLmVudHJpZXMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxubG9hZEVudHJpZXMoKTtcblxuJCgnLmJsb2dfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5ibG9nX193cmFwcGVyIC5ibG9nX19lbnRyeTpoaWRkZW4nKTtcbn0pO1xuIiwidmFyIGNhcnRBcnJheSA9IHJlYWRDb29raWUoJ2NhcnQnKSB8fCBbXTtcblxuLy8gY29va2llc1xuZnVuY3Rpb24gY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG4gICAgdmFyIGV4cGlyZXMgPSBcIlwiO1xuICAgIGlmIChkYXlzKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgICAgIGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcbn1cblxuZnVuY3Rpb24gcmVhZENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT0gMCkgcmV0dXJuIEpTT04ucGFyc2UoYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXJhc2VDb29raWUobmFtZSkge1xuICAgIGNyZWF0ZUNvb2tpZShuYW1lLCBcIlwiLCAtMSk7XG59XG5cbnZhciBhZGRQcm9kdWN0VG9DYXJ0ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIHZhciBwcm9kdWN0ID0ge1xuICAgICAgICBwYXRoOiBwcm9kdWN0c1twcm9kdWN0SWRdLnNyYyxcbiAgICAgICAgcHJpY2U6IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2UsXG4gICAgICAgIHNpemU6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc2l6ZSxcbiAgICAgICAgaWQ6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uaWQsXG4gICAgICAgIGFtb3VudDogMVxuICAgIH07XG5cbiAgICAvLyBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIC8vICAgICBjYXJ0QXJyYXkucHVzaChwcm9kdWN0KTtcbiAgICAvLyAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgIC8vIH1cbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICB2YXIgbmV3QXJyYXkgPSBbXTtcbiAgICAvLyAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgLy8gICAgICAgICBuZXdBcnJheS5wdXNoKGNhcnRBcnJheVtpXSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgY29uc29sZS5sb2cobmV3QXJyYXkpO1xuICAgIC8vICAgICBpZiAobmV3QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhuZXdBcnJheSk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgIGNhcnRBcnJheS5wdXNoKHByb2R1Y3QpO1xuICAgIC8vICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyB9XG4gICAgY2FydEFycmF5LnB1c2gocHJvZHVjdCk7XG4gICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuXG59O1xuXG52YXIgcmVuZGVyQ2FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uc1dyYXBwZXIgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19idXR0b25zLXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcGx1cy1idXR0b25cIj4mIzQzOzwvZGl2PjxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19taW51cy1idXR0b25cIj4mIzQ1OzwvZGl2PjwvZGl2PicpO1xuICAgIHZhciBkZWxldGVCdXR0b24gPSAoJzxidXR0b24gY2xhc3M9XCJzaG9wcGluZy1saXN0X19kZWxldGUtYnV0dG9uXCI+ZGVsZXRlPC9idXR0b24+Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdFBob3RvID0gKCc8aW1nIGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1waG90b1wiIHNyYz1cIicgKyBjYXJ0QXJyYXlbaV0ucGF0aCArICdcIj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RBbW91bnQgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LWFtb3VudFwiPicgKyBjYXJ0QXJyYXlbaV0uYW1vdW50ICsgYnV0dG9uc1dyYXBwZXIgKyAnPC9kaXY+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXByaWNlXCI+JCcgKyBjYXJ0QXJyYXlbaV0ucHJpY2UgKyAnIDwvZGl2PicpO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemUgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXNpemVcIj4nICsgY2FydEFycmF5W2ldLnNpemUgKyAnPC9kaXY+Jyk7XG5cbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKVxuICAgICAgICAgICAgLnByZXBlbmQoJyA8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyXCIgZGF0YS1pZD0nICsgY2FydEFycmF5W2ldLmlkICsgJz4nICsgcHJvZHVjdFBob3RvICsgcHJvZHVjdFNpemUgKyBwcm9kdWN0QW1vdW50ICsgcHJvZHVjdFByaWNlICsgZGVsZXRlQnV0dG9uICsgJzwvZGl2PicpO1xuXG4gICAgfVxufTtcblxudmFyIHRvdGFsU3VtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWxpdmVyeVByaWNlID0gcGFyc2VJbnQoJCgnLnNob3BwaW5nLWxpc3RfX2RlbGl2ZXJ5LXByaWNlJykudGV4dCgpKTtcbiAgICB2YXIgdG90YWxTdW0gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRvdGFsU3VtICs9IHBhcnNlSW50KGNhcnRBcnJheVtpXS5wcmljZSk7XG4gICAgfVxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGl2ZXJ5UHJpY2UgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gJyQnICsgKHRvdGFsU3VtICsgZGVsaXZlcnlQcmljZSk7XG59O1xuXG4vLyBBcnJheSBSZW1vdmUgLSBCeSBKb2huIFJlc2lnIChNSVQgTGljZW5zZWQpXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XG59O1xuXG52YXIgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGNhcnRBcnJheS5pbmRleE9mKGNhcnRBcnJheVtpXSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgICAgICBjYXJ0QXJyYXkucmVtb3ZlKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKS5lbXB0eSgpO1xuICAgIHJlbmRlckNhcnQoKTtcbiAgICBjb25zb2xlLmxvZyhjYXJ0QXJyYXkpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcblxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19idXktYnV0dG9uLWxpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmlmICgkKCcuc2hvcHBpbmctbGlzdCcpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJlbmRlckNhcnQoKTtcbn1cblxuaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19idXktYnV0dG9uLWxpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbn1cblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX2RlbGV0ZS1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQocHJvZHVjdElkKTtcbn0pO1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuXG5cbi8vYWRkIHByb2R1Y3RzIHRvIGNhcnRcbiQoJy5wcm9kdWN0c19fd3JhcHBlcicpLm9uKCdjbGljaycsICcucHJvZHVjdHNfX2J1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgICQoJy5tb2RhbC1ib3gnKS5zaG93KCk7XG4gICAgYWRkUHJvZHVjdFRvQ2FydChwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xufSk7XG5cbiIsInZhciB2YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzVmFsaWQgPSB0cnVlO1xuXG4gICAgdmFyIGVtYWlsUmUgPSAvXlthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTktXSsoPzpcXC5bYS16QS1aMC05LV0rKSokLztcbiAgICB2YXIgcG9zdGFsQ29kZVJlID0gL1swLTldezJ9XFwtWzAtOV17M30vO1xuICAgIHZhciBwaG9uZU5yUmUgPSAvWzAtOV0kLztcblxuICAgIHZhciAkZW1haWwgPSAkKCcuZm9ybSBpbnB1dFt0eXBlPWVtYWlsXScpO1xuICAgIHZhciAkcG9zdGFsQ29kZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cG9zdGFsLWNvZGVdJyk7XG4gICAgdmFyICRwaG9uZU51bWJlciA9ICQoJy5mb3JtIGlucHV0W25hbWU9cGhvbmUtbnVtYmVyXScpO1xuXG4gICAgdmFyIGlzRW1haWwgPSBlbWFpbFJlLnRlc3QoJGVtYWlsLnZhbCgpKTtcbiAgICB2YXIgaXNQb3N0YWxDb2RlID0gcG9zdGFsQ29kZVJlLnRlc3QoJHBvc3RhbENvZGUudmFsKCkpO1xuICAgIHZhciBpc1Bob25lTnIgPSBwaG9uZU5yUmUudGVzdCgkcGhvbmVOdW1iZXIudmFsKCkpO1xuXG4gICAgJCgnLmZvcm0gaW5wdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJycpIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkZW1haWwuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNFbWFpbCkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRwb3N0YWxDb2RlLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUG9zdGFsQ29kZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRwaG9uZU51bWJlci5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1Bob25lTnIgfHwgJHBob25lTnVtYmVyLnZhbCgpLmxlbmd0aCA8IDkpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoaXNWYWxpZCAmJiBpc0VtYWlsICYmIGlzUG9zdGFsQ29kZSAmJiBpc1Bob25lTnIpIHtcbiAgICAgICAgJCgnLmFkZHJlc3MtZGF0YScpLmhpZGUoKTtcbiAgICAgICAgY29tcGxldGVTaGlwcGluZ0FkZHJlc3MoKTtcbiAgICAgICAgJCgnLmNhcnQtd3JhcHBlcicpLnNob3coKTtcbiAgICB9XG59O1xuXG4vL3JlYWQgaW4gYSBmb3JtJ3MgZGF0YSBhbmQgY29udmVydCBpdCB0byBhIGtleTp2YWx1ZSBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0pIHtcbiAgICB2YXIgb3V0ID0ge307XG4gICAgdmFyIGRhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgLy90cmFuc2Zvcm0gaW50byBzaW1wbGUgZGF0YS92YWx1ZSBvYmplY3RcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IGRhdGFbaV07XG4gICAgICAgIG91dFtyZWNvcmQubmFtZV0gPSByZWNvcmQudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbiQoJy5hZGRyZXNzLWRhdGFfX2J1eS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YWxpZGF0ZUZvcm0oKTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5zaG9wcGluZy1saXN0Jyk7XG59KTtcblxuJCgnLmFkZHJlc3MtZGF0YV9fZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICAkKCcubW9kYWwtYm94LS1mb3JtJykuc2hvdygpO1xuICAgIHZhciBmb3JtRGF0YSA9IGdldEZvcm1EYXRhKCcjYWRkcmVzcy1kYXRhJyk7XG4gICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xufSk7IiwidmFyIHRvZ2dsZUZpeGVkRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZmlsdGVyID0gJCgnLmZpbHRlcicpO1xuXG4gICAgaWYgKCEkZmlsdGVyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgdmFyIGZpbHRlck9mZnNldCA9ICRmaWx0ZXIucGFyZW50KCkub2Zmc2V0KCkudG9wO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID49IGZpbHRlck9mZnNldCkge1xuICAgICAgICAkZmlsdGVyLmFkZENsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGZpbHRlci5yZW1vdmVDbGFzcygnZmlsdGVyLS1maXhlZCcpO1xuICAgIH1cbn07XG5cbnZhciBzZXRGaWx0ZXJNYXhIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCQoJy5maWx0ZXInKS5oZWlnaHQoKSA+ICQod2luZG93KS5oZWlnaHQoKSkge1xuICAgICAgICAkKCcuZmlsdGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJCh3aW5kb3cpLmhlaWdodCgpKVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG4gICAgfVxufTtcblxudmFyIGZpbHRlcmVkUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICAkKCcucHJvZHVjdHNfX3dyYXBwZXInKS5odG1sKCcnKTtcbiAgICB2YXIgbWF4ID0gcGFyc2VJbnQoJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKCkpO1xuICAgIHZhciBtaW4gPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1pbl0nKS52YWwoKSk7XG5cbiAgICB2YXIgY29sb3JBcnJheSA9IG1ha2VDb2xvckFycmF5KCk7XG4gICAgdmFyIHNpemVBcnJheSA9IG1ha2VTaXplQXJyYXkoKTtcbiAgICB2YXIgZmFicmljc0FycmF5ID0gbWFrZUZhYnJpY3NBcnJheSgpO1xuICAgIHZhciBmaWx0ZXJlZCA9IHByb2R1Y3RzO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlCbGluZ1ByaWNlcyhmaWx0ZXJlZCwgbWluLCBtYXgpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlDb2xvcnMoZmlsdGVyZWQsIGNvbG9yQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlTaXplcyhmaWx0ZXJlZCwgc2l6ZUFycmF5KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5RmFicmljcyhmaWx0ZXJlZCwgZmFicmljc0FycmF5KTtcbiAgICByZW5kZXJQcm9kdWN0cyhmaWx0ZXJlZCk7XG59O1xuXG4vL2ZpbHRlciBwcm9kdWN0c1xudmFyIGZpbHRlckJ5QmxpbmdQcmljZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIG1pbiwgbWF4KSB7XG4gICAgY29uc29sZS5sb2cocHJvZHVjdHMpO1xuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5wcmljZSA+PSBtaW4gJiYgdmFsdWUucHJpY2UgPD0gbWF4O1xuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5Q29sb3JzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBjb2xvckFycmF5KSB7XG4gICAgaWYgKGNvbG9yQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuY29sb3IgPT09IGNvbG9yQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5U2l6ZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIHNpemVBcnJheSkge1xuICAgIGlmIChzaXplQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zaXplID09PSBzaXplQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5RmFicmljcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgZmFicmljQXJyYXkpIHtcbiAgICBpZiAoZmFicmljQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmYWJyaWNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmZhYnJpYyA9PT0gZmFicmljQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuXG4vL2ZpbHRlciBhcnJheXNcbnZhciBtYWtlQ29sb3JBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRDb2xvcnMgPSBbXTtcbiAgICAkKCcuY29sb3JzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRDb2xvcnMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRDb2xvcnM7XG59O1xuXG52YXIgbWFrZVNpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRTaXplcyA9IFtdO1xuICAgICQoJy5zaXplcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkU2l6ZXMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRTaXplcztcbn07XG5cbnZhciBtYWtlRmFicmljc0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZEZhYnJpY3MgPSBbXTtcbiAgICAkKCcuZmFicmljcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkRmFicmljcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZEZhYnJpY3M7XG59O1xuXG4kKCcuZmlsdGVyX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgc2Nyb2xsVG9FbGVtZW50KCcucHJvZHVjdHNfX3dyYXBwZXInKTtcbn0pO1xuXG5zZXRGaWx0ZXJNYXhIZWlnaHQoKTtcblxuJCgnLmZpbHRlcl9fdGl0bGUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXNpYmxlQ2xhc3MgPSAnZmlsdGVyX193cmFwcGVyLS12aXNpYmxlJztcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnZmlsdGVyX190aXRsZS0tYWN0aXZlJztcbiAgICAkKCcuZmlsdGVyX193cmFwcGVyJykuZmFkZVRvZ2dsZSh2aXNpYmxlQ2xhc3MpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoYnV0dG9uQWN0aXZlQ2xhc3MpO1xufSk7XG5cbiQoJy5maWx0ZXJfX3Jlc2V0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKDEwMCk7XG59KTsiLCJmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHtsYXQ6IDUxLjEwMjA3NSwgbG5nOiAxNy4wNDkyNjJ9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiB0cnVlLFxuICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgbWFwOiBtYXBcbiAgICB9KTtcbn1cbiIsInZhciBmaXhNb2RhbEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLm1vZGFsLWJveF9fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLm1vZGFsLWJveF9fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdtb2RhbC1ib3hfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG4kKCcubW9kYWwtYm94X19zaG9wcGluZy1idXR0b24sIC5tb2RhbC1ib3hfX2Nsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcubW9kYWwtYm94JykuaGlkZSgpO1xufSk7XG4iLCIkKCcubmF2X19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnbmF2X19idXR0b24tLWFjdGl2ZSc7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG4gICAgJCgnLm5hdl9fbWVudScpLnRvZ2dsZUNsYXNzKCd2aXNpYmxlJyk7XG59KTsiLCJ2YXIgZml4UHJldmlld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ3ByZXZpZXdfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG52YXIgc2hvd1ByZXZpZXcgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgdmFyIHBob3RvU3JjID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zcmM7XG4gICAgdmFyIHByb2R1Y3RGYWJyaWMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLmZhYnJpYztcbiAgICB2YXIgcHJvZHVjdFNpemUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemU7XG4gICAgdmFyIHByb2R1Y3RQcmljZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2U7XG4gICAgdmFyIHByb2R1Y3RUaXRsZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0udGl0bGU7XG4gICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZGVzY3JpcHRpb247XG5cbiAgICAkKCcucHJldmlldycpLnNob3coKTtcbiAgICAkKCcucHJldmlld19fcGhvdG8taXRlbScpLmF0dHIoJ3NyYycsIHBob3RvU3JjKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1mYWJyaWMgc3BhbicpLnRleHQocHJvZHVjdEZhYnJpYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3Qtc2l6ZSBzcGFuJykudGV4dChwcm9kdWN0U2l6ZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtcHJpY2Ugc3BhbicpLnRleHQoJyQnICsgcHJvZHVjdFByaWNlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC10aXRsZScpLnRleHQocHJvZHVjdFRpdGxlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1kZXNjcmlwdGlvbi10ZXh0JykudGV4dChwcm9kdWN0RGVzY3JpcHRpb24pO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnLCBwcm9kdWN0c1twcm9kdWN0SWRdLmlkKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ3ByaWNlJywgcHJvZHVjdFByaWNlKTtcblxuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xufTtcblxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fcHJldmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG59KTtcblxuJCgnLnByZXZpZXdfX25leHQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSArIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHMubGVuZ3RoKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19wcmV2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgLSAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IC0xKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19jbG9zZS1idXR0b24sIC5wcmV2aWV3X19zaG9wcGluZy1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG59KTtcblxuJCgnLnByZXZpZXdfX2Jhc2tldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xufSk7IiwidmFyIHByb2R1Y3RzO1xudmFyIHByb2R1Y3RzV3JhcHBlciA9ICQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xuXG52YXIgcmVuZGVyUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICBwcm9kdWN0c1dyYXBwZXIuaHRtbCgnJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdEl0ZW0gPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19faXRlbScsXG4gICAgICAgICAgICAnZGF0YS1jb2xvcic6IHByb2R1Y3RzW2ldLmNvbG9yLFxuICAgICAgICAgICAgJ2RhdGEtc2l6ZSc6IHByb2R1Y3RzW2ldLnNpemUsXG4gICAgICAgICAgICAnZGF0YS1mYWJyaWMnOiBwcm9kdWN0c1tpXS5mYWJyaWMsXG4gICAgICAgICAgICAnZGF0YS1wcmljZSc6IHByb2R1Y3RzW2ldLnByaWNlXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdEltYWdlID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX3Bob3RvJyxcbiAgICAgICAgICAgICdzdHlsZSc6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIHByb2R1Y3RzW2ldLnNyYyArICcpJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fdGl0bGUnfSkudGV4dChwcm9kdWN0c1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW5mbyA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19faW5mbyd9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUtbGFiZWwnfSkudGV4dCgnc2l6ZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUnfSkudGV4dChwcm9kdWN0c1tpXS5zaXplKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZS1sYWJlbCd9KS50ZXh0KCdwcmljZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZSd9KS50ZXh0KCckJyArIHByb2R1Y3RzW2ldLnByaWNlKTtcbiAgICAgICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fZGVzY3JpcHRpb24nfSkudGV4dChwcm9kdWN0c1tpXS5kZXNjcmlwdGlvbik7XG4gICAgICAgIHZhciBwcm9kdWN0QnV0dG9uID0gJCgnPGJ1dHRvbiBjbGFzcz1cInByb2R1Y3RzX19idXR0b25cIj5hZGQgdG8gY2FydDwvYnV0dG9uPicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByZXZpZXcgPSAkKCc8ZGl2IGNsYXNzPVwicHJvZHVjdHNfX3ByZXZpZXdcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT48L2Rpdj4nKTtcblxuICAgICAgICBwcm9kdWN0c1dyYXBwZXIuYXBwZW5kKHByb2R1Y3RJdGVtKTtcbiAgICAgICAgcHJvZHVjdEl0ZW1cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEltYWdlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbmZvKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0RGVzY3JpcHRpb24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RCdXR0b24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmV2aWV3KTtcbiAgICAgICAgcHJvZHVjdEluZm9cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFNpemVMYWJlbClcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByaWNlTGFiZWwpO1xuICAgICAgICBwcm9kdWN0U2l6ZUxhYmVsLmFwcGVuZChwcm9kdWN0U2l6ZSk7XG4gICAgICAgIHByb2R1Y3RQcmljZUxhYmVsLmFwcGVuZChwcm9kdWN0UHJpY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm9kdWN0c09uUGFnZSA9ICQoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW0nKTtcbiAgICBwcm9kdWN0c09uUGFnZS5oaWRlKCk7XG4gICAgcHJvZHVjdHNPblBhZ2Uuc2xpY2UoMCwgNCkuc2hvdygpO1xuICAgIGlmIChwcm9kdWN0c09uUGFnZS5sZW5ndGggPiA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG59O1xuXG52YXIgbG9hZFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL3Byb2R1Y3RzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvZHVjdHMgPSByZXNwb25zZS5wcm9kdWN0cztcbiAgICAgICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxuLy9zaG93IG5leHQgcHJvZHVjdHNcbnZhciBzaG93TmV4dFByb2R1Y3RzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgaXRlbXMgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBuZXh0SXRlbXMgPSBpdGVtcy5zbGljZSgwLCA0KTtcblxuICAgIGlmIChuZXh0SXRlbXMubGVuZ3RoIDwgNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgICAgICAkKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgbmV4dEl0ZW1zLnNob3coKTtcbn07XG5cbmxvYWRQcm9kdWN0cygpO1xuXG4kKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW06aGlkZGVuJyk7XG59KTsiLCJ2YXIgc2Nyb2xsVG9FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgJHRhcmdldEVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBwb3NpdGlvbiA9ICR0YXJnZXRFbGVtZW50Lm9mZnNldCgpLnRvcDtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBwb3NpdGlvbn0sIDE1MDApO1xufTtcblxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdG9nZ2xlQmFja1RvVG9wQnV0dG9uKCk7XG4gICAgdG9nZ2xlRml4ZWRGaWx0ZXIoKTtcbn0pO1xuXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBmaXhQcmV2aWV3UG9zaXRpb24oKTtcbiAgICBmaXhNb2RhbEJveFBvc2l0aW9uKCk7XG4gICAgc2V0RmlsdGVyTWF4SGVpZ2h0KCk7XG59KTsiLCJ2YXIgY29tcGxldGVTaGlwcGluZ0FkZHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlID0gJCgnLmZvcm0gc2VsZWN0JykudmFsKCk7XG4gICAgdmFyIGZpcnN0TmFtZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Zmlyc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgbGFzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWxhc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgc3RyZWV0ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1zdHJlZXRdJykudmFsKCk7XG4gICAgdmFyIGhvbWVOciA9ICQoJy5mb3JtIGlucHV0W25hbWU9aG9tZS1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIGZsYXROciA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZmxhdC1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpLnZhbCgpO1xuICAgIHZhciBjaXR5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jaXR5XScpLnZhbCgpO1xuICAgIHZhciBjb3VudHJ5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jb3VudHJ5XScpLnZhbCgpO1xuICAgIHZhciBwaG9uZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cGhvbmUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBlbWFpbCA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZW1haWxdJykudmFsKCk7XG5cbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fbmFtZScpLnRleHQodGl0bGUgKyAnICcgKyBmaXJzdE5hbWUgKyAnICcgKyBsYXN0TmFtZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3N0cmVldCcpLnRleHQoc3RyZWV0ICsgJyAnICsgaG9tZU5yICsgJyAnICsgZmxhdE5yKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fcG9zdGFsLWNvZGUnKS50ZXh0KHBvc3RhbENvZGUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19jaXR5JykudGV4dChjaXR5KTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY291bnRyeScpLnRleHQoY291bnRyeSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bob25lJykudGV4dChwaG9uZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VtYWlsJykudGV4dChlbWFpbCk7XG59O1xuXG4kKCcuc2hpcHBpbmctYWRkcmVzc19fZWRpdC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmFkZHJlc3MtZGF0YScpLnNob3coKTtcbiAgICAkKCcuYWRkcmVzcy1kYXRhX19nby1iYWNrLWJ1dHRvbicpLmhpZGUoKTtcbiAgICAkKCcuY2FydC13cmFwcGVyJykuaGlkZSgpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgnLmFkZHJlc3MtZGF0YScpO1xufSk7XG4iLCJ2YXIgY2hhbmdlQWN0aXZlRG90ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgJCgnLnNsaWRlcl9fZG90JylcbiAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAuYWRkQ2xhc3MoJ3NsaWRlcl9fZG90LS1hY3RpdmUnKVxuICAgICAgICAuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2xpZGVyX19kb3QtLWFjdGl2ZScpO1xufTtcblxudmFyIGNoYW5nZUFjdGl2ZVBob3RvID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgJCgnLnNsaWRlcl9fc2xpZGUnKVxuICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgIC5hZGRDbGFzcygnc2xpZGVyX19zbGlkZS0tYWN0aXZlJylcbiAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fc2xpZGUtLWFjdGl2ZScpO1xufTtcblxudmFyIGdldEN1cnJlbnRQaG90b0luZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKCcuc2xpZGVyX19zbGlkZS5zbGlkZXJfX3NsaWRlLS1hY3RpdmUnKS5pbmRleCgpO1xufTtcblxudmFyIG9uRG90Q2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9TbGlkZSk7XG4gICAgY2hhbmdlQWN0aXZlRG90KCQodGhpcykuaW5kZXgoKSk7XG4gICAgY2hhbmdlQWN0aXZlUGhvdG8oJCh0aGlzKS5pbmRleCgpKTtcbiAgICBjdXJyZW50SW5kZXggPSBnZXRDdXJyZW50UGhvdG9JbmRleCgpO1xuICAgIHN0YXJ0U2xpZGVzaG93KCk7XG59O1xuXG52YXIgYXV0b1NsaWRlO1xudmFyIGN1cnJlbnRJbmRleCA9IDA7XG52YXIgcGhvdG9zID0gJCgnLnNsaWRlcl9fc2xpZGUnKTtcblxudmFyIHN0YXJ0U2xpZGVzaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIGF1dG9TbGlkZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3VycmVudEluZGV4Kys7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPiBwaG90b3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50SW5kZXgpO1xuICAgICAgICBjaGFuZ2VBY3RpdmVQaG90byhjdXJyZW50SW5kZXgpO1xuICAgICAgICBjaGFuZ2VBY3RpdmVEb3QoY3VycmVudEluZGV4KTtcblxuICAgIH0sIDUwMDApO1xufTtcblxuc3RhcnRTbGlkZXNob3coKTtcblxuJCgnLnNsaWRlcl9fZG90Jykub24oJ2NsaWNrJywgb25Eb3RDbGljayk7Il19
