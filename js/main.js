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
    $('.shopping-list__product-wrapper').remove();
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
    $('.shopping-list__product-total-price span').text(totalSum());
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
    $('.shopping-list__product-total-price span').text(totalSum());
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
        scrollToElement('.shopping-list');
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

if ($(window).width() > 920) {
    var filterHeight = $('.filter').height();
    $('.container__sidebar').css('height', filterHeight);
}


$('.filter__button').on('click', function () {
    filteredProducts(products);
    scrollToElement('.products__wrapper');
});

setFilterMaxHeight();

$('.filter__title-button').on('click', function () {
    var visibleClass = 'filter__wrapper--visible';
    var buttonActiveClass = 'filter__title-button--active';
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
    $('.container--form').hide();
    scrollToElement('.address-data');
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9nZ2xlQmFja1RvVG9wQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW51SGVpZ2h0ID0gJCgnLm5hdicpLmhlaWdodCgpO1xuICAgIHZhciBkb2N1bWVudFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID4gbWVudUhlaWdodCkge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLmhpZGUoKTtcbiAgICB9XG59O1xuXG4kKCcuYmFjay10by10b3BfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDE1MDApO1xufSk7XG4iLCJ2YXIgcmVuZGVyRW50cmllcyA9IGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgdmFyIGJsb2dXcmFwcGVyID0gJCgnLmJsb2dfX3dyYXBwZXInKTtcbiAgICBibG9nV3JhcHBlci5lbXB0eSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZW50cnkgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeScsXG4gICAgICAgICAgICAnZGF0YS1pZCc6IGVudHJpZXNbaV0uaWRcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyeVBob3RvID0gJCgnPGltZz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiBcImJsb2dfX2VudHJ5LXBob3RvXCIsXG4gICAgICAgICAgICAnc3JjJzogZW50cmllc1tpXS5pbWdfc3JjXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cmllc1dyYXBwZXIgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeS13cmFwcGVyJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5VGl0bGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktdGl0bGUnfSkudGV4dChlbnRyaWVzW2ldLnRpdGxlKTtcbiAgICAgICAgdmFyIGVudHJ5VGV4dCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10ZXh0J30pLnRleHQoZW50cmllc1tpXS50ZXh0KTtcbiAgICAgICAgdmFyIGVudHJ5RGF0ZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS1kYXRlJ30pLnRleHQoZW50cmllc1tpXS5kYXRlKTtcbiAgICAgICAgdmFyIGVudHJ5QnV0dG9uID0gJCgnPGJ1dHRvbj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2J1dHRvbid9KS50ZXh0KCdyZWFkIG1vcmUnKTtcblxuICAgICAgICBibG9nV3JhcHBlci5hcHBlbmQoZW50cnkpO1xuICAgICAgICBlbnRyeVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVBob3RvKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyaWVzV3JhcHBlcik7XG4gICAgICAgIGVudHJpZXNXcmFwcGVyXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5RGF0ZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUZXh0KVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdmFyIGVudHJpZXNPblBhZ2UgPSAkKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnknKTtcbiAgICBlbnRyaWVzT25QYWdlLmhpZGUoKTtcbiAgICBlbnRyaWVzT25QYWdlLnNsaWNlKDAsIDMpLnNob3coKTtcbiAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykuc2hvdygpO1xufTtcblxudmFyIGxvYWRFbnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL2VudHJpZXMuanNvbicsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZW5kZXJFbnRyaWVzKHJlc3BvbnNlLmVudHJpZXMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxubG9hZEVudHJpZXMoKTtcblxuJCgnLmJsb2dfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5ibG9nX193cmFwcGVyIC5ibG9nX19lbnRyeTpoaWRkZW4nKTtcbn0pO1xuIiwidmFyIGNhcnRBcnJheSA9IHJlYWRDb29raWUoJ2NhcnQnKSB8fCBbXTtcblxuLy8gY29va2llc1xuZnVuY3Rpb24gY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG4gICAgdmFyIGV4cGlyZXMgPSBcIlwiO1xuICAgIGlmIChkYXlzKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgICAgIGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcbn1cblxuZnVuY3Rpb24gcmVhZENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT0gMCkgcmV0dXJuIEpTT04ucGFyc2UoYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXJhc2VDb29raWUobmFtZSkge1xuICAgIGNyZWF0ZUNvb2tpZShuYW1lLCBcIlwiLCAtMSk7XG59XG5cbnZhciBhZGRQcm9kdWN0VG9DYXJ0ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudCsrO1xuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb2R1Y3QgPSB7XG4gICAgICAgIHBhdGg6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjLFxuICAgICAgICBwcmljZTogcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZSxcbiAgICAgICAgc2l6ZTogcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplLFxuICAgICAgICBpZDogcHJvZHVjdHNbcHJvZHVjdElkXS5pZCxcbiAgICAgICAgYW1vdW50OiAxXG4gICAgfTtcblxuICAgIGNhcnRBcnJheS5wdXNoKHByb2R1Y3QpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcblxufTtcblxudmFyIHJlbmRlckNhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpLnJlbW92ZSgpO1xuICAgIHZhciBidXR0b25zV3JhcHBlciA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2J1dHRvbnMtd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wbHVzLWJ1dHRvblwiPiYjNDM7PC9kaXY+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvblwiPiYjNDU7PC9kaXY+PC9kaXY+Jyk7XG4gICAgdmFyIGRlbGV0ZUJ1dHRvbiA9ICgnPGJ1dHRvbiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX2RlbGV0ZS1idXR0b25cIj5kZWxldGU8L2J1dHRvbj4nKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9kdWN0UGhvdG8gPSAoJzxpbWcgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXBob3RvXCIgc3JjPVwiJyArIGNhcnRBcnJheVtpXS5wYXRoICsgJ1wiPicpO1xuICAgICAgICB2YXIgcHJvZHVjdEFtb3VudCA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtYW1vdW50XCI+PHNwYW4+JyArIGNhcnRBcnJheVtpXS5hbW91bnQgKyAnPC9zcGFuPicgKyBidXR0b25zV3JhcHBlciArICc8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcHJpY2VcIj4kJyArIChjYXJ0QXJyYXlbaV0ucHJpY2UgKiBjYXJ0QXJyYXlbaV0uYW1vdW50KSArICcgPC9kaXY+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICgnPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtc2l6ZVwiPicgKyBjYXJ0QXJyYXlbaV0uc2l6ZSArICc8L2Rpdj4nKTtcblxuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpXG4gICAgICAgICAgICAucHJlcGVuZCgnIDxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXJcIiBkYXRhLWlkPScgKyBjYXJ0QXJyYXlbaV0uaWQgKyAnPicgKyBwcm9kdWN0UGhvdG8gKyBwcm9kdWN0U2l6ZSArIHByb2R1Y3RBbW91bnQgKyBwcm9kdWN0UHJpY2UgKyBkZWxldGVCdXR0b24gKyAnPC9kaXY+Jyk7XG5cbiAgICB9XG59O1xuXG52YXIgdG90YWxTdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbGl2ZXJ5UHJpY2UgPSBwYXJzZUludCgkKCcuc2hvcHBpbmctbGlzdF9fZGVsaXZlcnktcHJpY2UnKS50ZXh0KCkpO1xuICAgIHZhciB0b3RhbFN1bSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG90YWxTdW0gKz0gcGFyc2VJbnQoY2FydEFycmF5W2ldLnByaWNlICogY2FydEFycmF5W2ldLmFtb3VudCk7XG4gICAgfVxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGl2ZXJ5UHJpY2UgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gJyQnICsgKHRvdGFsU3VtICsgZGVsaXZlcnlQcmljZSk7XG59O1xuXG4vLyBBcnJheSBSZW1vdmUgLSBCeSBKb2huIFJlc2lnIChNSVQgTGljZW5zZWQpXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XG59O1xuXG52YXIgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGNhcnRBcnJheS5pbmRleE9mKGNhcnRBcnJheVtpXSk7XG4gICAgICAgICAgICBjYXJ0QXJyYXkucmVtb3ZlKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJlbmRlckNhcnQoKTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG5cbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgIH1cbn07XG5cbnZhciBzdW1PZlByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdW1PZlByb2R1Y3RzID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdW1PZlByb2R1Y3RzICs9IGNhcnRBcnJheVtpXS5hbW91bnQ7XG4gICAgfVxuICAgIHJldHVybiBzdW1PZlByb2R1Y3RzO1xufTtcblxudmFyIGluY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG59O1xuXG52YXIgZGVjcmVhc2VBbW91bnRPZlByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudC0tO1xuICAgICAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5hbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuICAgICAgICB9XG4gICAgfVxuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgIHJlbmRlckNhcnQoKTtcblxufTtcblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX3BsdXMtYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMuY2xvc2VzdCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpKS5kYXRhKCdpZCcpO1xuICAgIGluY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyhwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KHN1bU9mUHJvZHVjdHMoKSk7XG59KTtcblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWNyZWFzZUFtb3VudE9mUHJvZHVjdHMocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cblxuaWYgKCQoJy5zaG9wcGluZy1saXN0JykubGVuZ3RoICE9PSAwKSB7XG4gICAgcmVuZGVyQ2FydCgpO1xufVxuXG5pZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX2J1eS1idXR0b24nKS5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcbn1cblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX2RlbGV0ZS1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQocHJvZHVjdElkKTtcbn0pO1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KHN1bU9mUHJvZHVjdHMoKSk7XG5cblxuLy9hZGQgcHJvZHVjdHMgdG8gY2FydFxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpLmluZGV4KCk7XG4gICAgJCgnLm1vZGFsLWJveCcpLnNob3coKTtcbiAgICBhZGRQcm9kdWN0VG9DYXJ0KHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuXG4iLCJ2YXIgdmFsaWRhdGVGb3JtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIHZhciBlbWFpbFJlID0gL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05LV0rKD86XFwuW2EtekEtWjAtOS1dKykqJC87XG4gICAgdmFyIHBvc3RhbENvZGVSZSA9IC9bMC05XXsyfVxcLVswLTldezN9LztcbiAgICB2YXIgcGhvbmVOclJlID0gL1swLTldJC87XG5cbiAgICB2YXIgJGVtYWlsID0gJCgnLmZvcm0gaW5wdXRbdHlwZT1lbWFpbF0nKTtcbiAgICB2YXIgJHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpO1xuICAgIHZhciAkcGhvbmVOdW1iZXIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKTtcblxuICAgIHZhciBpc0VtYWlsID0gZW1haWxSZS50ZXN0KCRlbWFpbC52YWwoKSk7XG4gICAgdmFyIGlzUG9zdGFsQ29kZSA9IHBvc3RhbENvZGVSZS50ZXN0KCRwb3N0YWxDb2RlLnZhbCgpKTtcbiAgICB2YXIgaXNQaG9uZU5yID0gcGhvbmVOclJlLnRlc3QoJHBob25lTnVtYmVyLnZhbCgpKTtcblxuICAgICQoJy5mb3JtIGlucHV0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpID09ICcnKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJGVtYWlsLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzRW1haWwpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcG9zdGFsQ29kZS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1Bvc3RhbENvZGUpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcGhvbmVOdW1iZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQaG9uZU5yIHx8ICRwaG9uZU51bWJlci52YWwoKS5sZW5ndGggPCA5KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGlzVmFsaWQgJiYgaXNFbWFpbCAmJiBpc1Bvc3RhbENvZGUgJiYgaXNQaG9uZU5yKSB7XG4gICAgICAgICQoJy5hZGRyZXNzLWRhdGEnKS5oaWRlKCk7XG4gICAgICAgIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzKCk7XG4gICAgICAgICQoJy5jb250YWluZXItLWZvcm0nKS5zaG93KCk7XG4gICAgICAgIHNjcm9sbFRvRWxlbWVudCgnLnNob3BwaW5nLWxpc3QnKTtcbiAgICB9XG59O1xuXG4vL3JlYWQgaW4gYSBmb3JtJ3MgZGF0YSBhbmQgY29udmVydCBpdCB0byBhIGtleTp2YWx1ZSBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0pIHtcbiAgICB2YXIgb3V0ID0ge307XG4gICAgdmFyIGRhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgLy90cmFuc2Zvcm0gaW50byBzaW1wbGUgZGF0YS92YWx1ZSBvYmplY3RcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IGRhdGFbaV07XG4gICAgICAgIG91dFtyZWNvcmQubmFtZV0gPSByZWNvcmQudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbiQoJy5hZGRyZXNzLWRhdGFfX2J1eS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YWxpZGF0ZUZvcm0oKTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbn0pO1xuXG4kKCcuYWRkcmVzcy1kYXRhX19mb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgICQoJy5tb2RhbC1ib3gtLWZvcm0nKS5zaG93KCk7XG4gICAgdmFyIGZvcm1EYXRhID0gZ2V0Rm9ybURhdGEoJyNhZGRyZXNzLWRhdGEnKTtcbiAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG59KTsiLCJ2YXIgdG9nZ2xlRml4ZWRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRmaWx0ZXIgPSAkKCcuZmlsdGVyJyk7XG5cbiAgICBpZiAoISRmaWx0ZXIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZG9jdW1lbnRQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgZmlsdGVyT2Zmc2V0ID0gJGZpbHRlci5wYXJlbnQoKS5vZmZzZXQoKS50b3A7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPj0gZmlsdGVyT2Zmc2V0KSB7XG4gICAgICAgICRmaWx0ZXIuYWRkQ2xhc3MoJ2ZpbHRlci0tZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkZmlsdGVyLnJlbW92ZUNsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfVxufTtcblxudmFyIHNldEZpbHRlck1heEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCgnLmZpbHRlcicpLmhlaWdodCgpID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAkKHdpbmRvdykuaGVpZ2h0KCkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmZpbHRlcicpLmNzcygnbWF4LWhlaWdodCcsICcnKTtcbiAgICB9XG59O1xuXG52YXIgZmlsdGVyZWRQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuaGlkZSgpO1xuICAgICQoJy5wcm9kdWN0c19fd3JhcHBlcicpLmh0bWwoJycpO1xuICAgIHZhciBtYXggPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoKSk7XG4gICAgdmFyIG1pbiA9IHBhcnNlSW50KCQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWluXScpLnZhbCgpKTtcblxuICAgIHZhciBjb2xvckFycmF5ID0gbWFrZUNvbG9yQXJyYXkoKTtcbiAgICB2YXIgc2l6ZUFycmF5ID0gbWFrZVNpemVBcnJheSgpO1xuICAgIHZhciBmYWJyaWNzQXJyYXkgPSBtYWtlRmFicmljc0FycmF5KCk7XG4gICAgdmFyIGZpbHRlcmVkID0gcHJvZHVjdHM7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUJsaW5nUHJpY2VzKGZpbHRlcmVkLCBtaW4sIG1heCk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUNvbG9ycyhmaWx0ZXJlZCwgY29sb3JBcnJheSk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeVNpemVzKGZpbHRlcmVkLCBzaXplQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlGYWJyaWNzKGZpbHRlcmVkLCBmYWJyaWNzQXJyYXkpO1xuICAgIHJlbmRlclByb2R1Y3RzKGZpbHRlcmVkKTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuc2hvdygpO1xuICAgIH1cbn07XG5cbi8vZmlsdGVyIHByb2R1Y3RzXG52YXIgZmlsdGVyQnlCbGluZ1ByaWNlcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUucHJpY2UgPj0gbWluICYmIHZhbHVlLnByaWNlIDw9IG1heDtcbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeUNvbG9ycyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgY29sb3JBcnJheSkge1xuICAgIGlmIChjb2xvckFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmNvbG9yID09PSBjb2xvckFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeVNpemVzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBzaXplQXJyYXkpIHtcbiAgICBpZiAoc2l6ZUFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuc2l6ZSA9PT0gc2l6ZUFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeUZhYnJpY3MgPSBmdW5jdGlvbiAocHJvZHVjdHMsIGZhYnJpY0FycmF5KSB7XG4gICAgaWYgKGZhYnJpY0FycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmFicmljQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYWJyaWMgPT09IGZhYnJpY0FycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxuLy9maWx0ZXIgYXJyYXlzXG52YXIgbWFrZUNvbG9yQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkQ29sb3JzID0gW107XG4gICAgJCgnLmNvbG9ycyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkQ29sb3JzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkQ29sb3JzO1xufTtcblxudmFyIG1ha2VTaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkU2l6ZXMgPSBbXTtcbiAgICAkKCcuc2l6ZXMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZFNpemVzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkU2l6ZXM7XG59O1xuXG52YXIgbWFrZUZhYnJpY3NBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRGYWJyaWNzID0gW107XG4gICAgJCgnLmZhYnJpY3MgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZEZhYnJpY3MucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRGYWJyaWNzO1xufTtcblxuaWYgKCQod2luZG93KS53aWR0aCgpID4gOTIwKSB7XG4gICAgdmFyIGZpbHRlckhlaWdodCA9ICQoJy5maWx0ZXInKS5oZWlnaHQoKTtcbiAgICAkKCcuY29udGFpbmVyX19zaWRlYmFyJykuY3NzKCdoZWlnaHQnLCBmaWx0ZXJIZWlnaHQpO1xufVxuXG5cbiQoJy5maWx0ZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWx0ZXJlZFByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xufSk7XG5cbnNldEZpbHRlck1heEhlaWdodCgpO1xuXG4kKCcuZmlsdGVyX190aXRsZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpc2libGVDbGFzcyA9ICdmaWx0ZXJfX3dyYXBwZXItLXZpc2libGUnO1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICdmaWx0ZXJfX3RpdGxlLWJ1dHRvbi0tYWN0aXZlJztcbiAgICAkKCcuZmlsdGVyX193cmFwcGVyJykuZmFkZVRvZ2dsZSh2aXNpYmxlQ2xhc3MpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoYnV0dG9uQWN0aXZlQ2xhc3MpO1xufSk7XG5cbiQoJy5maWx0ZXJfX3Jlc2V0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKDEwMCk7XG4gICAgJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1taW5dJykudmFsKDApO1xuICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuaGlkZSgpO1xufSk7XG4iLCJmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHtsYXQ6IDUxLjEwMjA3NSwgbG5nOiAxNy4wNDkyNjJ9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiB0cnVlLFxuICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgbWFwOiBtYXBcbiAgICB9KTtcbn1cbiIsInZhciBmaXhNb2RhbEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLm1vZGFsLWJveF9fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLm1vZGFsLWJveF9fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdtb2RhbC1ib3hfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG4kKCcubW9kYWwtYm94X19zaG9wcGluZy1idXR0b24sIC5tb2RhbC1ib3hfX2Nsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcubW9kYWwtYm94JykuaGlkZSgpO1xufSk7XG4iLCIkKCcubmF2X19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnbmF2X19idXR0b24tLWFjdGl2ZSc7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG4gICAgJCgnLm5hdl9fbWVudScpLnRvZ2dsZUNsYXNzKCd2aXNpYmxlJyk7XG59KTsiLCJ2YXIgZml4UHJldmlld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ3ByZXZpZXdfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG52YXIgc2hvd1ByZXZpZXcgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgdmFyIHBob3RvU3JjID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zcmM7XG4gICAgdmFyIHByb2R1Y3RGYWJyaWMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLmZhYnJpYztcbiAgICB2YXIgcHJvZHVjdFNpemUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemU7XG4gICAgdmFyIHByb2R1Y3RQcmljZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2U7XG4gICAgdmFyIHByb2R1Y3RUaXRsZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0udGl0bGU7XG4gICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZGVzY3JpcHRpb247XG5cbiAgICAkKCcucHJldmlldycpLnNob3coKTtcbiAgICAkKCcucHJldmlld19fcGhvdG8taXRlbScpLmF0dHIoJ3NyYycsIHBob3RvU3JjKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1mYWJyaWMgc3BhbicpLnRleHQocHJvZHVjdEZhYnJpYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3Qtc2l6ZSBzcGFuJykudGV4dChwcm9kdWN0U2l6ZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtcHJpY2Ugc3BhbicpLnRleHQoJyQnICsgcHJvZHVjdFByaWNlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC10aXRsZScpLnRleHQocHJvZHVjdFRpdGxlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1kZXNjcmlwdGlvbi10ZXh0JykudGV4dChwcm9kdWN0RGVzY3JpcHRpb24pO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnLCBwcm9kdWN0c1twcm9kdWN0SWRdLmlkKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ3ByaWNlJywgcHJvZHVjdFByaWNlKTtcblxuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xufTtcblxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fcHJldmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG59KTtcblxuJCgnLnByZXZpZXdfX25leHQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSArIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHMubGVuZ3RoKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19wcmV2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgLSAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IC0xKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19jbG9zZS1idXR0b24sIC5wcmV2aWV3X19zaG9wcGluZy1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG59KTtcblxuJCgnLnByZXZpZXdfX2Jhc2tldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xufSk7IiwidmFyIHByb2R1Y3RzO1xudmFyIHByb2R1Y3RzV3JhcHBlciA9ICQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xuXG52YXIgcmVuZGVyUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICBwcm9kdWN0c1dyYXBwZXIuaHRtbCgnJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdEl0ZW0gPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19faXRlbScsXG4gICAgICAgICAgICAnZGF0YS1jb2xvcic6IHByb2R1Y3RzW2ldLmNvbG9yLFxuICAgICAgICAgICAgJ2RhdGEtc2l6ZSc6IHByb2R1Y3RzW2ldLnNpemUsXG4gICAgICAgICAgICAnZGF0YS1mYWJyaWMnOiBwcm9kdWN0c1tpXS5mYWJyaWMsXG4gICAgICAgICAgICAnZGF0YS1wcmljZSc6IHByb2R1Y3RzW2ldLnByaWNlXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdEltYWdlID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX3Bob3RvJyxcbiAgICAgICAgICAgICdzdHlsZSc6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIHByb2R1Y3RzW2ldLnNyYyArICcpJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fdGl0bGUnfSkudGV4dChwcm9kdWN0c1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW5mbyA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19faW5mbyd9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUtbGFiZWwnfSkudGV4dCgnc2l6ZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUnfSkudGV4dChwcm9kdWN0c1tpXS5zaXplKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZS1sYWJlbCd9KS50ZXh0KCdwcmljZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZSd9KS50ZXh0KCckJyArIHByb2R1Y3RzW2ldLnByaWNlKTtcbiAgICAgICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fZGVzY3JpcHRpb24nfSkudGV4dChwcm9kdWN0c1tpXS5kZXNjcmlwdGlvbik7XG4gICAgICAgIHZhciBwcm9kdWN0QnV0dG9uID0gJCgnPGJ1dHRvbiBjbGFzcz1cInByb2R1Y3RzX19idXR0b25cIj5hZGQgdG8gY2FydDwvYnV0dG9uPicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByZXZpZXcgPSAkKCc8ZGl2IGNsYXNzPVwicHJvZHVjdHNfX3ByZXZpZXdcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT48L2Rpdj4nKTtcblxuICAgICAgICBwcm9kdWN0c1dyYXBwZXIuYXBwZW5kKHByb2R1Y3RJdGVtKTtcbiAgICAgICAgcHJvZHVjdEl0ZW1cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEltYWdlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbmZvKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0RGVzY3JpcHRpb24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RCdXR0b24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmV2aWV3KTtcbiAgICAgICAgcHJvZHVjdEluZm9cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFNpemVMYWJlbClcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByaWNlTGFiZWwpO1xuICAgICAgICBwcm9kdWN0U2l6ZUxhYmVsLmFwcGVuZChwcm9kdWN0U2l6ZSk7XG4gICAgICAgIHByb2R1Y3RQcmljZUxhYmVsLmFwcGVuZChwcm9kdWN0UHJpY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm9kdWN0c09uUGFnZSA9ICQoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW0nKTtcbiAgICBwcm9kdWN0c09uUGFnZS5oaWRlKCk7XG4gICAgcHJvZHVjdHNPblBhZ2Uuc2xpY2UoMCwgNCkuc2hvdygpO1xuICAgIGlmIChwcm9kdWN0c09uUGFnZS5sZW5ndGggPiA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG59O1xuXG52YXIgbG9hZFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL3Byb2R1Y3RzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvZHVjdHMgPSByZXNwb25zZS5wcm9kdWN0cztcbiAgICAgICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxuLy9zaG93IG5leHQgcHJvZHVjdHNcbnZhciBzaG93TmV4dFByb2R1Y3RzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgaXRlbXMgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBuZXh0SXRlbXMgPSBpdGVtcy5zbGljZSgwLCA0KTtcblxuICAgIGlmIChuZXh0SXRlbXMubGVuZ3RoIDwgNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgICAgICAkKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgbmV4dEl0ZW1zLnNob3coKTtcbn07XG5cbmxvYWRQcm9kdWN0cygpO1xuXG4kKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW06aGlkZGVuJyk7XG59KTsiLCJ2YXIgc2Nyb2xsVG9FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgJHRhcmdldEVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBwb3NpdGlvbiA9ICR0YXJnZXRFbGVtZW50Lm9mZnNldCgpLnRvcDtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBwb3NpdGlvbn0sIDE1MDApO1xufTtcblxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdG9nZ2xlQmFja1RvVG9wQnV0dG9uKCk7XG4gICAgdG9nZ2xlRml4ZWRGaWx0ZXIoKTtcbn0pO1xuXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBmaXhQcmV2aWV3UG9zaXRpb24oKTtcbiAgICBmaXhNb2RhbEJveFBvc2l0aW9uKCk7XG4gICAgc2V0RmlsdGVyTWF4SGVpZ2h0KCk7XG59KTsiLCJ2YXIgY29tcGxldGVTaGlwcGluZ0FkZHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlID0gJCgnLmZvcm0gc2VsZWN0JykudmFsKCk7XG4gICAgdmFyIGZpcnN0TmFtZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Zmlyc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgbGFzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWxhc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgc3RyZWV0ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1zdHJlZXRdJykudmFsKCk7XG4gICAgdmFyIGhvbWVOciA9ICQoJy5mb3JtIGlucHV0W25hbWU9aG9tZS1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIGZsYXROciA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZmxhdC1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpLnZhbCgpO1xuICAgIHZhciBjaXR5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jaXR5XScpLnZhbCgpO1xuICAgIHZhciBjb3VudHJ5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jb3VudHJ5XScpLnZhbCgpO1xuICAgIHZhciBwaG9uZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cGhvbmUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBlbWFpbCA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZW1haWxdJykudmFsKCk7XG5cbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fbmFtZScpLnRleHQodGl0bGUgKyAnICcgKyBmaXJzdE5hbWUgKyAnICcgKyBsYXN0TmFtZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3N0cmVldCcpLnRleHQoc3RyZWV0ICsgJyAnICsgaG9tZU5yICsgJyAnICsgZmxhdE5yKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fcG9zdGFsLWNvZGUnKS50ZXh0KHBvc3RhbENvZGUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19jaXR5JykudGV4dChjaXR5KTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY291bnRyeScpLnRleHQoY291bnRyeSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bob25lJykudGV4dChwaG9uZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VtYWlsJykudGV4dChlbWFpbCk7XG59O1xuXG4kKCcuc2hpcHBpbmctYWRkcmVzc19fZWRpdC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmFkZHJlc3MtZGF0YScpLnNob3coKTtcbiAgICAkKCcuYWRkcmVzcy1kYXRhX19nby1iYWNrLWJ1dHRvbicpLmhpZGUoKTtcbiAgICAkKCcuY29udGFpbmVyLS1mb3JtJykuaGlkZSgpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgnLmFkZHJlc3MtZGF0YScpO1xufSk7XG4iLCIkKCcuc2xpZGVyX19pdGVtcycpLnNsaWNrKHtcbiAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgZG90czogZmFsc2UsXG4gICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcbiAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICBhcnJvd3M6IGZhbHNlLFxuICAgIGNlbnRlclBhZGRpbmc6IDAsXG4gICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICB7XG4gICAgICAgICAgICBicmVha3BvaW50OiAxMjgwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogODAwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufSk7Il19
