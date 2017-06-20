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
function createCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
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
            createCookie('cart', cartArray, 30);
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
    createCookie('cart', cartArray, 30);

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
    createCookie('cart', cartArray, 30);
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
            createCookie('cart', cartArray, 30);
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
            createCookie('cart', cartArray, 30);
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
    createCookie('cart', cartArray, 30);
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

var stopFilterBeforeFooter = function () {
    var filter = $('.filter');
    var filterHeight = $('.filter').outerHeight();
    var footerOffset = $('.social-links').offset().top;
    var footerHeight = $('.social-links').outerHeight() + $('.footer').outerHeight();
    var stopPoint = footerOffset - filterHeight;

    if ($(this).scrollTop() >= stopPoint) {
        filter.addClass('filter--stop');
        filter.css('top', stopPoint);
    } else {
        filter.removeClass('filter--stop');
        filter.css('top', '0');
    }
};

$('.filter__button').on('click', function () {
    filteredProducts(products);
    scrollToElement('.products__wrapper');
});

if ($(window).width() > 920) {
    setFilterMaxHeight();
}

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
    if ($(window).width() > 920) {
        stopFilterBeforeFooter();
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0b2dnbGVCYWNrVG9Ub3BCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbnVIZWlnaHQgPSAkKCcubmF2JykuaGVpZ2h0KCk7XG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgaWYgKGRvY3VtZW50UG9zaXRpb24gPiBtZW51SGVpZ2h0KSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykuaGlkZSgpO1xuICAgIH1cbn07XG5cbiQoJy5iYWNrLXRvLXRvcF9fYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlclByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSwgMTUwMCk7XG59KTtcbiIsInZhciByZW5kZXJFbnRyaWVzID0gZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICB2YXIgYmxvZ1dyYXBwZXIgPSAkKCcuYmxvZ19fd3JhcHBlcicpO1xuICAgIGJsb2dXcmFwcGVyLmVtcHR5KCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5JyxcbiAgICAgICAgICAgICdkYXRhLWlkJzogZW50cmllc1tpXS5pZFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5UGhvdG8gPSAkKCc8aW1nPicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6IFwiYmxvZ19fZW50cnktcGhvdG9cIixcbiAgICAgICAgICAgICdzcmMnOiBlbnRyaWVzW2ldLmltZ19zcmNcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyaWVzV3JhcHBlciA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXdyYXBwZXInXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cnlUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10aXRsZSd9KS50ZXh0KGVudHJpZXNbaV0udGl0bGUpO1xuICAgICAgICB2YXIgZW50cnlUZXh0ID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXRleHQnfSkudGV4dChlbnRyaWVzW2ldLnRleHQpO1xuICAgICAgICB2YXIgZW50cnlEYXRlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LWRhdGUnfSkudGV4dChlbnRyaWVzW2ldLmRhdGUpO1xuICAgICAgICB2YXIgZW50cnlCdXR0b24gPSAkKCc8YnV0dG9uPicsIHsnY2xhc3MnOiAnYmxvZ19fYnV0dG9uJ30pLnRleHQoJ3JlYWQgbW9yZScpO1xuXG4gICAgICAgIGJsb2dXcmFwcGVyLmFwcGVuZChlbnRyeSk7XG4gICAgICAgIGVudHJ5XG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5UGhvdG8pXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJpZXNXcmFwcGVyKTtcbiAgICAgICAgZW50cmllc1dyYXBwZXJcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUaXRsZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlEYXRlKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVRleHQpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5QnV0dG9uKTtcbiAgICB9XG5cbiAgICB2YXIgZW50cmllc09uUGFnZSA9ICQoJy5ibG9nX193cmFwcGVyIC5ibG9nX19lbnRyeScpO1xuICAgIGVudHJpZXNPblBhZ2UuaGlkZSgpO1xuICAgIGVudHJpZXNPblBhZ2Uuc2xpY2UoMCwgMykuc2hvdygpO1xuICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG59O1xuXG52YXIgbG9hZEVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnZGIvZW50cmllcy5qc29uJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJlbmRlckVudHJpZXMocmVzcG9uc2UuZW50cmllcyk7XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG59O1xuXG5sb2FkRW50cmllcygpO1xuXG4kKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2hvd05leHRQcm9kdWN0cygnLmJsb2dfX3dyYXBwZXIgLmJsb2dfX2VudHJ5OmhpZGRlbicpO1xufSk7XG4iLCJ2YXIgY2FydEFycmF5ID0gcmVhZENvb2tpZSgnY2FydCcpIHx8IFtdO1xuXG4vLyBjb29raWVzXG5mdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIG1pbnV0ZXMpIHtcbiAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKG1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAobWludXRlcyAqIDYwICogMTAwMCkpO1xuICAgICAgICBleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgXCI9XCI7XG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09IDApIHJldHVybiBKU09OLnBhcnNlKGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcbiAgICBjcmVhdGVDb29raWUobmFtZSwgXCJcIiwgLTEpO1xufVxuXG52YXIgYWRkUHJvZHVjdFRvQ2FydCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb2R1Y3QgPSB7XG4gICAgICAgIHBhdGg6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjLFxuICAgICAgICBwcmljZTogcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZSxcbiAgICAgICAgc2l6ZTogcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplLFxuICAgICAgICBpZDogcHJvZHVjdHNbcHJvZHVjdElkXS5pZCxcbiAgICAgICAgYW1vdW50OiAxXG4gICAgfTtcblxuICAgIGNhcnRBcnJheS5wdXNoKHByb2R1Y3QpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuXG59O1xuXG52YXIgcmVuZGVyQ2FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykucmVtb3ZlKCk7XG4gICAgdmFyIGJ1dHRvbnNXcmFwcGVyID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fYnV0dG9ucy13cmFwcGVyXCI+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3BsdXMtYnV0dG9uXCI+JiM0Mzs8L2Rpdj48ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fbWludXMtYnV0dG9uXCI+JiM0NTs8L2Rpdj48L2Rpdj4nKTtcbiAgICB2YXIgZGVsZXRlQnV0dG9uID0gKCc8YnV0dG9uIGNsYXNzPVwic2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvblwiPmRlbGV0ZTwvYnV0dG9uPicpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb2R1Y3RQaG90byA9ICgnPGltZyBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcGhvdG9cIiBzcmM9XCInICsgY2FydEFycmF5W2ldLnBhdGggKyAnXCI+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0QW1vdW50ID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1hbW91bnRcIj48c3Bhbj4nICsgY2FydEFycmF5W2ldLmFtb3VudCArICc8L3NwYW4+JyArIGJ1dHRvbnNXcmFwcGVyICsgJzwvZGl2PicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1wcmljZVwiPiQnICsgKGNhcnRBcnJheVtpXS5wcmljZSAqIGNhcnRBcnJheVtpXS5hbW91bnQpICsgJyA8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1zaXplXCI+JyArIGNhcnRBcnJheVtpXS5zaXplICsgJzwvZGl2PicpO1xuXG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJylcbiAgICAgICAgICAgIC5wcmVwZW5kKCcgPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlclwiIGRhdGEtaWQ9JyArIGNhcnRBcnJheVtpXS5pZCArICc+JyArIHByb2R1Y3RQaG90byArIHByb2R1Y3RTaXplICsgcHJvZHVjdEFtb3VudCArIHByb2R1Y3RQcmljZSArIGRlbGV0ZUJ1dHRvbiArICc8L2Rpdj4nKTtcblxuICAgIH1cbn07XG5cbnZhciB0b3RhbFN1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVsaXZlcnlQcmljZSA9IHBhcnNlSW50KCQoJy5zaG9wcGluZy1saXN0X19kZWxpdmVyeS1wcmljZScpLnRleHQoKSk7XG4gICAgdmFyIHRvdGFsU3VtID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbFN1bSArPSBwYXJzZUludChjYXJ0QXJyYXlbaV0ucHJpY2UgKiBjYXJ0QXJyYXlbaV0uYW1vdW50KTtcbiAgICB9XG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsaXZlcnlQcmljZSA9IDA7XG4gICAgfVxuICAgIHJldHVybiAnJCcgKyAodG90YWxTdW0gKyBkZWxpdmVyeVByaWNlKTtcbn07XG5cbi8vIEFycmF5IFJlbW92ZSAtIEJ5IEpvaG4gUmVzaWcgKE1JVCBMaWNlbnNlZClcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbnZhciBkZWxldGVQcm9kdWN0RnJvbUJhc2tldCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FydEFycmF5LmluZGV4T2YoY2FydEFycmF5W2ldKTtcbiAgICAgICAgICAgIGNhcnRBcnJheS5yZW1vdmUoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuICAgIGRpc2FibGVCdXlCdXR0b24oKTtcblxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19idXktYnV0dG9uJykuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgfVxufTtcblxudmFyIHN1bU9mUHJvZHVjdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN1bU9mUHJvZHVjdHMgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN1bU9mUHJvZHVjdHMgKz0gY2FydEFycmF5W2ldLmFtb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHN1bU9mUHJvZHVjdHM7XG59O1xuXG52YXIgaW5jcmVhc2VBbW91bnRPZlByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudCsrO1xuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGRpc2FibGVCdXlCdXR0b24oKTtcbn07XG5cbnZhciBkZWNyZWFzZUFtb3VudE9mUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgICAgICAgICBjYXJ0QXJyYXlbaV0uYW1vdW50LS07XG4gICAgICAgICAgICBpZiAoY2FydEFycmF5W2ldLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZVByb2R1Y3RGcm9tQmFza2V0KHByb2R1Y3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDMwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG59O1xuXG52YXIgZGlzYWJsZUJ1eUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaG9wcGluZy1saXN0X19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgICAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaGlwcGluZy1hZGRyZXNzX19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgIH1cbn07XG5cbiQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJykub24oJ2NsaWNrJywgJy5zaG9wcGluZy1saXN0X19wbHVzLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBpbmNyZWFzZUFtb3VudE9mUHJvZHVjdHMocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJykub24oJ2NsaWNrJywgJy5zaG9wcGluZy1saXN0X19taW51cy1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgZGVjcmVhc2VBbW91bnRPZlByb2R1Y3RzKHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuXG5cbmlmICgkKCcuc2hvcHBpbmctbGlzdCcpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJlbmRlckNhcnQoKTtcbn1cblxuZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG4kKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcblxuXG4vL2FkZCBwcm9kdWN0cyB0byBjYXJ0XG4kKCcucHJvZHVjdHNfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnByb2R1Y3RzX19idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJykuaW5kZXgoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cblxuIiwidmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG5cbiAgICB2YXIgZW1haWxSZSA9IC9eW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOS1dKyg/OlxcLlthLXpBLVowLTktXSspKiQvO1xuICAgIHZhciBwb3N0YWxDb2RlUmUgPSAvWzAtOV17Mn1cXC1bMC05XXszfS87XG4gICAgdmFyIHBob25lTnJSZSA9IC9bMC05XSQvO1xuXG4gICAgdmFyICRlbWFpbCA9ICQoJy5mb3JtIGlucHV0W3R5cGU9ZW1haWxdJyk7XG4gICAgdmFyICRwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKTtcbiAgICB2YXIgJHBob25lTnVtYmVyID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1waG9uZS1udW1iZXJdJyk7XG5cbiAgICB2YXIgaXNFbWFpbCA9IGVtYWlsUmUudGVzdCgkZW1haWwudmFsKCkpO1xuICAgIHZhciBpc1Bvc3RhbENvZGUgPSBwb3N0YWxDb2RlUmUudGVzdCgkcG9zdGFsQ29kZS52YWwoKSk7XG4gICAgdmFyIGlzUGhvbmVOciA9IHBob25lTnJSZS50ZXN0KCRwaG9uZU51bWJlci52YWwoKSk7XG5cbiAgICAkKCcuZm9ybSBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnJykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRlbWFpbC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc0VtYWlsKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBvc3RhbENvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQb3N0YWxDb2RlKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJHBob25lTnVtYmVyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUGhvbmVOciB8fCAkcGhvbmVOdW1iZXIudmFsKCkubGVuZ3RoIDwgOSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChpc1ZhbGlkICYmIGlzRW1haWwgJiYgaXNQb3N0YWxDb2RlICYmIGlzUGhvbmVOcikge1xuICAgICAgICAkKCcuYWRkcmVzcy1kYXRhJykuaGlkZSgpO1xuICAgICAgICBjb21wbGV0ZVNoaXBwaW5nQWRkcmVzcygpO1xuICAgICAgICAkKCcuY29udGFpbmVyLS1mb3JtJykuc2hvdygpO1xuICAgICAgICBzY3JvbGxUb0VsZW1lbnQoJy5zaG9wcGluZy1saXN0Jyk7XG4gICAgfVxufTtcblxuLy9yZWFkIGluIGEgZm9ybSdzIGRhdGEgYW5kIGNvbnZlcnQgaXQgdG8gYSBrZXk6dmFsdWUgb2JqZWN0XG5mdW5jdGlvbiBnZXRGb3JtRGF0YShmb3JtKSB7XG4gICAgdmFyIG91dCA9IHt9O1xuICAgIHZhciBkYXRhID0gJChmb3JtKS5zZXJpYWxpemVBcnJheSgpO1xuICAgIC8vdHJhbnNmb3JtIGludG8gc2ltcGxlIGRhdGEvdmFsdWUgb2JqZWN0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByZWNvcmQgPSBkYXRhW2ldO1xuICAgICAgICBvdXRbcmVjb3JkLm5hbWVdID0gcmVjb3JkLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG4kKCcuYWRkcmVzcy1kYXRhX19idXktYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFsaWRhdGVGb3JtKCk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG59KTtcblxuJCgnLmFkZHJlc3MtZGF0YV9fZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICAkKCcubW9kYWwtYm94LS1mb3JtJykuc2hvdygpO1xuICAgIHZhciBkYXRhVG9TZW5kID0ge1xuICAgICAgICBjb250YWN0RGF0YTogZ2V0Rm9ybURhdGEoJyNhZGRyZXNzLWRhdGEnKSxcbiAgICAgICAgY2FydDogY2FydEFycmF5XG4gICAgfTtcbiAgICBjb25zb2xlLmxvZyhkYXRhVG9TZW5kKTtcbiAgICBjYXJ0QXJyYXkgPSBbXTtcbiAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDMwKTtcbn0pOyIsInZhciB0b2dnbGVGaXhlZEZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGZpbHRlciA9ICQoJy5maWx0ZXInKTtcblxuICAgIGlmICghJGZpbHRlci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkb2N1bWVudFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBmaWx0ZXJPZmZzZXQgPSAkZmlsdGVyLnBhcmVudCgpLm9mZnNldCgpLnRvcDtcbiAgICBpZiAoZG9jdW1lbnRQb3NpdGlvbiA+PSBmaWx0ZXJPZmZzZXQpIHtcbiAgICAgICAgJGZpbHRlci5hZGRDbGFzcygnZmlsdGVyLS1maXhlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRmaWx0ZXIucmVtb3ZlQ2xhc3MoJ2ZpbHRlci0tZml4ZWQnKTtcbiAgICB9XG59O1xuXG52YXIgc2V0RmlsdGVyTWF4SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkKCcuZmlsdGVyJykuaGVpZ2h0KCkgPiAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgJCgnLmZpbHRlcicpLmNzcygnbWF4LWhlaWdodCcsICQod2luZG93KS5oZWlnaHQoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuZmlsdGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xuICAgIH1cbn07XG5cbnZhciBmaWx0ZXJlZFByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG4gICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5oaWRlKCk7XG4gICAgJCgnLnByb2R1Y3RzX193cmFwcGVyJykuaHRtbCgnJyk7XG4gICAgdmFyIG1heCA9IHBhcnNlSW50KCQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWF4XScpLnZhbCgpKTtcbiAgICB2YXIgbWluID0gcGFyc2VJbnQoJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1taW5dJykudmFsKCkpO1xuXG4gICAgdmFyIGNvbG9yQXJyYXkgPSBtYWtlQ29sb3JBcnJheSgpO1xuICAgIHZhciBzaXplQXJyYXkgPSBtYWtlU2l6ZUFycmF5KCk7XG4gICAgdmFyIGZhYnJpY3NBcnJheSA9IG1ha2VGYWJyaWNzQXJyYXkoKTtcbiAgICB2YXIgZmlsdGVyZWQgPSBwcm9kdWN0cztcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5QmxpbmdQcmljZXMoZmlsdGVyZWQsIG1pbiwgbWF4KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5Q29sb3JzKGZpbHRlcmVkLCBjb2xvckFycmF5KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5U2l6ZXMoZmlsdGVyZWQsIHNpemVBcnJheSk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUZhYnJpY3MoZmlsdGVyZWQsIGZhYnJpY3NBcnJheSk7XG4gICAgcmVuZGVyUHJvZHVjdHMoZmlsdGVyZWQpO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5zaG93KCk7XG4gICAgfVxufTtcblxuLy9maWx0ZXIgcHJvZHVjdHNcbnZhciBmaWx0ZXJCeUJsaW5nUHJpY2VzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBtaW4sIG1heCkge1xuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5wcmljZSA+PSBtaW4gJiYgdmFsdWUucHJpY2UgPD0gbWF4O1xuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5Q29sb3JzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBjb2xvckFycmF5KSB7XG4gICAgaWYgKGNvbG9yQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuY29sb3IgPT09IGNvbG9yQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5U2l6ZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIHNpemVBcnJheSkge1xuICAgIGlmIChzaXplQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zaXplID09PSBzaXplQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5RmFicmljcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgZmFicmljQXJyYXkpIHtcbiAgICBpZiAoZmFicmljQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmYWJyaWNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmZhYnJpYyA9PT0gZmFicmljQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuXG4vL2ZpbHRlciBhcnJheXNcbnZhciBtYWtlQ29sb3JBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRDb2xvcnMgPSBbXTtcbiAgICAkKCcuY29sb3JzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRDb2xvcnMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRDb2xvcnM7XG59O1xuXG52YXIgbWFrZVNpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRTaXplcyA9IFtdO1xuICAgICQoJy5zaXplcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkU2l6ZXMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRTaXplcztcbn07XG5cbnZhciBtYWtlRmFicmljc0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZEZhYnJpY3MgPSBbXTtcbiAgICAkKCcuZmFicmljcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkRmFicmljcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZEZhYnJpY3M7XG59O1xuXG52YXIgYWRkSGVpZ2h0VG9Db250YWluZXJTaWRlYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDkyMCkge1xuICAgICAgICB2YXIgZmlsdGVySGVpZ2h0ID0gJCgnLmZpbHRlcicpLmhlaWdodCgpO1xuICAgICAgICAkKCcuY29udGFpbmVyX19zaWRlYmFyJykuY3NzKCdoZWlnaHQnLCBmaWx0ZXJIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5jb250YWluZXJfX3NpZGViYXInKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICB9XG59O1xuXG52YXIgc3RvcEZpbHRlckJlZm9yZUZvb3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmlsdGVyID0gJCgnLmZpbHRlcicpO1xuICAgIHZhciBmaWx0ZXJIZWlnaHQgPSAkKCcuZmlsdGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICB2YXIgZm9vdGVyT2Zmc2V0ID0gJCgnLnNvY2lhbC1saW5rcycpLm9mZnNldCgpLnRvcDtcbiAgICB2YXIgZm9vdGVySGVpZ2h0ID0gJCgnLnNvY2lhbC1saW5rcycpLm91dGVySGVpZ2h0KCkgKyAkKCcuZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICB2YXIgc3RvcFBvaW50ID0gZm9vdGVyT2Zmc2V0IC0gZmlsdGVySGVpZ2h0O1xuXG4gICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPj0gc3RvcFBvaW50KSB7XG4gICAgICAgIGZpbHRlci5hZGRDbGFzcygnZmlsdGVyLS1zdG9wJyk7XG4gICAgICAgIGZpbHRlci5jc3MoJ3RvcCcsIHN0b3BQb2ludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsdGVyLnJlbW92ZUNsYXNzKCdmaWx0ZXItLXN0b3AnKTtcbiAgICAgICAgZmlsdGVyLmNzcygndG9wJywgJzAnKTtcbiAgICB9XG59O1xuXG4kKCcuZmlsdGVyX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgc2Nyb2xsVG9FbGVtZW50KCcucHJvZHVjdHNfX3dyYXBwZXInKTtcbn0pO1xuXG5pZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MjApIHtcbiAgICBzZXRGaWx0ZXJNYXhIZWlnaHQoKTtcbn1cblxuJCgnLmZpbHRlcl9fdGl0bGUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXNpYmxlQ2xhc3MgPSAnZmlsdGVyX193cmFwcGVyLS12aXNpYmxlJztcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnZmlsdGVyX190aXRsZS1idXR0b24tLWFjdGl2ZSc7XG4gICAgJCgnLmZpbHRlcl9fd3JhcHBlcicpLmZhZGVUb2dnbGUodmlzaWJsZUNsYXNzKTtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKGJ1dHRvbkFjdGl2ZUNsYXNzKTtcbn0pO1xuXG4kKCcuZmlsdGVyX19yZXNldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgICQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgICQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWF4XScpLnZhbCgxMDApO1xuICAgICQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWluXScpLnZhbCgwKTtcbiAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLmhpZGUoKTtcbn0pO1xuXG5hZGRIZWlnaHRUb0NvbnRhaW5lclNpZGViYXIoKTsiLCJmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHtsYXQ6IDUxLjEwMjA3NSwgbG5nOiAxNy4wNDkyNjJ9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiB0cnVlLFxuICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgbWFwOiBtYXBcbiAgICB9KTtcbn1cbiIsInZhciBmaXhNb2RhbEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLm1vZGFsLWJveF9fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLm1vZGFsLWJveF9fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdtb2RhbC1ib3hfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG4kKCcubW9kYWwtYm94X19zaG9wcGluZy1idXR0b24sIC5tb2RhbC1ib3hfX2Nsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcubW9kYWwtYm94JykuaGlkZSgpO1xufSk7XG4iLCIkKCcubmF2X19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnbmF2X19idXR0b24tLWFjdGl2ZSc7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG4gICAgJCgnLm5hdl9fbWVudScpLnRvZ2dsZUNsYXNzKCd2aXNpYmxlJyk7XG59KTsiLCJ2YXIgZml4UHJldmlld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ3ByZXZpZXdfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG52YXIgc2hvd1ByZXZpZXcgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgdmFyIHBob3RvU3JjID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zcmM7XG4gICAgdmFyIHByb2R1Y3RGYWJyaWMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLmZhYnJpYztcbiAgICB2YXIgcHJvZHVjdFNpemUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemU7XG4gICAgdmFyIHByb2R1Y3RQcmljZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2U7XG4gICAgdmFyIHByb2R1Y3RUaXRsZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0udGl0bGU7XG4gICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZGVzY3JpcHRpb247XG5cbiAgICAkKCcucHJldmlldycpLnNob3coKTtcbiAgICAkKCcucHJldmlld19fcGhvdG8taXRlbScpLmF0dHIoJ3NyYycsIHBob3RvU3JjKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1mYWJyaWMgc3BhbicpLnRleHQocHJvZHVjdEZhYnJpYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3Qtc2l6ZSBzcGFuJykudGV4dChwcm9kdWN0U2l6ZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtcHJpY2Ugc3BhbicpLnRleHQoJyQnICsgcHJvZHVjdFByaWNlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC10aXRsZScpLnRleHQocHJvZHVjdFRpdGxlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1kZXNjcmlwdGlvbi10ZXh0JykudGV4dChwcm9kdWN0RGVzY3JpcHRpb24pO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnLCBwcm9kdWN0c1twcm9kdWN0SWRdLmlkKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ3ByaWNlJywgcHJvZHVjdFByaWNlKTtcblxuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xufTtcblxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fcHJldmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG59KTtcblxuJCgnLnByZXZpZXdfX25leHQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSArIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHMubGVuZ3RoKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19wcmV2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgLSAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IC0xKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19jbG9zZS1idXR0b24sIC5wcmV2aWV3X19zaG9wcGluZy1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG59KTtcblxuJCgnLnByZXZpZXdfX2Jhc2tldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xufSk7IiwidmFyIHByb2R1Y3RzO1xudmFyIHByb2R1Y3RzV3JhcHBlciA9ICQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xuXG52YXIgcmVuZGVyUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICBwcm9kdWN0c1dyYXBwZXIuaHRtbCgnJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdEl0ZW0gPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19faXRlbScsXG4gICAgICAgICAgICAnZGF0YS1jb2xvcic6IHByb2R1Y3RzW2ldLmNvbG9yLFxuICAgICAgICAgICAgJ2RhdGEtc2l6ZSc6IHByb2R1Y3RzW2ldLnNpemUsXG4gICAgICAgICAgICAnZGF0YS1mYWJyaWMnOiBwcm9kdWN0c1tpXS5mYWJyaWMsXG4gICAgICAgICAgICAnZGF0YS1wcmljZSc6IHByb2R1Y3RzW2ldLnByaWNlXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdEltYWdlID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX3Bob3RvJyxcbiAgICAgICAgICAgICdzdHlsZSc6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIHByb2R1Y3RzW2ldLnNyYyArICcpJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fdGl0bGUnfSkudGV4dChwcm9kdWN0c1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW5mbyA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19faW5mbyd9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUtbGFiZWwnfSkudGV4dCgnc2l6ZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUnfSkudGV4dChwcm9kdWN0c1tpXS5zaXplKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZS1sYWJlbCd9KS50ZXh0KCdwcmljZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZSd9KS50ZXh0KCckJyArIHByb2R1Y3RzW2ldLnByaWNlKTtcbiAgICAgICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fZGVzY3JpcHRpb24nfSkudGV4dChwcm9kdWN0c1tpXS5kZXNjcmlwdGlvbik7XG4gICAgICAgIHZhciBwcm9kdWN0QnV0dG9uID0gJCgnPGJ1dHRvbiBjbGFzcz1cInByb2R1Y3RzX19idXR0b25cIj5hZGQgdG8gY2FydDwvYnV0dG9uPicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByZXZpZXcgPSAkKCc8ZGl2IGNsYXNzPVwicHJvZHVjdHNfX3ByZXZpZXdcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT48L2Rpdj4nKTtcblxuICAgICAgICBwcm9kdWN0c1dyYXBwZXIuYXBwZW5kKHByb2R1Y3RJdGVtKTtcbiAgICAgICAgcHJvZHVjdEl0ZW1cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEltYWdlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbmZvKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0RGVzY3JpcHRpb24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RCdXR0b24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmV2aWV3KTtcbiAgICAgICAgcHJvZHVjdEluZm9cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFNpemVMYWJlbClcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByaWNlTGFiZWwpO1xuICAgICAgICBwcm9kdWN0U2l6ZUxhYmVsLmFwcGVuZChwcm9kdWN0U2l6ZSk7XG4gICAgICAgIHByb2R1Y3RQcmljZUxhYmVsLmFwcGVuZChwcm9kdWN0UHJpY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm9kdWN0c09uUGFnZSA9ICQoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW0nKTtcbiAgICBwcm9kdWN0c09uUGFnZS5oaWRlKCk7XG4gICAgcHJvZHVjdHNPblBhZ2Uuc2xpY2UoMCwgNCkuc2hvdygpO1xuICAgIGlmIChwcm9kdWN0c09uUGFnZS5sZW5ndGggPiA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG59O1xuXG52YXIgbG9hZFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL3Byb2R1Y3RzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvZHVjdHMgPSByZXNwb25zZS5wcm9kdWN0cztcbiAgICAgICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxuLy9zaG93IG5leHQgcHJvZHVjdHNcbnZhciBzaG93TmV4dFByb2R1Y3RzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgaXRlbXMgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBuZXh0SXRlbXMgPSBpdGVtcy5zbGljZSgwLCA0KTtcblxuICAgIGlmIChuZXh0SXRlbXMubGVuZ3RoIDwgNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgICAgICAkKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgbmV4dEl0ZW1zLnNob3coKTtcbn07XG5cbmxvYWRQcm9kdWN0cygpO1xuXG4kKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW06aGlkZGVuJyk7XG59KTsiLCJ2YXIgc2Nyb2xsVG9FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgJHRhcmdldEVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBwb3NpdGlvbiA9ICR0YXJnZXRFbGVtZW50Lm9mZnNldCgpLnRvcDtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBwb3NpdGlvbn0sIDE1MDApO1xufTtcblxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdG9nZ2xlQmFja1RvVG9wQnV0dG9uKCk7XG4gICAgdG9nZ2xlRml4ZWRGaWx0ZXIoKTtcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MjApIHtcbiAgICAgICAgc3RvcEZpbHRlckJlZm9yZUZvb3RlcigpO1xuICAgIH1cbn0pO1xuXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBmaXhQcmV2aWV3UG9zaXRpb24oKTtcbiAgICBmaXhNb2RhbEJveFBvc2l0aW9uKCk7XG4gICAgc2V0RmlsdGVyTWF4SGVpZ2h0KCk7XG4gICAgYWRkSGVpZ2h0VG9Db250YWluZXJTaWRlYmFyKCk7XG59KTsiLCJ2YXIgY29tcGxldGVTaGlwcGluZ0FkZHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlID0gJCgnLmZvcm0gc2VsZWN0JykudmFsKCk7XG4gICAgdmFyIGZpcnN0TmFtZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Zmlyc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgbGFzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWxhc3QtbmFtZV0nKS52YWwoKTtcbiAgICB2YXIgc3RyZWV0ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1zdHJlZXRdJykudmFsKCk7XG4gICAgdmFyIGhvbWVOciA9ICQoJy5mb3JtIGlucHV0W25hbWU9aG9tZS1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIGZsYXROciA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZmxhdC1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpLnZhbCgpO1xuICAgIHZhciBjaXR5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jaXR5XScpLnZhbCgpO1xuICAgIHZhciBjb3VudHJ5ID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1jb3VudHJ5XScpLnZhbCgpO1xuICAgIHZhciBwaG9uZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cGhvbmUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBlbWFpbCA9ICQoJy5mb3JtIGlucHV0W25hbWU9ZW1haWxdJykudmFsKCk7XG5cbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fbmFtZScpLnRleHQodGl0bGUgKyAnICcgKyBmaXJzdE5hbWUgKyAnICcgKyBsYXN0TmFtZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3N0cmVldCcpLnRleHQoc3RyZWV0ICsgJyAnICsgaG9tZU5yICsgJyAnICsgZmxhdE5yKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fcG9zdGFsLWNvZGUnKS50ZXh0KHBvc3RhbENvZGUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19jaXR5JykudGV4dChjaXR5KTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY291bnRyeScpLnRleHQoY291bnRyeSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bob25lJykudGV4dChwaG9uZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VtYWlsJykudGV4dChlbWFpbCk7XG59O1xuXG4kKCcuc2hpcHBpbmctYWRkcmVzc19fZWRpdC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmFkZHJlc3MtZGF0YScpLnNob3coKTtcbiAgICAkKCcuYWRkcmVzcy1kYXRhX19nby1iYWNrLWJ1dHRvbicpLmhpZGUoKTtcbiAgICAkKCcuY29udGFpbmVyLS1mb3JtJykuaGlkZSgpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgnLmFkZHJlc3MtZGF0YScpO1xufSk7XG5cbiIsIiQoJy5zbGlkZXJfX2l0ZW1zJykuc2xpY2soe1xuICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICBkb3RzOiBmYWxzZSxcbiAgICBmb2N1c09uU2VsZWN0OiB0cnVlLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgIGFycm93czogZmFsc2UsXG4gICAgY2VudGVyUGFkZGluZzogMCxcbiAgICByZXNwb25zaXZlOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEyODAsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBicmVha3BvaW50OiA4MDAsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdXG59KTsiXX0=
