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
    disableBuyButton();

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
    disableBuyButton();
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
    disableBuyButton();

};

var disableBuyButton = function () {
    if (cartArray.length === 0) {
        $('.shopping-list__empty-basket').show();
        $('.shopping-list__buy-button').addClass('shopping-list__buy-button--disabled');
        $('.shipping-address__buy-button').addClass('shipping-address__buy-button--disabled');
    }
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

disableBuyButton();

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
    var dataToSend = {
        contactData: getFormData('#address-data'),
        cart: cartArray
    };
    console.log(dataToSend);
    cartArray = [];
    createCookie('cart', cartArray, 365);
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

var addHeightToContainerSidebar = function () {
    if ($(window).width() > 920) {
        var filterHeight = $('.filter').height();
        $('.container__sidebar').css('height', filterHeight);
    } else {
        $('.container__sidebar').css('height', '');
    }
};

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

addHeightToContainerSidebar();
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
    addHeightToContainerSidebar();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0b2dnbGVCYWNrVG9Ub3BCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbnVIZWlnaHQgPSAkKCcubmF2JykuaGVpZ2h0KCk7XG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPiBtZW51SGVpZ2h0KSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuaGlkZSgpO1xuICAgIH1cbn07XG5cbiQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSwgMTUwMCk7XG59KTtcbiIsInZhciByZW5kZXJFbnRyaWVzID0gZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICB2YXIgYmxvZ1dyYXBwZXIgPSAkKCcuYmxvZ19fd3JhcHBlcicpO1xuICAgIGJsb2dXcmFwcGVyLmVtcHR5KCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5JyxcbiAgICAgICAgICAgICdkYXRhLWlkJzogZW50cmllc1tpXS5pZFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5UGhvdG8gPSAkKCc8aW1nPicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6IFwiYmxvZ19fZW50cnktcGhvdG9cIixcbiAgICAgICAgICAgICdzcmMnOiBlbnRyaWVzW2ldLmltZ19zcmNcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyaWVzV3JhcHBlciA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXdyYXBwZXInXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cnlUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10aXRsZSd9KS50ZXh0KGVudHJpZXNbaV0udGl0bGUpO1xuICAgICAgICB2YXIgZW50cnlUZXh0ID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXRleHQnfSkudGV4dChlbnRyaWVzW2ldLnRleHQpO1xuICAgICAgICB2YXIgZW50cnlEYXRlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LWRhdGUnfSkudGV4dChlbnRyaWVzW2ldLmRhdGUpO1xuICAgICAgICB2YXIgZW50cnlCdXR0b24gPSAkKCc8YnV0dG9uPicsIHsnY2xhc3MnOiAnYmxvZ19fYnV0dG9uJ30pLnRleHQoJ3JlYWQgbW9yZScpO1xuXG4gICAgICAgIGJsb2dXcmFwcGVyLmFwcGVuZChlbnRyeSk7XG4gICAgICAgIGVudHJ5XG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5UGhvdG8pXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJpZXNXcmFwcGVyKTtcbiAgICAgICAgZW50cmllc1dyYXBwZXJcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUaXRsZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlEYXRlKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVRleHQpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5QnV0dG9uKTtcbiAgICB9XG5cbiAgICB2YXIgZW50cmllc09uUGFnZSA9ICQoJy5ibG9nX193cmFwcGVyIC5ibG9nX19lbnRyeScpO1xuICAgIGVudHJpZXNPblBhZ2UuaGlkZSgpO1xuICAgIGVudHJpZXNPblBhZ2Uuc2xpY2UoMCwgMykuc2hvdygpO1xuICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG59O1xuXG52YXIgbG9hZEVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnZGIvZW50cmllcy5qc29uJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJlbmRlckVudHJpZXMocmVzcG9uc2UuZW50cmllcyk7XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG59O1xuXG5sb2FkRW50cmllcygpO1xuXG4kKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2hvd05leHRQcm9kdWN0cygnLmJsb2dfX3dyYXBwZXIgLmJsb2dfX2VudHJ5OmhpZGRlbicpO1xufSk7XG4iLCJ2YXIgY2FydEFycmF5ID0gcmVhZENvb2tpZSgnY2FydCcpIHx8IFtdO1xuXG4vLyBjb29raWVzXG5mdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbiAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKGRheXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xufVxuXG5mdW5jdGlvbiByZWFkQ29va2llKG5hbWUpIHtcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PSAwKSByZXR1cm4gSlNPTi5wYXJzZShjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG4gICAgY3JlYXRlQ29va2llKG5hbWUsIFwiXCIsIC0xKTtcbn1cblxudmFyIGFkZFByb2R1Y3RUb0NhcnQgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgICAgICAgICBjYXJ0QXJyYXlbaV0uYW1vdW50Kys7XG4gICAgICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJvZHVjdCA9IHtcbiAgICAgICAgcGF0aDogcHJvZHVjdHNbcHJvZHVjdElkXS5zcmMsXG4gICAgICAgIHByaWNlOiBwcm9kdWN0c1twcm9kdWN0SWRdLnByaWNlLFxuICAgICAgICBzaXplOiBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemUsXG4gICAgICAgIGlkOiBwcm9kdWN0c1twcm9kdWN0SWRdLmlkLFxuICAgICAgICBhbW91bnQ6IDFcbiAgICB9O1xuXG4gICAgY2FydEFycmF5LnB1c2gocHJvZHVjdCk7XG4gICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzNjUpO1xuXG59O1xuXG52YXIgcmVuZGVyQ2FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykucmVtb3ZlKCk7XG4gICAgdmFyIGJ1dHRvbnNXcmFwcGVyID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fYnV0dG9ucy13cmFwcGVyXCI+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3BsdXMtYnV0dG9uXCI+JiM0Mzs8L2Rpdj48ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fbWludXMtYnV0dG9uXCI+JiM0NTs8L2Rpdj48L2Rpdj4nKTtcbiAgICB2YXIgZGVsZXRlQnV0dG9uID0gKCc8YnV0dG9uIGNsYXNzPVwic2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvblwiPmRlbGV0ZTwvYnV0dG9uPicpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb2R1Y3RQaG90byA9ICgnPGltZyBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcGhvdG9cIiBzcmM9XCInICsgY2FydEFycmF5W2ldLnBhdGggKyAnXCI+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0QW1vdW50ID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1hbW91bnRcIj48c3Bhbj4nICsgY2FydEFycmF5W2ldLmFtb3VudCArICc8L3NwYW4+JyArIGJ1dHRvbnNXcmFwcGVyICsgJzwvZGl2PicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1wcmljZVwiPiQnICsgKGNhcnRBcnJheVtpXS5wcmljZSAqIGNhcnRBcnJheVtpXS5hbW91bnQpICsgJyA8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1zaXplXCI+JyArIGNhcnRBcnJheVtpXS5zaXplICsgJzwvZGl2PicpO1xuXG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJylcbiAgICAgICAgICAgIC5wcmVwZW5kKCcgPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlclwiIGRhdGEtaWQ9JyArIGNhcnRBcnJheVtpXS5pZCArICc+JyArIHByb2R1Y3RQaG90byArIHByb2R1Y3RTaXplICsgcHJvZHVjdEFtb3VudCArIHByb2R1Y3RQcmljZSArIGRlbGV0ZUJ1dHRvbiArICc8L2Rpdj4nKTtcblxuICAgIH1cbn07XG5cbnZhciB0b3RhbFN1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVsaXZlcnlQcmljZSA9IHBhcnNlSW50KCQoJy5zaG9wcGluZy1saXN0X19kZWxpdmVyeS1wcmljZScpLnRleHQoKSk7XG4gICAgdmFyIHRvdGFsU3VtID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbFN1bSArPSBwYXJzZUludChjYXJ0QXJyYXlbaV0ucHJpY2UgKiBjYXJ0QXJyYXlbaV0uYW1vdW50KTtcbiAgICB9XG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsaXZlcnlQcmljZSA9IDA7XG4gICAgfVxuICAgIHJldHVybiAnJCcgKyAodG90YWxTdW0gKyBkZWxpdmVyeVByaWNlKTtcbn07XG5cbi8vIEFycmF5IFJlbW92ZSAtIEJ5IEpvaG4gUmVzaWcgKE1JVCBMaWNlbnNlZClcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbnZhciBkZWxldGVQcm9kdWN0RnJvbUJhc2tldCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FydEFycmF5LmluZGV4T2YoY2FydEFycmF5W2ldKTtcbiAgICAgICAgICAgIGNhcnRBcnJheS5yZW1vdmUoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcbiAgICBkaXNhYmxlQnV5QnV0dG9uKCk7XG5cbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgIH1cbn07XG5cbnZhciBzdW1PZlByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdW1PZlByb2R1Y3RzID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdW1PZlByb2R1Y3RzICs9IGNhcnRBcnJheVtpXS5hbW91bnQ7XG4gICAgfVxuICAgIHJldHVybiBzdW1PZlByb2R1Y3RzO1xufTtcblxudmFyIGluY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xufTtcblxudmFyIGRlY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQtLTtcbiAgICAgICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uYW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQocHJvZHVjdElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzY1KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG59O1xuXG52YXIgZGlzYWJsZUJ1eUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaG9wcGluZy1saXN0X19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgICAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaGlwcGluZy1hZGRyZXNzX19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgIH1cbn07XG5cbiQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJykub24oJ2NsaWNrJywgJy5zaG9wcGluZy1saXN0X19wbHVzLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBpbmNyZWFzZUFtb3VudE9mUHJvZHVjdHMocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJykub24oJ2NsaWNrJywgJy5zaG9wcGluZy1saXN0X19taW51cy1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgZGVjcmVhc2VBbW91bnRPZlByb2R1Y3RzKHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuXG5cbmlmICgkKCcuc2hvcHBpbmctbGlzdCcpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJlbmRlckNhcnQoKTtcbn1cblxuZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcblxuXG4vL2FkZCBwcm9kdWN0cyB0byBjYXJ0XG4kKCcucHJvZHVjdHNfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnByb2R1Y3RzX19idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJykuaW5kZXgoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cblxuIiwidmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG5cbiAgICB2YXIgZW1haWxSZSA9IC9eW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOS1dKyg/OlxcLlthLXpBLVowLTktXSspKiQvO1xuICAgIHZhciBwb3N0YWxDb2RlUmUgPSAvWzAtOV17Mn1cXC1bMC05XXszfS87XG4gICAgdmFyIHBob25lTnJSZSA9IC9bMC05XSQvO1xuXG4gICAgdmFyICRlbWFpbCA9ICQoJy5mb3JtIGlucHV0W3R5cGU9ZW1haWxdJyk7XG4gICAgdmFyICRwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKTtcbiAgICB2YXIgJHBob25lTnVtYmVyID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1waG9uZS1udW1iZXJdJyk7XG5cbiAgICB2YXIgaXNFbWFpbCA9IGVtYWlsUmUudGVzdCgkZW1haWwudmFsKCkpO1xuICAgIHZhciBpc1Bvc3RhbENvZGUgPSBwb3N0YWxDb2RlUmUudGVzdCgkcG9zdGFsQ29kZS52YWwoKSk7XG4gICAgdmFyIGlzUGhvbmVOciA9IHBob25lTnJSZS50ZXN0KCRwaG9uZU51bWJlci52YWwoKSk7XG5cbiAgICAkKCcuZm9ybSBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnJykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRlbWFpbC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc0VtYWlsKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBvc3RhbENvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQb3N0YWxDb2RlKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBob25lTnVtYmVyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUGhvbmVOciB8fCAkcGhvbmVOdW1iZXIudmFsKCkubGVuZ3RoIDwgOSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChpc1ZhbGlkICYmIGlzRW1haWwgJiYgaXNQb3N0YWxDb2RlICYmIGlzUGhvbmVOcikge1xuICAgICAgICAkKCcuYWRkcmVzcy1kYXRhJykuaGlkZSgpO1xuICAgICAgICBjb21wbGV0ZVNoaXBwaW5nQWRkcmVzcygpO1xuICAgICAgICAkKCcuY29udGFpbmVyLS1mb3JtJykuc2hvdygpO1xuICAgICAgICBzY3JvbGxUb0VsZW1lbnQoJy5zaG9wcGluZy1saXN0Jyk7XG4gICAgfVxufTtcblxuLy9yZWFkIGluIGEgZm9ybSdzIGRhdGEgYW5kIGNvbnZlcnQgaXQgdG8gYSBrZXk6dmFsdWUgb2JqZWN0XG5mdW5jdGlvbiBnZXRGb3JtRGF0YShmb3JtKSB7XG4gICAgdmFyIG91dCA9IHt9O1xuICAgIHZhciBkYXRhID0gJChmb3JtKS5zZXJpYWxpemVBcnJheSgpO1xuICAgIC8vdHJhbnNmb3JtIGludG8gc2ltcGxlIGRhdGEvdmFsdWUgb2JqZWN0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByZWNvcmQgPSBkYXRhW2ldO1xuICAgICAgICBvdXRbcmVjb3JkLm5hbWVdID0gcmVjb3JkLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG4kKCcuYWRkcmVzcy1kYXRhX19idXktYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFsaWRhdGVGb3JtKCk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG59KTtcblxuJCgnLmFkZHJlc3MtZGF0YV9fZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICAkKCcubW9kYWwtYm94LS1mb3JtJykuc2hvdygpO1xuICAgIHZhciBkYXRhVG9TZW5kID0ge1xuICAgICAgICBjb250YWN0RGF0YTogZ2V0Rm9ybURhdGEoJyNhZGRyZXNzLWRhdGEnKSxcbiAgICAgICAgY2FydDogY2FydEFycmF5XG4gICAgfTtcbiAgICBjb25zb2xlLmxvZyhkYXRhVG9TZW5kKTtcbiAgICBjYXJ0QXJyYXkgPSBbXTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDM2NSk7XG59KTsiLCJ2YXIgdG9nZ2xlRml4ZWRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRmaWx0ZXIgPSAkKCcuZmlsdGVyJyk7XG5cbiAgICBpZiAoISRmaWx0ZXIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZG9jdW1lbnRQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgZmlsdGVyT2Zmc2V0ID0gJGZpbHRlci5wYXJlbnQoKS5vZmZzZXQoKS50b3A7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPj0gZmlsdGVyT2Zmc2V0KSB7XG4gICAgICAgICRmaWx0ZXIuYWRkQ2xhc3MoJ2ZpbHRlci0tZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkZmlsdGVyLnJlbW92ZUNsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfVxufTtcblxudmFyIHNldEZpbHRlck1heEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCgnLmZpbHRlcicpLmhlaWdodCgpID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAkKHdpbmRvdykuaGVpZ2h0KCkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmZpbHRlcicpLmNzcygnbWF4LWhlaWdodCcsICcnKTtcbiAgICB9XG59O1xuXG52YXIgZmlsdGVyZWRQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuaGlkZSgpO1xuICAgICQoJy5wcm9kdWN0c19fd3JhcHBlcicpLmh0bWwoJycpO1xuICAgIHZhciBtYXggPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoKSk7XG4gICAgdmFyIG1pbiA9IHBhcnNlSW50KCQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWluXScpLnZhbCgpKTtcblxuICAgIHZhciBjb2xvckFycmF5ID0gbWFrZUNvbG9yQXJyYXkoKTtcbiAgICB2YXIgc2l6ZUFycmF5ID0gbWFrZVNpemVBcnJheSgpO1xuICAgIHZhciBmYWJyaWNzQXJyYXkgPSBtYWtlRmFicmljc0FycmF5KCk7XG4gICAgdmFyIGZpbHRlcmVkID0gcHJvZHVjdHM7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUJsaW5nUHJpY2VzKGZpbHRlcmVkLCBtaW4sIG1heCk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUNvbG9ycyhmaWx0ZXJlZCwgY29sb3JBcnJheSk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeVNpemVzKGZpbHRlcmVkLCBzaXplQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlGYWJyaWNzKGZpbHRlcmVkLCBmYWJyaWNzQXJyYXkpO1xuICAgIHJlbmRlclByb2R1Y3RzKGZpbHRlcmVkKTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuc2hvdygpO1xuICAgIH1cbn07XG5cbi8vZmlsdGVyIHByb2R1Y3RzXG52YXIgZmlsdGVyQnlCbGluZ1ByaWNlcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUucHJpY2UgPj0gbWluICYmIHZhbHVlLnByaWNlIDw9IG1heDtcbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeUNvbG9ycyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgY29sb3JBcnJheSkge1xuICAgIGlmIChjb2xvckFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmNvbG9yID09PSBjb2xvckFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeVNpemVzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBzaXplQXJyYXkpIHtcbiAgICBpZiAoc2l6ZUFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuc2l6ZSA9PT0gc2l6ZUFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBmaWx0ZXJCeUZhYnJpY3MgPSBmdW5jdGlvbiAocHJvZHVjdHMsIGZhYnJpY0FycmF5KSB7XG4gICAgaWYgKGZhYnJpY0FycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmFicmljQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYWJyaWMgPT09IGZhYnJpY0FycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxuLy9maWx0ZXIgYXJyYXlzXG52YXIgbWFrZUNvbG9yQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkQ29sb3JzID0gW107XG4gICAgJCgnLmNvbG9ycyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkQ29sb3JzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkQ29sb3JzO1xufTtcblxudmFyIG1ha2VTaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkU2l6ZXMgPSBbXTtcbiAgICAkKCcuc2l6ZXMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZFNpemVzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkU2l6ZXM7XG59O1xuXG52YXIgbWFrZUZhYnJpY3NBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRGYWJyaWNzID0gW107XG4gICAgJCgnLmZhYnJpY3MgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZEZhYnJpY3MucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRGYWJyaWNzO1xufTtcblxudmFyIGFkZEhlaWdodFRvQ29udGFpbmVyU2lkZWJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MjApIHtcbiAgICAgICAgdmFyIGZpbHRlckhlaWdodCA9ICQoJy5maWx0ZXInKS5oZWlnaHQoKTtcbiAgICAgICAgJCgnLmNvbnRhaW5lcl9fc2lkZWJhcicpLmNzcygnaGVpZ2h0JywgZmlsdGVySGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuY29udGFpbmVyX19zaWRlYmFyJykuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgfVxufTtcblxuJCgnLmZpbHRlcl9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGZpbHRlcmVkUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgnLnByb2R1Y3RzX193cmFwcGVyJyk7XG59KTtcblxuc2V0RmlsdGVyTWF4SGVpZ2h0KCk7XG5cbiQoJy5maWx0ZXJfX3RpdGxlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlzaWJsZUNsYXNzID0gJ2ZpbHRlcl9fd3JhcHBlci0tdmlzaWJsZSc7XG4gICAgdmFyIGJ1dHRvbkFjdGl2ZUNsYXNzID0gJ2ZpbHRlcl9fdGl0bGUtYnV0dG9uLS1hY3RpdmUnO1xuICAgICQoJy5maWx0ZXJfX3dyYXBwZXInKS5mYWRlVG9nZ2xlKHZpc2libGVDbGFzcyk7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG59KTtcblxuJCgnLmZpbHRlcl9fcmVzZXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICAkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1heF0nKS52YWwoMTAwKTtcbiAgICAkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1pbl0nKS52YWwoMCk7XG4gICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5oaWRlKCk7XG59KTtcblxuYWRkSGVpZ2h0VG9Db250YWluZXJTaWRlYmFyKCk7IiwiZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB7bGF0OiA1MS4xMDIwNzUsIGxuZzogMTcuMDQ5MjYyfTtcbiAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgem9vbTogMTUsXG4gICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBtYXBUeXBlQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IHRydWUsXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiB0cnVlXG4gICAgfSk7XG4gICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgIG1hcDogbWFwXG4gICAgfSk7XG59XG4iLCJ2YXIgZml4TW9kYWxCb3hQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGVudEhlaWdodCA9ICQoJy5tb2RhbC1ib3hfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5tb2RhbC1ib3hfX2NvbnRlbnQnKS50b2dnbGVDbGFzcygnbW9kYWwtYm94X19jb250ZW50LS1sYXJnZScsIGNvbnRlbnRIZWlnaHQgPiB3aW5kb3dIZWlnaHQpO1xufTtcblxuJCgnLm1vZGFsLWJveF9fc2hvcHBpbmctYnV0dG9uLCAubW9kYWwtYm94X19jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm1vZGFsLWJveCcpLmhpZGUoKTtcbn0pO1xuIiwiJCgnLm5hdl9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGJ1dHRvbkFjdGl2ZUNsYXNzID0gJ25hdl9fYnV0dG9uLS1hY3RpdmUnO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoYnV0dG9uQWN0aXZlQ2xhc3MpO1xuICAgICQoJy5uYXZfX21lbnUnKS50b2dnbGVDbGFzcygndmlzaWJsZScpO1xufSk7IiwidmFyIGZpeFByZXZpZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGVudEhlaWdodCA9ICQoJy5wcmV2aWV3X19jb250ZW50JykuaGVpZ2h0KCk7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdwcmV2aWV3X19jb250ZW50LS1sYXJnZScsIGNvbnRlbnRIZWlnaHQgPiB3aW5kb3dIZWlnaHQpO1xufTtcblxudmFyIHNob3dQcmV2aWV3ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIHZhciBwaG90b1NyYyA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjO1xuICAgIHZhciBwcm9kdWN0RmFicmljID0gcHJvZHVjdHNbcHJvZHVjdElkXS5mYWJyaWM7XG4gICAgdmFyIHByb2R1Y3RTaXplID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplO1xuICAgIHZhciBwcm9kdWN0UHJpY2UgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnByaWNlO1xuICAgIHZhciBwcm9kdWN0VGl0bGUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnRpdGxlO1xuICAgIHZhciBwcm9kdWN0RGVzY3JpcHRpb24gPSBwcm9kdWN0c1twcm9kdWN0SWRdLmRlc2NyaXB0aW9uO1xuXG4gICAgJCgnLnByZXZpZXcnKS5zaG93KCk7XG4gICAgJCgnLnByZXZpZXdfX3Bob3RvLWl0ZW0nKS5hdHRyKCdzcmMnLCBwaG90b1NyYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtZmFicmljIHNwYW4nKS50ZXh0KHByb2R1Y3RGYWJyaWMpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXNpemUgc3BhbicpLnRleHQocHJvZHVjdFNpemUpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXByaWNlIHNwYW4nKS50ZXh0KCckJyArIHByb2R1Y3RQcmljZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtdGl0bGUnKS50ZXh0KHByb2R1Y3RUaXRsZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtZGVzY3JpcHRpb24tdGV4dCcpLnRleHQocHJvZHVjdERlc2NyaXB0aW9uKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJywgcHJvZHVjdHNbcHJvZHVjdElkXS5pZCk7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdwcmljZScsIHByb2R1Y3RQcmljZSk7XG5cbiAgICBmaXhQcmV2aWV3UG9zaXRpb24oKTtcbn07XG5cbiQoJy5wcm9kdWN0c19fd3JhcHBlcicpLm9uKCdjbGljaycsICcucHJvZHVjdHNfX3ByZXZpZXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJykuaW5kZXgoKTtcbiAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5wcmV2aWV3X19uZXh0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgKyAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IHByb2R1Y3RzLmxlbmd0aCkge1xuICAgICAgICBzaG93UHJldmlldygwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xuICAgIH1cbn0pO1xuXG4kKCcucHJldmlld19fcHJldi1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpIC0gMTtcbiAgICBpZiAocHJvZHVjdElkID09PSAtMSkge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0cy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaG93UHJldmlldyhwcm9kdWN0SWQpO1xuICAgIH1cbn0pO1xuXG4kKCcucHJldmlld19fY2xvc2UtYnV0dG9uLCAucHJldmlld19fc2hvcHBpbmctYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5wcmV2aWV3JykuaGlkZSgpO1xufSk7XG5cbiQoJy5wcmV2aWV3X19iYXNrZXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKTtcbiAgICBhZGRQcm9kdWN0VG9DYXJ0KHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG4gICAgJCgnLm1vZGFsLWJveCcpLnNob3coKTtcbn0pOyIsInZhciBwcm9kdWN0cztcbnZhciBwcm9kdWN0c1dyYXBwZXIgPSAkKCcucHJvZHVjdHNfX3dyYXBwZXInKTtcblxudmFyIHJlbmRlclByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG4gICAgcHJvZHVjdHNXcmFwcGVyLmh0bWwoJycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb2R1Y3RJdGVtID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX2l0ZW0nLFxuICAgICAgICAgICAgJ2RhdGEtY29sb3InOiBwcm9kdWN0c1tpXS5jb2xvcixcbiAgICAgICAgICAgICdkYXRhLXNpemUnOiBwcm9kdWN0c1tpXS5zaXplLFxuICAgICAgICAgICAgJ2RhdGEtZmFicmljJzogcHJvZHVjdHNbaV0uZmFicmljLFxuICAgICAgICAgICAgJ2RhdGEtcHJpY2UnOiBwcm9kdWN0c1tpXS5wcmljZVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RJbWFnZSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ3Byb2R1Y3RzX19waG90bycsXG4gICAgICAgICAgICAnc3R5bGUnOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBwcm9kdWN0c1tpXS5zcmMgKyAnKSdcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwcm9kdWN0VGl0bGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3RpdGxlJ30pLnRleHQocHJvZHVjdHNbaV0udGl0bGUpO1xuICAgICAgICB2YXIgcHJvZHVjdEluZm8gPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX2luZm8nfSk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19zaXplLWxhYmVsJ30pLnRleHQoJ3NpemU6ICcpO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemUgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19zaXplJ30pLnRleHQocHJvZHVjdHNbaV0uc2l6ZSk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2VMYWJlbCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fcHJpY2UtbGFiZWwnfSkudGV4dCgncHJpY2U6ICcpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlID0gJCgnPHNwYW4+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fcHJpY2UnfSkudGV4dCgnJCcgKyBwcm9kdWN0c1tpXS5wcmljZSk7XG4gICAgICAgIHZhciBwcm9kdWN0RGVzY3JpcHRpb24gPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX2Rlc2NyaXB0aW9uJ30pLnRleHQocHJvZHVjdHNbaV0uZGVzY3JpcHRpb24pO1xuICAgICAgICB2YXIgcHJvZHVjdEJ1dHRvbiA9ICQoJzxidXR0b24gY2xhc3M9XCJwcm9kdWN0c19fYnV0dG9uXCI+YWRkIHRvIGNhcnQ8L2J1dHRvbj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmV2aWV3ID0gJCgnPGRpdiBjbGFzcz1cInByb2R1Y3RzX19wcmV2aWV3XCI+PGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+PC9kaXY+Jyk7XG5cbiAgICAgICAgcHJvZHVjdHNXcmFwcGVyLmFwcGVuZChwcm9kdWN0SXRlbSk7XG4gICAgICAgIHByb2R1Y3RJdGVtXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbWFnZSlcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFRpdGxlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0SW5mbylcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdERlc2NyaXB0aW9uKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0QnV0dG9uKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0UHJldmlldyk7XG4gICAgICAgIHByb2R1Y3RJbmZvXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RTaXplTGFiZWwpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmljZUxhYmVsKTtcbiAgICAgICAgcHJvZHVjdFNpemVMYWJlbC5hcHBlbmQocHJvZHVjdFNpemUpO1xuICAgICAgICBwcm9kdWN0UHJpY2VMYWJlbC5hcHBlbmQocHJvZHVjdFByaWNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvZHVjdHNPblBhZ2UgPSAkKCcucHJvZHVjdHNfX3dyYXBwZXIgLnByb2R1Y3RzX19pdGVtJyk7XG4gICAgcHJvZHVjdHNPblBhZ2UuaGlkZSgpO1xuICAgIHByb2R1Y3RzT25QYWdlLnNsaWNlKDAsIDQpLnNob3coKTtcbiAgICBpZiAocHJvZHVjdHNPblBhZ2UubGVuZ3RoID4gNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxufTtcblxudmFyIGxvYWRQcm9kdWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdkYi9wcm9kdWN0cy5qc29uJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHByb2R1Y3RzID0gcmVzcG9uc2UucHJvZHVjdHM7XG4gICAgICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICB9KS5mYWlsKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbn07XG5cbi8vc2hvdyBuZXh0IHByb2R1Y3RzXG52YXIgc2hvd05leHRQcm9kdWN0cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIGl0ZW1zID0gJChlbGVtZW50KTtcbiAgICB2YXIgbmV4dEl0ZW1zID0gaXRlbXMuc2xpY2UoMCwgNCk7XG5cbiAgICBpZiAobmV4dEl0ZW1zLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICAgICAgJCgnLmJsb2dfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgIH1cblxuICAgIG5leHRJdGVtcy5zaG93KCk7XG59O1xuXG5sb2FkUHJvZHVjdHMoKTtcblxuJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzaG93TmV4dFByb2R1Y3RzKCcucHJvZHVjdHNfX3dyYXBwZXIgLnByb2R1Y3RzX19pdGVtOmhpZGRlbicpO1xufSk7IiwidmFyIHNjcm9sbFRvRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyICR0YXJnZXRFbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB2YXIgcG9zaXRpb24gPSAkdGFyZ2V0RWxlbWVudC5vZmZzZXQoKS50b3A7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogcG9zaXRpb259LCAxNTAwKTtcbn07XG5cbiQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIHRvZ2dsZUJhY2tUb1RvcEJ1dHRvbigpO1xuICAgIHRvZ2dsZUZpeGVkRmlsdGVyKCk7XG59KTtcblxuJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgZml4UHJldmlld1Bvc2l0aW9uKCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgIHNldEZpbHRlck1heEhlaWdodCgpO1xuICAgIGFkZEhlaWdodFRvQ29udGFpbmVyU2lkZWJhcigpO1xufSk7IiwidmFyIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZSA9ICQoJy5mb3JtIHNlbGVjdCcpLnZhbCgpO1xuICAgIHZhciBmaXJzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZpcnN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIGxhc3ROYW1lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1sYXN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIHN0cmVldCA9ICQoJy5mb3JtIGlucHV0W25hbWU9c3RyZWV0XScpLnZhbCgpO1xuICAgIHZhciBob21lTnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWhvbWUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBmbGF0TnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZsYXQtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKS52YWwoKTtcbiAgICB2YXIgY2l0eSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y2l0eV0nKS52YWwoKTtcbiAgICB2YXIgY291bnRyeSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y291bnRyeV0nKS52YWwoKTtcbiAgICB2YXIgcGhvbmUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgZW1haWwgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWVtYWlsXScpLnZhbCgpO1xuXG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX25hbWUnKS50ZXh0KHRpdGxlICsgJyAnICsgZmlyc3ROYW1lICsgJyAnICsgbGFzdE5hbWUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19zdHJlZXQnKS50ZXh0KHN0cmVldCArICcgJyArIGhvbWVOciArICcgJyArIGZsYXROcik7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bvc3RhbC1jb2RlJykudGV4dChwb3N0YWxDb2RlKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY2l0eScpLnRleHQoY2l0eSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2NvdW50cnknKS50ZXh0KGNvdW50cnkpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19waG9uZScpLnRleHQocGhvbmUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19lbWFpbCcpLnRleHQoZW1haWwpO1xufTtcblxuJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VkaXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5hZGRyZXNzLWRhdGEnKS5zaG93KCk7XG4gICAgJCgnLmFkZHJlc3MtZGF0YV9fZ28tYmFjay1idXR0b24nKS5oaWRlKCk7XG4gICAgJCgnLmNvbnRhaW5lci0tZm9ybScpLmhpZGUoKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5hZGRyZXNzLWRhdGEnKTtcbn0pO1xuXG4iLCIkKCcuc2xpZGVyX19pdGVtcycpLnNsaWNrKHtcbiAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgZG90czogZmFsc2UsXG4gICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcbiAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICBhcnJvd3M6IGZhbHNlLFxuICAgIGNlbnRlclBhZGRpbmc6IDAsXG4gICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICB7XG4gICAgICAgICAgICBicmVha3BvaW50OiAxMjgwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogODAwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufSk7Il19
