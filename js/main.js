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
    for (var i = 0; i < cartArray.length; i++) {
        if (cartArray[i].id === productId) {
            cartArray[i].amount++;
            createCookie('cart', cartArray, 365);
            return;
        }
    }

    var product = {
        path: products[productId].src,
        price: products[productId].price,
        size: products[productId].size,
        id: products[productId].id,
        amount: 1
    };

    cartArray.push(product);
    createCookie('cart', cartArray, 365);

};

var renderCart = function () {
    $('.shopping-list__product-wrapper').empty();
    var buttonsWrapper = ('<div class="shopping-list__buttons-wrapper"><div class="shopping-list__plus-button">&#43;</div><div class="shopping-list__minus-button">&#45;</div></div>');
    var deleteButton = ('<button class="shopping-list__delete-button">delete</button>');

    for (var i = 0; i < cartArray.length; i++) {
        var productPhoto = ('<img class="shopping-list__product-photo" src="' + cartArray[i].path + '">');
        var productAmount = ('<div class="shopping-list__product-amount"><span>' + cartArray[i].amount + '</span>' + buttonsWrapper + '</div>');
        var productPrice = ('<div class="shopping-list__product-price">$' + (cartArray[i].price * cartArray[i].amount) + ' </div>');
        var productSize = ('<div class="shopping-list__product-size">' + cartArray[i].size + '</div>');

        $('.shopping-list__wrapper')
            .prepend(' <div class="shopping-list__product-wrapper" data-id=' + cartArray[i].id + '>' + productPhoto + productSize + productAmount + productPrice + deleteButton + '</div>');

    }
};

var totalSum = function () {
    var deliveryPrice = parseInt($('.shopping-list__delivery-price').text());
    var totalSum = 0;
    for (var i = 0; i < cartArray.length; i++) {
        totalSum += parseInt(cartArray[i].price * cartArray[i].amount);
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
            cartArray.remove(index);
        }

    }
    renderCart();
    createCookie('cart', cartArray, 365);
    $('.shopping-list__product-total-price span').text(totalSum());
    $('.nav__basket-amount').text(cartArray.length);

    if (cartArray.length === 0) {
        $('.shopping-list__empty-basket').show();
        $('.shopping-list__buy-button').css('pointer-events', 'none');
    }
};

var sumOfProducts = function () {
    var sumOfProducts = 0;
    for (var i = 0; i < cartArray.length; i++) {
        sumOfProducts += cartArray[i].amount;
    }
    return sumOfProducts;
};

var increaseAmountOfProducts = function (productId) {
    for (var i = 0; i < cartArray.length; i++) {
        if (cartArray[i].id === productId) {
            cartArray[i].amount++;
            createCookie('cart', cartArray, 365);
        }
    }
    renderCart();
};

var decreaseAmountOfProducts = function (productId) {
    for (var i = 0; i < cartArray.length; i++) {
        if (cartArray[i].id === productId) {
            cartArray[i].amount--;
            if (cartArray[i].amount === 0) {
                deleteProductFromBasket(productId);
            }
            createCookie('cart', cartArray, 365);
        }
    }

    renderCart();

};

$('.shopping-list__wrapper').on('click', '.shopping-list__plus-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    increaseAmountOfProducts(productId);
    $('.nav__basket-amount').text(sumOfProducts());
});

$('.shopping-list__wrapper').on('click', '.shopping-list__minus-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    decreaseAmountOfProducts(productId);
    $('.nav__basket-amount').text(sumOfProducts());
});


if ($('.shopping-list').length !== 0) {
    renderCart();
}

if (cartArray.length === 0) {
    $('.shopping-list__empty-basket').show();
    $('.shopping-list__buy-button').css('pointer-events', 'none');
}

$('.shopping-list__wrapper').on('click', '.shopping-list__delete-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    deleteProductFromBasket(productId);
});

$('.shopping-list__product-total-price span').text(totalSum());
$('.nav__basket-amount').text(sumOfProducts());


//add products to cart
$('.products__wrapper').on('click', '.products__button', function () {
    var productId = $(this).closest('.products__item').index();
    $('.modal-box').show();
    addProductToCart(productId);
    $('.nav__basket-amount').text(sumOfProducts());
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
        $('.container--form').show();
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
    $('.products__not-found').hide();
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
    if (filtered.length === 0) {
        $('.products__not-found').show();
    }
};

//filter products
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
    $('.filter__price-range input[name=min]').val(0);
    $('.products__not-found').hide();
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
        changeActivePhoto(currentIndex);
        changeActiveDot(currentIndex);

    }, 5000);
};

startSlideshow();

$('.slider__dot').on('click', onDotClick);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvZ2dsZUJhY2tUb1RvcEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVudUhlaWdodCA9ICQoJy5uYXYnKS5oZWlnaHQoKTtcbiAgICB2YXIgZG9jdW1lbnRQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICBpZiAoZG9jdW1lbnRQb3NpdGlvbiA+IG1lbnVIZWlnaHQpIHtcbiAgICAgICAgJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5oaWRlKCk7XG4gICAgfVxufTtcblxuJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAxNTAwKTtcbn0pO1xuIiwidmFyIHJlbmRlckVudHJpZXMgPSBmdW5jdGlvbiAoZW50cmllcykge1xuICAgIHZhciBibG9nV3JhcHBlciA9ICQoJy5ibG9nX193cmFwcGVyJyk7XG4gICAgYmxvZ1dyYXBwZXIuZW1wdHkoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnYmxvZ19fZW50cnknLFxuICAgICAgICAgICAgJ2RhdGEtaWQnOiBlbnRyaWVzW2ldLmlkXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cnlQaG90byA9ICQoJzxpbWc+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogXCJibG9nX19lbnRyeS1waG90b1wiLFxuICAgICAgICAgICAgJ3NyYyc6IGVudHJpZXNbaV0uaW1nX3NyY1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJpZXNXcmFwcGVyID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnYmxvZ19fZW50cnktd3JhcHBlcidcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyeVRpdGxlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXRpdGxlJ30pLnRleHQoZW50cmllc1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBlbnRyeVRleHQgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktdGV4dCd9KS50ZXh0KGVudHJpZXNbaV0udGV4dCk7XG4gICAgICAgIHZhciBlbnRyeURhdGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktZGF0ZSd9KS50ZXh0KGVudHJpZXNbaV0uZGF0ZSk7XG4gICAgICAgIHZhciBlbnRyeUJ1dHRvbiA9ICQoJzxidXR0b24+JywgeydjbGFzcyc6ICdibG9nX19idXR0b24nfSkudGV4dCgncmVhZCBtb3JlJyk7XG5cbiAgICAgICAgYmxvZ1dyYXBwZXIuYXBwZW5kKGVudHJ5KTtcbiAgICAgICAgZW50cnlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlQaG90bylcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cmllc1dyYXBwZXIpO1xuICAgICAgICBlbnRyaWVzV3JhcHBlclxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVRpdGxlKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeURhdGUpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5VGV4dClcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlCdXR0b24pO1xuICAgIH1cblxuICAgIHZhciBlbnRyaWVzT25QYWdlID0gJCgnLmJsb2dfX3dyYXBwZXIgLmJsb2dfX2VudHJ5Jyk7XG4gICAgZW50cmllc09uUGFnZS5oaWRlKCk7XG4gICAgZW50cmllc09uUGFnZS5zbGljZSgwLCAzKS5zaG93KCk7XG4gICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLnNob3coKTtcbn07XG5cbnZhciBsb2FkRW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdkYi9lbnRyaWVzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmVuZGVyRW50cmllcyhyZXNwb25zZS5lbnRyaWVzKTtcbiAgICB9KS5mYWlsKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbn07XG5cbmxvYWRFbnRyaWVzKCk7XG5cbiQoJy5ibG9nX19idXR0b24tbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzaG93TmV4dFByb2R1Y3RzKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnk6aGlkZGVuJyk7XG59KTtcbiIsInZhciBjYXJ0QXJyYXkgPSByZWFkQ29va2llKCdjYXJ0JykgfHwgW107XG5cbi8vIGNvb2tpZXNcbmZ1bmN0aW9uIGNyZWF0ZUNvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuICAgIHZhciBleHBpcmVzID0gXCJcIjtcbiAgICBpZiAoZGF5cykge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xuICAgICAgICBleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgXCI9XCI7XG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09IDApIHJldHVybiBKU09OLnBhcnNlKGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcbiAgICBjcmVhdGVDb29raWUobmFtZSwgXCJcIiwgLTEpO1xufVxuXG52YXIgYWRkUHJvZHVjdFRvQ2FydCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcm9kdWN0ID0ge1xuICAgICAgICBwYXRoOiBwcm9kdWN0c1twcm9kdWN0SWRdLnNyYyxcbiAgICAgICAgcHJpY2U6IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2UsXG4gICAgICAgIHNpemU6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc2l6ZSxcbiAgICAgICAgaWQ6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uaWQsXG4gICAgICAgIGFtb3VudDogMVxuICAgIH07XG5cbiAgICBjYXJ0QXJyYXkucHVzaChwcm9kdWN0KTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG5cbn07XG5cbnZhciByZW5kZXJDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKS5lbXB0eSgpO1xuICAgIHZhciBidXR0b25zV3JhcHBlciA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2J1dHRvbnMtd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wbHVzLWJ1dHRvblwiPiYjNDM7PC9kaXY+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvblwiPiYjNDU7PC9kaXY+PC9kaXY+Jyk7XG4gICAgdmFyIGRlbGV0ZUJ1dHRvbiA9ICgnPGJ1dHRvbiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2RlbGV0ZS1idXR0b25cIj5kZWxldGU8L2J1dHRvbj4nKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9kdWN0UGhvdG8gPSAoJzxpbWcgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXBob3RvXCIgc3JjPVwiJyArIGNhcnRBcnJheVtpXS5wYXRoICsgJ1wiPicpO1xuICAgICAgICB2YXIgcHJvZHVjdEFtb3VudCA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtYW1vdW50XCI+PHNwYW4+JyArIGNhcnRBcnJheVtpXS5hbW91bnQgKyAnPC9zcGFuPicgKyBidXR0b25zV3JhcHBlciArICc8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcHJpY2VcIj4kJyArIChjYXJ0QXJyYXlbaV0ucHJpY2UgKiBjYXJ0QXJyYXlbaV0uYW1vdW50KSArICcgPC9kaXY+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtc2l6ZVwiPicgKyBjYXJ0QXJyYXlbaV0uc2l6ZSArICc8L2Rpdj4nKTtcblxuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpXG4gICAgICAgICAgICAucHJlcGVuZCgnIDxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXJcIiBkYXRhLWlkPScgKyBjYXJ0QXJyYXlbaV0uaWQgKyAnPicgKyBwcm9kdWN0UGhvdG8gKyBwcm9kdWN0U2l6ZSArIHByb2R1Y3RBbW91bnQgKyBwcm9kdWN0UHJpY2UgKyBkZWxldGVCdXR0b24gKyAnPC9kaXY+Jyk7XG5cbiAgICB9XG59O1xuXG52YXIgdG90YWxTdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbGl2ZXJ5UHJpY2UgPSBwYXJzZUludCgkKCcuc2hvcHBpbmctbGlzdF9fZGVsaXZlcnktcHJpY2UnKS50ZXh0KCkpO1xuICAgIHZhciB0b3RhbFN1bSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG90YWxTdW0gKz0gcGFyc2VJbnQoY2FydEFycmF5W2ldLnByaWNlICogY2FydEFycmF5W2ldLmFtb3VudCk7XG4gICAgfVxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGl2ZXJ5UHJpY2UgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gJyQnICsgKHRvdGFsU3VtICsgZGVsaXZlcnlQcmljZSk7XG59O1xuXG4vLyBBcnJheSBSZW1vdmUgLSBCeSBKb2huIFJlc2lnIChNSVQgTGljZW5zZWQpXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XG59O1xuXG52YXIgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGNhcnRBcnJheS5pbmRleE9mKGNhcnRBcnJheVtpXSk7XG4gICAgICAgICAgICBjYXJ0QXJyYXkucmVtb3ZlKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJlbmRlckNhcnQoKTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG5cbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgIH1cbn07XG5cbnZhciBzdW1PZlByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdW1PZlByb2R1Y3RzID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdW1PZlByb2R1Y3RzICs9IGNhcnRBcnJheVtpXS5hbW91bnQ7XG4gICAgfVxuICAgIHJldHVybiBzdW1PZlByb2R1Y3RzO1xufTtcblxudmFyIGluY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJDYXJ0KCk7XG59O1xuXG52YXIgZGVjcmVhc2VBbW91bnRPZlByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudC0tO1xuICAgICAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5hbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyQ2FydCgpO1xuXG59O1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fcGx1cy1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgaW5jcmVhc2VBbW91bnRPZlByb2R1Y3RzKHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fbWludXMtYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMuY2xvc2VzdCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpKS5kYXRhKCdpZCcpO1xuICAgIGRlY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyhwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KHN1bU9mUHJvZHVjdHMoKSk7XG59KTtcblxuXG5pZiAoJCgnLnNob3BwaW5nLWxpc3QnKS5sZW5ndGggIT09IDApIHtcbiAgICByZW5kZXJDYXJ0KCk7XG59XG5cbmlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX2VtcHR5LWJhc2tldCcpLnNob3coKTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xufVxuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcblxuXG4vL2FkZCBwcm9kdWN0cyB0byBjYXJ0XG4kKCcucHJvZHVjdHNfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnByb2R1Y3RzX19idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJykuaW5kZXgoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cbiIsInZhciB2YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzVmFsaWQgPSB0cnVlO1xuXG4gICAgdmFyIGVtYWlsUmUgPSAvXlthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTktXSsoPzpcXC5bYS16QS1aMC05LV0rKSokLztcbiAgICB2YXIgcG9zdGFsQ29kZVJlID0gL1swLTldezJ9XFwtWzAtOV17M30vO1xuICAgIHZhciBwaG9uZU5yUmUgPSAvWzAtOV0kLztcblxuICAgIHZhciAkZW1haWwgPSAkKCcuZm9ybSBpbnB1dFt0eXBlPWVtYWlsXScpO1xuICAgIHZhciAkcG9zdGFsQ29kZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cG9zdGFsLWNvZGVdJyk7XG4gICAgdmFyICRwaG9uZU51bWJlciA9ICQoJy5mb3JtIGlucHV0W25hbWU9cGhvbmUtbnVtYmVyXScpO1xuXG4gICAgdmFyIGlzRW1haWwgPSBlbWFpbFJlLnRlc3QoJGVtYWlsLnZhbCgpKTtcbiAgICB2YXIgaXNQb3N0YWxDb2RlID0gcG9zdGFsQ29kZVJlLnRlc3QoJHBvc3RhbENvZGUudmFsKCkpO1xuICAgIHZhciBpc1Bob25lTnIgPSBwaG9uZU5yUmUudGVzdCgkcGhvbmVOdW1iZXIudmFsKCkpO1xuXG4gICAgJCgnLmZvcm0gaW5wdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJycpIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkZW1haWwuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNFbWFpbCkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRwb3N0YWxDb2RlLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUG9zdGFsQ29kZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRwaG9uZU51bWJlci5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1Bob25lTnIgfHwgJHBob25lTnVtYmVyLnZhbCgpLmxlbmd0aCA8IDkpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoaXNWYWxpZCAmJiBpc0VtYWlsICYmIGlzUG9zdGFsQ29kZSAmJiBpc1Bob25lTnIpIHtcbiAgICAgICAgJCgnLmFkZHJlc3MtZGF0YScpLmhpZGUoKTtcbiAgICAgICAgY29tcGxldGVTaGlwcGluZ0FkZHJlc3MoKTtcbiAgICAgICAgJCgnLmNvbnRhaW5lci0tZm9ybScpLnNob3coKTtcbiAgICB9XG59O1xuXG4vL3JlYWQgaW4gYSBmb3JtJ3MgZGF0YSBhbmQgY29udmVydCBpdCB0byBhIGtleTp2YWx1ZSBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0pIHtcbiAgICB2YXIgb3V0ID0ge307XG4gICAgdmFyIGRhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgLy90cmFuc2Zvcm0gaW50byBzaW1wbGUgZGF0YS92YWx1ZSBvYmplY3RcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IGRhdGFbaV07XG4gICAgICAgIG91dFtyZWNvcmQubmFtZV0gPSByZWNvcmQudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbiQoJy5hZGRyZXNzLWRhdGFfX2J1eS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YWxpZGF0ZUZvcm0oKTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5zaG9wcGluZy1saXN0Jyk7XG59KTtcblxuJCgnLmFkZHJlc3MtZGF0YV9fZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICAkKCcubW9kYWwtYm94LS1mb3JtJykuc2hvdygpO1xuICAgIHZhciBmb3JtRGF0YSA9IGdldEZvcm1EYXRhKCcjYWRkcmVzcy1kYXRhJyk7XG4gICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xufSk7IiwidmFyIHRvZ2dsZUZpeGVkRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZmlsdGVyID0gJCgnLmZpbHRlcicpO1xuXG4gICAgaWYgKCEkZmlsdGVyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgdmFyIGZpbHRlck9mZnNldCA9ICRmaWx0ZXIucGFyZW50KCkub2Zmc2V0KCkudG9wO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID49IGZpbHRlck9mZnNldCkge1xuICAgICAgICAkZmlsdGVyLmFkZENsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGZpbHRlci5yZW1vdmVDbGFzcygnZmlsdGVyLS1maXhlZCcpO1xuICAgIH1cbn07XG5cbnZhciBzZXRGaWx0ZXJNYXhIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCQoJy5maWx0ZXInKS5oZWlnaHQoKSA+ICQod2luZG93KS5oZWlnaHQoKSkge1xuICAgICAgICAkKCcuZmlsdGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJCh3aW5kb3cpLmhlaWdodCgpKVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG4gICAgfVxufTtcblxudmFyIGZpbHRlcmVkUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLmhpZGUoKTtcbiAgICAkKCcucHJvZHVjdHNfX3dyYXBwZXInKS5odG1sKCcnKTtcbiAgICB2YXIgbWF4ID0gcGFyc2VJbnQoJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKCkpO1xuICAgIHZhciBtaW4gPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1pbl0nKS52YWwoKSk7XG5cbiAgICB2YXIgY29sb3JBcnJheSA9IG1ha2VDb2xvckFycmF5KCk7XG4gICAgdmFyIHNpemVBcnJheSA9IG1ha2VTaXplQXJyYXkoKTtcbiAgICB2YXIgZmFicmljc0FycmF5ID0gbWFrZUZhYnJpY3NBcnJheSgpO1xuICAgIHZhciBmaWx0ZXJlZCA9IHByb2R1Y3RzO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlCbGluZ1ByaWNlcyhmaWx0ZXJlZCwgbWluLCBtYXgpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlDb2xvcnMoZmlsdGVyZWQsIGNvbG9yQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlTaXplcyhmaWx0ZXJlZCwgc2l6ZUFycmF5KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5RmFicmljcyhmaWx0ZXJlZCwgZmFicmljc0FycmF5KTtcbiAgICByZW5kZXJQcm9kdWN0cyhmaWx0ZXJlZCk7XG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLnNob3coKTtcbiAgICB9XG59O1xuXG4vL2ZpbHRlciBwcm9kdWN0c1xudmFyIGZpbHRlckJ5QmxpbmdQcmljZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnByaWNlID49IG1pbiAmJiB2YWx1ZS5wcmljZSA8PSBtYXg7XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlDb2xvcnMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIGNvbG9yQXJyYXkpIHtcbiAgICBpZiAoY29sb3JBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jb2xvciA9PT0gY29sb3JBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlTaXplcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgc2l6ZUFycmF5KSB7XG4gICAgaWYgKHNpemVBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLnNpemUgPT09IHNpemVBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlGYWJyaWNzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBmYWJyaWNBcnJheSkge1xuICAgIGlmIChmYWJyaWNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhYnJpY0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuZmFicmljID09PSBmYWJyaWNBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cbi8vZmlsdGVyIGFycmF5c1xudmFyIG1ha2VDb2xvckFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZENvbG9ycyA9IFtdO1xuICAgICQoJy5jb2xvcnMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZENvbG9ycy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZENvbG9ycztcbn07XG5cbnZhciBtYWtlU2l6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZFNpemVzID0gW107XG4gICAgJCgnLnNpemVzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRTaXplcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZFNpemVzO1xufTtcblxudmFyIG1ha2VGYWJyaWNzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmFicmljcyA9IFtdO1xuICAgICQoJy5mYWJyaWNzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRGYWJyaWNzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkRmFicmljcztcbn07XG5cbiQoJy5maWx0ZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWx0ZXJlZFByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xufSk7XG5cbnNldEZpbHRlck1heEhlaWdodCgpO1xuXG4kKCcuZmlsdGVyX190aXRsZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpc2libGVDbGFzcyA9ICdmaWx0ZXJfX3dyYXBwZXItLXZpc2libGUnO1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICdmaWx0ZXJfX3RpdGxlLS1hY3RpdmUnO1xuICAgICQoJy5maWx0ZXJfX3dyYXBwZXInKS5mYWRlVG9nZ2xlKHZpc2libGVDbGFzcyk7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG59KTtcblxuJCgnLmZpbHRlcl9fcmVzZXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICAkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoMTAwKTtcbiAgICAkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1pbl0nKS52YWwoMCk7XG4gICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5oaWRlKCk7XG59KTtcbiIsImZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0ge2xhdDogNTEuMTAyMDc1LCBsbmc6IDE3LjA0OTI2Mn07XG4gICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDE1LFxuICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgbWFwVHlwZUNvbnRyb2w6IHRydWUsXG4gICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlLFxuICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogdHJ1ZVxuICAgIH0pO1xuICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBtYXA6IG1hcFxuICAgIH0pO1xufVxuIiwidmFyIGZpeE1vZGFsQm94UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnRIZWlnaHQgPSAkKCcubW9kYWwtYm94X19jb250ZW50JykuaGVpZ2h0KCk7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAkKCcubW9kYWwtYm94X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ21vZGFsLWJveF9fY29udGVudC0tbGFyZ2UnLCBjb250ZW50SGVpZ2h0ID4gd2luZG93SGVpZ2h0KTtcbn07XG5cbiQoJy5tb2RhbC1ib3hfX3Nob3BwaW5nLWJ1dHRvbiwgLm1vZGFsLWJveF9fY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5tb2RhbC1ib3gnKS5oaWRlKCk7XG59KTtcbiIsIiQoJy5uYXZfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICduYXZfX2J1dHRvbi0tYWN0aXZlJztcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKGJ1dHRvbkFjdGl2ZUNsYXNzKTtcbiAgICAkKCcubmF2X19tZW51JykudG9nZ2xlQ2xhc3MoJ3Zpc2libGUnKTtcbn0pOyIsInZhciBmaXhQcmV2aWV3UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnRIZWlnaHQgPSAkKCcucHJldmlld19fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS50b2dnbGVDbGFzcygncHJldmlld19fY29udGVudC0tbGFyZ2UnLCBjb250ZW50SGVpZ2h0ID4gd2luZG93SGVpZ2h0KTtcbn07XG5cbnZhciBzaG93UHJldmlldyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICB2YXIgcGhvdG9TcmMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNyYztcbiAgICB2YXIgcHJvZHVjdEZhYnJpYyA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZmFicmljO1xuICAgIHZhciBwcm9kdWN0U2l6ZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc2l6ZTtcbiAgICB2YXIgcHJvZHVjdFByaWNlID0gcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZTtcbiAgICB2YXIgcHJvZHVjdFRpdGxlID0gcHJvZHVjdHNbcHJvZHVjdElkXS50aXRsZTtcbiAgICB2YXIgcHJvZHVjdERlc2NyaXB0aW9uID0gcHJvZHVjdHNbcHJvZHVjdElkXS5kZXNjcmlwdGlvbjtcblxuICAgICQoJy5wcmV2aWV3Jykuc2hvdygpO1xuICAgICQoJy5wcmV2aWV3X19waG90by1pdGVtJykuYXR0cignc3JjJywgcGhvdG9TcmMpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LWZhYnJpYyBzcGFuJykudGV4dChwcm9kdWN0RmFicmljKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1zaXplIHNwYW4nKS50ZXh0KHByb2R1Y3RTaXplKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1wcmljZSBzcGFuJykudGV4dCgnJCcgKyBwcm9kdWN0UHJpY2UpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXRpdGxlJykudGV4dChwcm9kdWN0VGl0bGUpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LWRlc2NyaXB0aW9uLXRleHQnKS50ZXh0KHByb2R1Y3REZXNjcmlwdGlvbik7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcsIHByb2R1Y3RzW3Byb2R1Y3RJZF0uaWQpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgncHJpY2UnLCBwcm9kdWN0UHJpY2UpO1xuXG4gICAgZml4UHJldmlld1Bvc2l0aW9uKCk7XG59O1xuXG4kKCcucHJvZHVjdHNfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnByb2R1Y3RzX19wcmV2aWV3JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpLmluZGV4KCk7XG4gICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbn0pO1xuXG4kKCcucHJldmlld19fbmV4dC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpICsgMTtcbiAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hvd1ByZXZpZXcoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbiAgICB9XG59KTtcblxuJCgnLnByZXZpZXdfX3ByZXYtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSAtIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gLTEpIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdHMubGVuZ3RoIC0gMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbiAgICB9XG59KTtcblxuJCgnLnByZXZpZXdfX2Nsb3NlLWJ1dHRvbiwgLnByZXZpZXdfX3Nob3BwaW5nLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbn0pO1xuXG4kKCcucHJldmlld19fYmFza2V0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJyk7XG4gICAgYWRkUHJvZHVjdFRvQ2FydChwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuICAgICQoJy5wcmV2aWV3JykuaGlkZSgpO1xuICAgICQoJy5tb2RhbC1ib3gnKS5zaG93KCk7XG59KTsiLCJ2YXIgcHJvZHVjdHM7XG52YXIgcHJvZHVjdHNXcmFwcGVyID0gJCgnLnByb2R1Y3RzX193cmFwcGVyJyk7XG5cbnZhciByZW5kZXJQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuICAgIHByb2R1Y3RzV3JhcHBlci5odG1sKCcnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9kdWN0SXRlbSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ3Byb2R1Y3RzX19pdGVtJyxcbiAgICAgICAgICAgICdkYXRhLWNvbG9yJzogcHJvZHVjdHNbaV0uY29sb3IsXG4gICAgICAgICAgICAnZGF0YS1zaXplJzogcHJvZHVjdHNbaV0uc2l6ZSxcbiAgICAgICAgICAgICdkYXRhLWZhYnJpYyc6IHByb2R1Y3RzW2ldLmZhYnJpYyxcbiAgICAgICAgICAgICdkYXRhLXByaWNlJzogcHJvZHVjdHNbaV0ucHJpY2VcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW1hZ2UgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19fcGhvdG8nLFxuICAgICAgICAgICAgJ3N0eWxlJzogJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgcHJvZHVjdHNbaV0uc3JjICsgJyknXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdFRpdGxlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX190aXRsZSd9KS50ZXh0KHByb2R1Y3RzW2ldLnRpdGxlKTtcbiAgICAgICAgdmFyIHByb2R1Y3RJbmZvID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19pbmZvJ30pO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemVMYWJlbCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fc2l6ZS1sYWJlbCd9KS50ZXh0KCdzaXplOiAnKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplID0gJCgnPHNwYW4+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fc2l6ZSd9KS50ZXh0KHByb2R1Y3RzW2ldLnNpemUpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3ByaWNlLWxhYmVsJ30pLnRleHQoJ3ByaWNlOiAnKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3ByaWNlJ30pLnRleHQoJyQnICsgcHJvZHVjdHNbaV0ucHJpY2UpO1xuICAgICAgICB2YXIgcHJvZHVjdERlc2NyaXB0aW9uID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19kZXNjcmlwdGlvbid9KS50ZXh0KHByb2R1Y3RzW2ldLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgdmFyIHByb2R1Y3RCdXR0b24gPSAkKCc8YnV0dG9uIGNsYXNzPVwicHJvZHVjdHNfX2J1dHRvblwiPmFkZCB0byBjYXJ0PC9idXR0b24+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJldmlldyA9ICQoJzxkaXYgY2xhc3M9XCJwcm9kdWN0c19fcHJldmlld1wiPjxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPjwvZGl2PicpO1xuXG4gICAgICAgIHByb2R1Y3RzV3JhcHBlci5hcHBlbmQocHJvZHVjdEl0ZW0pO1xuICAgICAgICBwcm9kdWN0SXRlbVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0SW1hZ2UpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RUaXRsZSlcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEluZm8pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3REZXNjcmlwdGlvbilcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEJ1dHRvbilcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByZXZpZXcpO1xuICAgICAgICBwcm9kdWN0SW5mb1xuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0U2l6ZUxhYmVsKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0UHJpY2VMYWJlbCk7XG4gICAgICAgIHByb2R1Y3RTaXplTGFiZWwuYXBwZW5kKHByb2R1Y3RTaXplKTtcbiAgICAgICAgcHJvZHVjdFByaWNlTGFiZWwuYXBwZW5kKHByb2R1Y3RQcmljZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb2R1Y3RzT25QYWdlID0gJCgnLnByb2R1Y3RzX193cmFwcGVyIC5wcm9kdWN0c19faXRlbScpO1xuICAgIHByb2R1Y3RzT25QYWdlLmhpZGUoKTtcbiAgICBwcm9kdWN0c09uUGFnZS5zbGljZSgwLCA0KS5zaG93KCk7XG4gICAgaWYgKHByb2R1Y3RzT25QYWdlLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgIH1cbn07XG5cbnZhciBsb2FkUHJvZHVjdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnZGIvcHJvZHVjdHMuanNvbicsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBwcm9kdWN0cyA9IHJlc3BvbnNlLnByb2R1Y3RzO1xuICAgICAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG59O1xuXG4vL3Nob3cgbmV4dCBwcm9kdWN0c1xudmFyIHNob3dOZXh0UHJvZHVjdHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBpdGVtcyA9ICQoZWxlbWVudCk7XG4gICAgdmFyIG5leHRJdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIDQpO1xuXG4gICAgaWYgKG5leHRJdGVtcy5sZW5ndGggPCA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgICAgICQoJy5ibG9nX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBuZXh0SXRlbXMuc2hvdygpO1xufTtcblxubG9hZFByb2R1Y3RzKCk7XG5cbiQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2hvd05leHRQcm9kdWN0cygnLnByb2R1Y3RzX193cmFwcGVyIC5wcm9kdWN0c19faXRlbTpoaWRkZW4nKTtcbn0pOyIsInZhciBzY3JvbGxUb0VsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciAkdGFyZ2V0RWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgdmFyIHBvc2l0aW9uID0gJHRhcmdldEVsZW1lbnQub2Zmc2V0KCkudG9wO1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IHBvc2l0aW9ufSwgMTUwMCk7XG59O1xuXG4kKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICB0b2dnbGVCYWNrVG9Ub3BCdXR0b24oKTtcbiAgICB0b2dnbGVGaXhlZEZpbHRlcigpO1xufSk7XG5cbiQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICBzZXRGaWx0ZXJNYXhIZWlnaHQoKTtcbn0pOyIsInZhciBjb21wbGV0ZVNoaXBwaW5nQWRkcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGUgPSAkKCcuZm9ybSBzZWxlY3QnKS52YWwoKTtcbiAgICB2YXIgZmlyc3ROYW1lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1maXJzdC1uYW1lXScpLnZhbCgpO1xuICAgIHZhciBsYXN0TmFtZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9bGFzdC1uYW1lXScpLnZhbCgpO1xuICAgIHZhciBzdHJlZXQgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXN0cmVldF0nKS52YWwoKTtcbiAgICB2YXIgaG9tZU5yID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1ob21lLW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgZmxhdE5yID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1mbGF0LW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgcG9zdGFsQ29kZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cG9zdGFsLWNvZGVdJykudmFsKCk7XG4gICAgdmFyIGNpdHkgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWNpdHldJykudmFsKCk7XG4gICAgdmFyIGNvdW50cnkgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWNvdW50cnldJykudmFsKCk7XG4gICAgdmFyIHBob25lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1waG9uZS1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIGVtYWlsID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1lbWFpbF0nKS52YWwoKTtcblxuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19uYW1lJykudGV4dCh0aXRsZSArICcgJyArIGZpcnN0TmFtZSArICcgJyArIGxhc3ROYW1lKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fc3RyZWV0JykudGV4dChzdHJlZXQgKyAnICcgKyBob21lTnIgKyAnICcgKyBmbGF0TnIpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19wb3N0YWwtY29kZScpLnRleHQocG9zdGFsQ29kZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2NpdHknKS50ZXh0KGNpdHkpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19jb3VudHJ5JykudGV4dChjb3VudHJ5KTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fcGhvbmUnKS50ZXh0KHBob25lKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fZW1haWwnKS50ZXh0KGVtYWlsKTtcbn07XG5cbiQoJy5zaGlwcGluZy1hZGRyZXNzX19lZGl0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuYWRkcmVzcy1kYXRhJykuc2hvdygpO1xuICAgICQoJy5hZGRyZXNzLWRhdGFfX2dvLWJhY2stYnV0dG9uJykuaGlkZSgpO1xuICAgICQoJy5jYXJ0LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgc2Nyb2xsVG9FbGVtZW50KCcuYWRkcmVzcy1kYXRhJyk7XG59KTtcbiIsInZhciBjaGFuZ2VBY3RpdmVEb3QgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAkKCcuc2xpZGVyX19kb3QnKVxuICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgIC5hZGRDbGFzcygnc2xpZGVyX19kb3QtLWFjdGl2ZScpXG4gICAgICAgIC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2RvdC0tYWN0aXZlJyk7XG59O1xuXG52YXIgY2hhbmdlQWN0aXZlUGhvdG8gPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAkKCcuc2xpZGVyX19zbGlkZScpXG4gICAgICAgIC5lcShpbmRleClcbiAgICAgICAgLmFkZENsYXNzKCdzbGlkZXJfX3NsaWRlLS1hY3RpdmUnKVxuICAgICAgICAuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2xpZGVyX19zbGlkZS0tYWN0aXZlJyk7XG59O1xuXG52YXIgZ2V0Q3VycmVudFBob3RvSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoJy5zbGlkZXJfX3NsaWRlLnNsaWRlcl9fc2xpZGUtLWFjdGl2ZScpLmluZGV4KCk7XG59O1xuXG52YXIgb25Eb3RDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNsZWFySW50ZXJ2YWwoYXV0b1NsaWRlKTtcbiAgICBjaGFuZ2VBY3RpdmVEb3QoJCh0aGlzKS5pbmRleCgpKTtcbiAgICBjaGFuZ2VBY3RpdmVQaG90bygkKHRoaXMpLmluZGV4KCkpO1xuICAgIGN1cnJlbnRJbmRleCA9IGdldEN1cnJlbnRQaG90b0luZGV4KCk7XG4gICAgc3RhcnRTbGlkZXNob3coKTtcbn07XG5cbnZhciBhdXRvU2xpZGU7XG52YXIgY3VycmVudEluZGV4ID0gMDtcbnZhciBwaG90b3MgPSAkKCcuc2xpZGVyX19zbGlkZScpO1xuXG52YXIgc3RhcnRTbGlkZXNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgYXV0b1NsaWRlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBjdXJyZW50SW5kZXgrKztcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IHBob3Rvcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5nZUFjdGl2ZVBob3RvKGN1cnJlbnRJbmRleCk7XG4gICAgICAgIGNoYW5nZUFjdGl2ZURvdChjdXJyZW50SW5kZXgpO1xuXG4gICAgfSwgNTAwMCk7XG59O1xuXG5zdGFydFNsaWRlc2hvdygpO1xuXG4kKCcuc2xpZGVyX19kb3QnKS5vbignY2xpY2snLCBvbkRvdENsaWNrKTsiXX0=
