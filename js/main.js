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
    var filterHeight = $('.filter').height();
    var footerOffset = $('.social-links').offset().top - 100;
    var footerHeight = $('.social-links').height();
    var stopPoint = footerOffset - filterHeight;

    if ($(this).scrollTop() >= stopPoint) {
        filter.addClass('filter--stop');
        filter.css('top', footerOffset - footerHeight - filterHeight );
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
    stopFilterBeforeFooter();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvZ2dsZUJhY2tUb1RvcEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVudUhlaWdodCA9ICQoJy5uYXYnKS5oZWlnaHQoKTtcbiAgICB2YXIgZG9jdW1lbnRQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICBpZiAoZG9jdW1lbnRQb3NpdGlvbiA+IG1lbnVIZWlnaHQpIHtcbiAgICAgICAgJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5oaWRlKCk7XG4gICAgfVxufTtcblxuJCgnLmJhY2stdG8tdG9wX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAxNTAwKTtcbn0pO1xuIiwidmFyIHJlbmRlckVudHJpZXMgPSBmdW5jdGlvbiAoZW50cmllcykge1xuICAgIHZhciBibG9nV3JhcHBlciA9ICQoJy5ibG9nX193cmFwcGVyJyk7XG4gICAgYmxvZ1dyYXBwZXIuZW1wdHkoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnYmxvZ19fZW50cnknLFxuICAgICAgICAgICAgJ2RhdGEtaWQnOiBlbnRyaWVzW2ldLmlkXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cnlQaG90byA9ICQoJzxpbWc+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogXCJibG9nX19lbnRyeS1waG90b1wiLFxuICAgICAgICAgICAgJ3NyYyc6IGVudHJpZXNbaV0uaW1nX3NyY1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJpZXNXcmFwcGVyID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnYmxvZ19fZW50cnktd3JhcHBlcidcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyeVRpdGxlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2VudHJ5LXRpdGxlJ30pLnRleHQoZW50cmllc1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBlbnRyeVRleHQgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktdGV4dCd9KS50ZXh0KGVudHJpZXNbaV0udGV4dCk7XG4gICAgICAgIHZhciBlbnRyeURhdGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktZGF0ZSd9KS50ZXh0KGVudHJpZXNbaV0uZGF0ZSk7XG4gICAgICAgIHZhciBlbnRyeUJ1dHRvbiA9ICQoJzxidXR0b24+JywgeydjbGFzcyc6ICdibG9nX19idXR0b24nfSkudGV4dCgncmVhZCBtb3JlJyk7XG5cbiAgICAgICAgYmxvZ1dyYXBwZXIuYXBwZW5kKGVudHJ5KTtcbiAgICAgICAgZW50cnlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlQaG90bylcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cmllc1dyYXBwZXIpO1xuICAgICAgICBlbnRyaWVzV3JhcHBlclxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVRpdGxlKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeURhdGUpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5VGV4dClcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlCdXR0b24pO1xuICAgIH1cblxuICAgIHZhciBlbnRyaWVzT25QYWdlID0gJCgnLmJsb2dfX3dyYXBwZXIgLmJsb2dfX2VudHJ5Jyk7XG4gICAgZW50cmllc09uUGFnZS5oaWRlKCk7XG4gICAgZW50cmllc09uUGFnZS5zbGljZSgwLCAzKS5zaG93KCk7XG4gICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLnNob3coKTtcbn07XG5cbnZhciBsb2FkRW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdkYi9lbnRyaWVzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmVuZGVyRW50cmllcyhyZXNwb25zZS5lbnRyaWVzKTtcbiAgICB9KS5mYWlsKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbn07XG5cbmxvYWRFbnRyaWVzKCk7XG5cbiQoJy5ibG9nX19idXR0b24tbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzaG93TmV4dFByb2R1Y3RzKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnk6aGlkZGVuJyk7XG59KTtcbiIsInZhciBjYXJ0QXJyYXkgPSByZWFkQ29va2llKCdjYXJ0JykgfHwgW107XG5cbi8vIGNvb2tpZXNcbmZ1bmN0aW9uIGNyZWF0ZUNvb2tpZShuYW1lLCB2YWx1ZSwgbWludXRlcykge1xuICAgIHZhciBleHBpcmVzID0gXCJcIjtcbiAgICBpZiAobWludXRlcykge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChtaW51dGVzICogNjAgKiAxMDAwKSk7XG4gICAgICAgIGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcbn1cblxuZnVuY3Rpb24gcmVhZENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT0gMCkgcmV0dXJuIEpTT04ucGFyc2UoYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXJhc2VDb29raWUobmFtZSkge1xuICAgIGNyZWF0ZUNvb2tpZShuYW1lLCBcIlwiLCAtMSk7XG59XG5cbnZhciBhZGRQcm9kdWN0VG9DYXJ0ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudCsrO1xuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJvZHVjdCA9IHtcbiAgICAgICAgcGF0aDogcHJvZHVjdHNbcHJvZHVjdElkXS5zcmMsXG4gICAgICAgIHByaWNlOiBwcm9kdWN0c1twcm9kdWN0SWRdLnByaWNlLFxuICAgICAgICBzaXplOiBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemUsXG4gICAgICAgIGlkOiBwcm9kdWN0c1twcm9kdWN0SWRdLmlkLFxuICAgICAgICBhbW91bnQ6IDFcbiAgICB9O1xuXG4gICAgY2FydEFycmF5LnB1c2gocHJvZHVjdCk7XG4gICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzMCk7XG5cbn07XG5cbnZhciByZW5kZXJDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKS5yZW1vdmUoKTtcbiAgICB2YXIgYnV0dG9uc1dyYXBwZXIgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19idXR0b25zLXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcGx1cy1idXR0b25cIj4mIzQzOzwvZGl2PjxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19taW51cy1idXR0b25cIj4mIzQ1OzwvZGl2PjwvZGl2PicpO1xuICAgIHZhciBkZWxldGVCdXR0b24gPSAoJzxidXR0b24gY2xhc3M9XCJzaG9wcGluZy1saXN0X19kZWxldGUtYnV0dG9uXCI+ZGVsZXRlPC9idXR0b24+Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdFBob3RvID0gKCc8aW1nIGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1waG90b1wiIHNyYz1cIicgKyBjYXJ0QXJyYXlbaV0ucGF0aCArICdcIj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RBbW91bnQgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LWFtb3VudFwiPjxzcGFuPicgKyBjYXJ0QXJyYXlbaV0uYW1vdW50ICsgJzwvc3Bhbj4nICsgYnV0dG9uc1dyYXBwZXIgKyAnPC9kaXY+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXByaWNlXCI+JCcgKyAoY2FydEFycmF5W2ldLnByaWNlICogY2FydEFycmF5W2ldLmFtb3VudCkgKyAnIDwvZGl2PicpO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemUgPSAoJzxkaXYgY2xhc3M9XCJzaG9wcGluZy1saXN0X19wcm9kdWN0LXNpemVcIj4nICsgY2FydEFycmF5W2ldLnNpemUgKyAnPC9kaXY+Jyk7XG5cbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKVxuICAgICAgICAgICAgLnByZXBlbmQoJyA8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyXCIgZGF0YS1pZD0nICsgY2FydEFycmF5W2ldLmlkICsgJz4nICsgcHJvZHVjdFBob3RvICsgcHJvZHVjdFNpemUgKyBwcm9kdWN0QW1vdW50ICsgcHJvZHVjdFByaWNlICsgZGVsZXRlQnV0dG9uICsgJzwvZGl2PicpO1xuXG4gICAgfVxufTtcblxudmFyIHRvdGFsU3VtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWxpdmVyeVByaWNlID0gcGFyc2VJbnQoJCgnLnNob3BwaW5nLWxpc3RfX2RlbGl2ZXJ5LXByaWNlJykudGV4dCgpKTtcbiAgICB2YXIgdG90YWxTdW0gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRvdGFsU3VtICs9IHBhcnNlSW50KGNhcnRBcnJheVtpXS5wcmljZSAqIGNhcnRBcnJheVtpXS5hbW91bnQpO1xuICAgIH1cbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxpdmVyeVByaWNlID0gMDtcbiAgICB9XG4gICAgcmV0dXJuICckJyArICh0b3RhbFN1bSArIGRlbGl2ZXJ5UHJpY2UpO1xufTtcblxuLy8gQXJyYXkgUmVtb3ZlIC0gQnkgSm9obiBSZXNpZyAoTUlUIExpY2Vuc2VkKVxuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxudmFyIGRlbGV0ZVByb2R1Y3RGcm9tQmFza2V0ID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBjYXJ0QXJyYXkuaW5kZXhPZihjYXJ0QXJyYXlbaV0pO1xuICAgICAgICAgICAgY2FydEFycmF5LnJlbW92ZShpbmRleCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzMCk7XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoY2FydEFycmF5Lmxlbmd0aCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX2VtcHR5LWJhc2tldCcpLnNob3coKTtcbiAgICAgICAgJCgnLnNob3BwaW5nLWxpc3RfX2J1eS1idXR0b24nKS5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcbiAgICB9XG59O1xuXG52YXIgc3VtT2ZQcm9kdWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3VtT2ZQcm9kdWN0cyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3VtT2ZQcm9kdWN0cyArPSBjYXJ0QXJyYXlbaV0uYW1vdW50O1xuICAgIH1cbiAgICByZXR1cm4gc3VtT2ZQcm9kdWN0cztcbn07XG5cbnZhciBpbmNyZWFzZUFtb3VudE9mUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgICAgICAgICBjYXJ0QXJyYXlbaV0uYW1vdW50Kys7XG4gICAgICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDMwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xufTtcblxudmFyIGRlY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQtLTtcbiAgICAgICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uYW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlUHJvZHVjdEZyb21CYXNrZXQocHJvZHVjdElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuICAgICAgICB9XG4gICAgfVxuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgIHJlbmRlckNhcnQoKTtcbiAgICBkaXNhYmxlQnV5QnV0dG9uKCk7XG5cbn07XG5cbnZhciBkaXNhYmxlQnV5QnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19idXktYnV0dG9uJykuYWRkQ2xhc3MoJ3Nob3BwaW5nLWxpc3RfX2J1eS1idXR0b24tLWRpc2FibGVkJyk7XG4gICAgICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19idXktYnV0dG9uJykuYWRkQ2xhc3MoJ3NoaXBwaW5nLWFkZHJlc3NfX2J1eS1idXR0b24tLWRpc2FibGVkJyk7XG4gICAgfVxufTtcblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX3BsdXMtYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMuY2xvc2VzdCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpKS5kYXRhKCdpZCcpO1xuICAgIGluY3JlYXNlQW1vdW50T2ZQcm9kdWN0cyhwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KHN1bU9mUHJvZHVjdHMoKSk7XG59KTtcblxuJCgnLnNob3BwaW5nLWxpc3RfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWNyZWFzZUFtb3VudE9mUHJvZHVjdHMocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cblxuaWYgKCQoJy5zaG9wcGluZy1saXN0JykubGVuZ3RoICE9PSAwKSB7XG4gICAgcmVuZGVyQ2FydCgpO1xufVxuXG5kaXNhYmxlQnV5QnV0dG9uKCk7XG5cbiQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJykub24oJ2NsaWNrJywgJy5zaG9wcGluZy1saXN0X19kZWxldGUtYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMuY2xvc2VzdCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlcicpKS5kYXRhKCdpZCcpO1xuICAgIGRlbGV0ZVByb2R1Y3RGcm9tQmFza2V0KHByb2R1Y3RJZCk7XG59KTtcblxuJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4kKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xuXG5cbi8vYWRkIHByb2R1Y3RzIHRvIGNhcnRcbiQoJy5wcm9kdWN0c19fd3JhcHBlcicpLm9uKCdjbGljaycsICcucHJvZHVjdHNfX2J1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgICQoJy5tb2RhbC1ib3gnKS5zaG93KCk7XG4gICAgYWRkUHJvZHVjdFRvQ2FydChwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KHN1bU9mUHJvZHVjdHMoKSk7XG59KTtcblxuXG4iLCJ2YXIgdmFsaWRhdGVGb3JtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIHZhciBlbWFpbFJlID0gL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05LV0rKD86XFwuW2EtekEtWjAtOS1dKykqJC87XG4gICAgdmFyIHBvc3RhbENvZGVSZSA9IC9bMC05XXsyfVxcLVswLTldezN9LztcbiAgICB2YXIgcGhvbmVOclJlID0gL1swLTldJC87XG5cbiAgICB2YXIgJGVtYWlsID0gJCgnLmZvcm0gaW5wdXRbdHlwZT1lbWFpbF0nKTtcbiAgICB2YXIgJHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpO1xuICAgIHZhciAkcGhvbmVOdW1iZXIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKTtcblxuICAgIHZhciBpc0VtYWlsID0gZW1haWxSZS50ZXN0KCRlbWFpbC52YWwoKSk7XG4gICAgdmFyIGlzUG9zdGFsQ29kZSA9IHBvc3RhbENvZGVSZS50ZXN0KCRwb3N0YWxDb2RlLnZhbCgpKTtcbiAgICB2YXIgaXNQaG9uZU5yID0gcGhvbmVOclJlLnRlc3QoJHBob25lTnVtYmVyLnZhbCgpKTtcblxuICAgICQoJy5mb3JtIGlucHV0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpID09ICcnKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJGVtYWlsLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzRW1haWwpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcG9zdGFsQ29kZS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1Bvc3RhbENvZGUpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcGhvbmVOdW1iZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQaG9uZU5yIHx8ICRwaG9uZU51bWJlci52YWwoKS5sZW5ndGggPCA5KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGlzVmFsaWQgJiYgaXNFbWFpbCAmJiBpc1Bvc3RhbENvZGUgJiYgaXNQaG9uZU5yKSB7XG4gICAgICAgICQoJy5hZGRyZXNzLWRhdGEnKS5oaWRlKCk7XG4gICAgICAgIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzKCk7XG4gICAgICAgICQoJy5jb250YWluZXItLWZvcm0nKS5zaG93KCk7XG4gICAgICAgIHNjcm9sbFRvRWxlbWVudCgnLnNob3BwaW5nLWxpc3QnKTtcbiAgICB9XG59O1xuXG4vL3JlYWQgaW4gYSBmb3JtJ3MgZGF0YSBhbmQgY29udmVydCBpdCB0byBhIGtleTp2YWx1ZSBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0pIHtcbiAgICB2YXIgb3V0ID0ge307XG4gICAgdmFyIGRhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgLy90cmFuc2Zvcm0gaW50byBzaW1wbGUgZGF0YS92YWx1ZSBvYmplY3RcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IGRhdGFbaV07XG4gICAgICAgIG91dFtyZWNvcmQubmFtZV0gPSByZWNvcmQudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbiQoJy5hZGRyZXNzLWRhdGFfX2J1eS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YWxpZGF0ZUZvcm0oKTtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbn0pO1xuXG4kKCcuYWRkcmVzcy1kYXRhX19mb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgICQoJy5tb2RhbC1ib3gtLWZvcm0nKS5zaG93KCk7XG4gICAgdmFyIGRhdGFUb1NlbmQgPSB7XG4gICAgICAgIGNvbnRhY3REYXRhOiBnZXRGb3JtRGF0YSgnI2FkZHJlc3MtZGF0YScpLFxuICAgICAgICBjYXJ0OiBjYXJ0QXJyYXlcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKGRhdGFUb1NlbmQpO1xuICAgIGNhcnRBcnJheSA9IFtdO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xufSk7IiwidmFyIHRvZ2dsZUZpeGVkRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZmlsdGVyID0gJCgnLmZpbHRlcicpO1xuXG4gICAgaWYgKCEkZmlsdGVyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRvY3VtZW50UG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgdmFyIGZpbHRlck9mZnNldCA9ICRmaWx0ZXIucGFyZW50KCkub2Zmc2V0KCkudG9wO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID49IGZpbHRlck9mZnNldCkge1xuICAgICAgICAkZmlsdGVyLmFkZENsYXNzKCdmaWx0ZXItLWZpeGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGZpbHRlci5yZW1vdmVDbGFzcygnZmlsdGVyLS1maXhlZCcpO1xuICAgIH1cbn07XG5cbnZhciBzZXRGaWx0ZXJNYXhIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCQoJy5maWx0ZXInKS5oZWlnaHQoKSA+ICQod2luZG93KS5oZWlnaHQoKSkge1xuICAgICAgICAkKCcuZmlsdGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJCh3aW5kb3cpLmhlaWdodCgpKVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJy5maWx0ZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG4gICAgfVxufTtcblxudmFyIGZpbHRlcmVkUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLmhpZGUoKTtcbiAgICAkKCcucHJvZHVjdHNfX3dyYXBwZXInKS5odG1sKCcnKTtcbiAgICB2YXIgbWF4ID0gcGFyc2VJbnQoJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKCkpO1xuICAgIHZhciBtaW4gPSBwYXJzZUludCgkKCcuZmlsdGVyX19wcmljZS1yYW5nZSBpbnB1dFtuYW1lPW1pbl0nKS52YWwoKSk7XG5cbiAgICB2YXIgY29sb3JBcnJheSA9IG1ha2VDb2xvckFycmF5KCk7XG4gICAgdmFyIHNpemVBcnJheSA9IG1ha2VTaXplQXJyYXkoKTtcbiAgICB2YXIgZmFicmljc0FycmF5ID0gbWFrZUZhYnJpY3NBcnJheSgpO1xuICAgIHZhciBmaWx0ZXJlZCA9IHByb2R1Y3RzO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlCbGluZ1ByaWNlcyhmaWx0ZXJlZCwgbWluLCBtYXgpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlDb2xvcnMoZmlsdGVyZWQsIGNvbG9yQXJyYXkpO1xuICAgIGZpbHRlcmVkID0gZmlsdGVyQnlTaXplcyhmaWx0ZXJlZCwgc2l6ZUFycmF5KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5RmFicmljcyhmaWx0ZXJlZCwgZmFicmljc0FycmF5KTtcbiAgICByZW5kZXJQcm9kdWN0cyhmaWx0ZXJlZCk7XG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLnNob3coKTtcbiAgICB9XG59O1xuXG4vL2ZpbHRlciBwcm9kdWN0c1xudmFyIGZpbHRlckJ5QmxpbmdQcmljZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnByaWNlID49IG1pbiAmJiB2YWx1ZS5wcmljZSA8PSBtYXg7XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlDb2xvcnMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIGNvbG9yQXJyYXkpIHtcbiAgICBpZiAoY29sb3JBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jb2xvciA9PT0gY29sb3JBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlTaXplcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgc2l6ZUFycmF5KSB7XG4gICAgaWYgKHNpemVBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLnNpemUgPT09IHNpemVBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG52YXIgZmlsdGVyQnlGYWJyaWNzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBmYWJyaWNBcnJheSkge1xuICAgIGlmIChmYWJyaWNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhYnJpY0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuZmFicmljID09PSBmYWJyaWNBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cbi8vZmlsdGVyIGFycmF5c1xudmFyIG1ha2VDb2xvckFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZENvbG9ycyA9IFtdO1xuICAgICQoJy5jb2xvcnMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxlY3RlZENvbG9ycy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZENvbG9ycztcbn07XG5cbnZhciBtYWtlU2l6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZFNpemVzID0gW107XG4gICAgJCgnLnNpemVzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRTaXplcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZFNpemVzO1xufTtcblxudmFyIG1ha2VGYWJyaWNzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmFicmljcyA9IFtdO1xuICAgICQoJy5mYWJyaWNzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRGYWJyaWNzLnB1c2goJCh0aGlzKS5hdHRyKCduYW1lJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkRmFicmljcztcbn07XG5cbnZhciBhZGRIZWlnaHRUb0NvbnRhaW5lclNpZGViYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gOTIwKSB7XG4gICAgICAgIHZhciBmaWx0ZXJIZWlnaHQgPSAkKCcuZmlsdGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICQoJy5jb250YWluZXJfX3NpZGViYXInKS5jc3MoJ2hlaWdodCcsIGZpbHRlckhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmNvbnRhaW5lcl9fc2lkZWJhcicpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgIH1cbn07XG5cbnZhciBzdG9wRmlsdGVyQmVmb3JlRm9vdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmaWx0ZXIgPSAkKCcuZmlsdGVyJyk7XG4gICAgdmFyIGZpbHRlckhlaWdodCA9ICQoJy5maWx0ZXInKS5oZWlnaHQoKTtcbiAgICB2YXIgZm9vdGVyT2Zmc2V0ID0gJCgnLnNvY2lhbC1saW5rcycpLm9mZnNldCgpLnRvcCAtIDEwMDtcbiAgICB2YXIgZm9vdGVySGVpZ2h0ID0gJCgnLnNvY2lhbC1saW5rcycpLmhlaWdodCgpO1xuICAgIHZhciBzdG9wUG9pbnQgPSBmb290ZXJPZmZzZXQgLSBmaWx0ZXJIZWlnaHQ7XG5cbiAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+PSBzdG9wUG9pbnQpIHtcbiAgICAgICAgZmlsdGVyLmFkZENsYXNzKCdmaWx0ZXItLXN0b3AnKTtcbiAgICAgICAgZmlsdGVyLmNzcygndG9wJywgZm9vdGVyT2Zmc2V0IC0gZm9vdGVySGVpZ2h0IC0gZmlsdGVySGVpZ2h0ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsdGVyLnJlbW92ZUNsYXNzKCdmaWx0ZXItLXN0b3AnKTtcbiAgICAgICAgZmlsdGVyLmNzcygndG9wJywgJzAnKTtcbiAgICB9XG59O1xuXG4kKCcuZmlsdGVyX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgc2Nyb2xsVG9FbGVtZW50KCcucHJvZHVjdHNfX3dyYXBwZXInKTtcbn0pO1xuXG5pZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MjApIHtcbiAgICBzZXRGaWx0ZXJNYXhIZWlnaHQoKTtcbn1cblxuJCgnLmZpbHRlcl9fdGl0bGUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXNpYmxlQ2xhc3MgPSAnZmlsdGVyX193cmFwcGVyLS12aXNpYmxlJztcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnZmlsdGVyX190aXRsZS1idXR0b24tLWFjdGl2ZSc7XG4gICAgJCgnLmZpbHRlcl9fd3JhcHBlcicpLmZhZGVUb2dnbGUodmlzaWJsZUNsYXNzKTtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKGJ1dHRvbkFjdGl2ZUNsYXNzKTtcbn0pO1xuXG4kKCcuZmlsdGVyX19yZXNldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgICQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgICQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWF4XScpLnZhbCgxMDApO1xuICAgICQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWluXScpLnZhbCgwKTtcbiAgICAkKCcucHJvZHVjdHNfX25vdC1mb3VuZCcpLmhpZGUoKTtcbn0pO1xuXG5hZGRIZWlnaHRUb0NvbnRhaW5lclNpZGViYXIoKTsiLCJmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHtsYXQ6IDUxLjEwMjA3NSwgbG5nOiAxNy4wNDkyNjJ9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiB0cnVlLFxuICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgbWFwOiBtYXBcbiAgICB9KTtcbn1cbiIsInZhciBmaXhNb2RhbEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLm1vZGFsLWJveF9fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLm1vZGFsLWJveF9fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdtb2RhbC1ib3hfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG4kKCcubW9kYWwtYm94X19zaG9wcGluZy1idXR0b24sIC5tb2RhbC1ib3hfX2Nsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcubW9kYWwtYm94JykuaGlkZSgpO1xufSk7XG4iLCIkKCcubmF2X19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYnV0dG9uQWN0aXZlQ2xhc3MgPSAnbmF2X19idXR0b24tLWFjdGl2ZSc7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcyhidXR0b25BY3RpdmVDbGFzcyk7XG4gICAgJCgnLm5hdl9fbWVudScpLnRvZ2dsZUNsYXNzKCd2aXNpYmxlJyk7XG59KTsiLCJ2YXIgZml4UHJldmlld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50SGVpZ2h0ID0gJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5oZWlnaHQoKTtcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ3ByZXZpZXdfX2NvbnRlbnQtLWxhcmdlJywgY29udGVudEhlaWdodCA+IHdpbmRvd0hlaWdodCk7XG59O1xuXG52YXIgc2hvd1ByZXZpZXcgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgdmFyIHBob3RvU3JjID0gcHJvZHVjdHNbcHJvZHVjdElkXS5zcmM7XG4gICAgdmFyIHByb2R1Y3RGYWJyaWMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLmZhYnJpYztcbiAgICB2YXIgcHJvZHVjdFNpemUgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNpemU7XG4gICAgdmFyIHByb2R1Y3RQcmljZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0ucHJpY2U7XG4gICAgdmFyIHByb2R1Y3RUaXRsZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0udGl0bGU7XG4gICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZGVzY3JpcHRpb247XG5cbiAgICAkKCcucHJldmlldycpLnNob3coKTtcbiAgICAkKCcucHJldmlld19fcGhvdG8taXRlbScpLmF0dHIoJ3NyYycsIHBob3RvU3JjKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1mYWJyaWMgc3BhbicpLnRleHQocHJvZHVjdEZhYnJpYyk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3Qtc2l6ZSBzcGFuJykudGV4dChwcm9kdWN0U2l6ZSk7XG4gICAgJCgnLnByZXZpZXdfX3Byb2R1Y3QtcHJpY2Ugc3BhbicpLnRleHQoJyQnICsgcHJvZHVjdFByaWNlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC10aXRsZScpLnRleHQocHJvZHVjdFRpdGxlKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1kZXNjcmlwdGlvbi10ZXh0JykudGV4dChwcm9kdWN0RGVzY3JpcHRpb24pO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnLCBwcm9kdWN0c1twcm9kdWN0SWRdLmlkKTtcbiAgICAkKCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ3ByaWNlJywgcHJvZHVjdFByaWNlKTtcblxuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xufTtcblxuJCgnLnByb2R1Y3RzX193cmFwcGVyJykub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fcHJldmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJvZHVjdHNfX2l0ZW0nKS5pbmRleCgpO1xuICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG59KTtcblxuJCgnLnByZXZpZXdfX25leHQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSArIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHMubGVuZ3RoKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19wcmV2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJykgLSAxO1xuICAgIGlmIChwcm9kdWN0SWQgPT09IC0xKSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dQcmV2aWV3KHByb2R1Y3RJZCk7XG4gICAgfVxufSk7XG5cbiQoJy5wcmV2aWV3X19jbG9zZS1idXR0b24sIC5wcmV2aWV3X19zaG9wcGluZy1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnByZXZpZXcnKS5oaWRlKCk7XG59KTtcblxuJCgnLnByZXZpZXdfX2Jhc2tldC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpO1xuICAgIGFkZFByb2R1Y3RUb0NhcnQocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChjYXJ0QXJyYXkubGVuZ3RoKTtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbiAgICAkKCcubW9kYWwtYm94Jykuc2hvdygpO1xufSk7IiwidmFyIHByb2R1Y3RzO1xudmFyIHByb2R1Y3RzV3JhcHBlciA9ICQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xuXG52YXIgcmVuZGVyUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdHMpIHtcbiAgICBwcm9kdWN0c1dyYXBwZXIuaHRtbCgnJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvZHVjdEl0ZW0gPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19faXRlbScsXG4gICAgICAgICAgICAnZGF0YS1jb2xvcic6IHByb2R1Y3RzW2ldLmNvbG9yLFxuICAgICAgICAgICAgJ2RhdGEtc2l6ZSc6IHByb2R1Y3RzW2ldLnNpemUsXG4gICAgICAgICAgICAnZGF0YS1mYWJyaWMnOiBwcm9kdWN0c1tpXS5mYWJyaWMsXG4gICAgICAgICAgICAnZGF0YS1wcmljZSc6IHByb2R1Y3RzW2ldLnByaWNlXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdEltYWdlID0gJCgnPGRpdj4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAncHJvZHVjdHNfX3Bob3RvJyxcbiAgICAgICAgICAgICdzdHlsZSc6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIHByb2R1Y3RzW2ldLnNyYyArICcpJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RUaXRsZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fdGl0bGUnfSkudGV4dChwcm9kdWN0c1tpXS50aXRsZSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW5mbyA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19faW5mbyd9KTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUtbGFiZWwnfSkudGV4dCgnc2l6ZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0U2l6ZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3NpemUnfSkudGV4dChwcm9kdWN0c1tpXS5zaXplKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZUxhYmVsID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZS1sYWJlbCd9KS50ZXh0KCdwcmljZTogJyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJpY2UgPSAkKCc8c3Bhbj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19wcmljZSd9KS50ZXh0KCckJyArIHByb2R1Y3RzW2ldLnByaWNlKTtcbiAgICAgICAgdmFyIHByb2R1Y3REZXNjcmlwdGlvbiA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fZGVzY3JpcHRpb24nfSkudGV4dChwcm9kdWN0c1tpXS5kZXNjcmlwdGlvbik7XG4gICAgICAgIHZhciBwcm9kdWN0QnV0dG9uID0gJCgnPGJ1dHRvbiBjbGFzcz1cInByb2R1Y3RzX19idXR0b25cIj5hZGQgdG8gY2FydDwvYnV0dG9uPicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByZXZpZXcgPSAkKCc8ZGl2IGNsYXNzPVwicHJvZHVjdHNfX3ByZXZpZXdcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT48L2Rpdj4nKTtcblxuICAgICAgICBwcm9kdWN0c1dyYXBwZXIuYXBwZW5kKHByb2R1Y3RJdGVtKTtcbiAgICAgICAgcHJvZHVjdEl0ZW1cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEltYWdlKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RJbmZvKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0RGVzY3JpcHRpb24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RCdXR0b24pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RQcmV2aWV3KTtcbiAgICAgICAgcHJvZHVjdEluZm9cbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFNpemVMYWJlbClcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByaWNlTGFiZWwpO1xuICAgICAgICBwcm9kdWN0U2l6ZUxhYmVsLmFwcGVuZChwcm9kdWN0U2l6ZSk7XG4gICAgICAgIHByb2R1Y3RQcmljZUxhYmVsLmFwcGVuZChwcm9kdWN0UHJpY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm9kdWN0c09uUGFnZSA9ICQoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW0nKTtcbiAgICBwcm9kdWN0c09uUGFnZS5oaWRlKCk7XG4gICAgcHJvZHVjdHNPblBhZ2Uuc2xpY2UoMCwgNCkuc2hvdygpO1xuICAgIGlmIChwcm9kdWN0c09uUGFnZS5sZW5ndGggPiA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG59O1xuXG52YXIgbG9hZFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2RiL3Byb2R1Y3RzLmpzb24nLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvZHVjdHMgPSByZXNwb25zZS5wcm9kdWN0cztcbiAgICAgICAgcmVuZGVyUHJvZHVjdHMocHJvZHVjdHMpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxufTtcblxuLy9zaG93IG5leHQgcHJvZHVjdHNcbnZhciBzaG93TmV4dFByb2R1Y3RzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgaXRlbXMgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBuZXh0SXRlbXMgPSBpdGVtcy5zbGljZSgwLCA0KTtcblxuICAgIGlmIChuZXh0SXRlbXMubGVuZ3RoIDwgNCkge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgICAgICAkKCcuYmxvZ19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgbmV4dEl0ZW1zLnNob3coKTtcbn07XG5cbmxvYWRQcm9kdWN0cygpO1xuXG4kKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNob3dOZXh0UHJvZHVjdHMoJy5wcm9kdWN0c19fd3JhcHBlciAucHJvZHVjdHNfX2l0ZW06aGlkZGVuJyk7XG59KTsiLCJ2YXIgc2Nyb2xsVG9FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgJHRhcmdldEVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBwb3NpdGlvbiA9ICR0YXJnZXRFbGVtZW50Lm9mZnNldCgpLnRvcDtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBwb3NpdGlvbn0sIDE1MDApO1xufTtcblxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdG9nZ2xlQmFja1RvVG9wQnV0dG9uKCk7XG4gICAgdG9nZ2xlRml4ZWRGaWx0ZXIoKTtcbiAgICBzdG9wRmlsdGVyQmVmb3JlRm9vdGVyKCk7XG59KTtcblxuJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgZml4UHJldmlld1Bvc2l0aW9uKCk7XG4gICAgZml4TW9kYWxCb3hQb3NpdGlvbigpO1xuICAgIHNldEZpbHRlck1heEhlaWdodCgpO1xuICAgIGFkZEhlaWdodFRvQ29udGFpbmVyU2lkZWJhcigpO1xufSk7IiwidmFyIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZSA9ICQoJy5mb3JtIHNlbGVjdCcpLnZhbCgpO1xuICAgIHZhciBmaXJzdE5hbWUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZpcnN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIGxhc3ROYW1lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1sYXN0LW5hbWVdJykudmFsKCk7XG4gICAgdmFyIHN0cmVldCA9ICQoJy5mb3JtIGlucHV0W25hbWU9c3RyZWV0XScpLnZhbCgpO1xuICAgIHZhciBob21lTnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWhvbWUtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBmbGF0TnIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWZsYXQtbnVtYmVyXScpLnZhbCgpO1xuICAgIHZhciBwb3N0YWxDb2RlID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1wb3N0YWwtY29kZV0nKS52YWwoKTtcbiAgICB2YXIgY2l0eSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y2l0eV0nKS52YWwoKTtcbiAgICB2YXIgY291bnRyeSA9ICQoJy5mb3JtIGlucHV0W25hbWU9Y291bnRyeV0nKS52YWwoKTtcbiAgICB2YXIgcGhvbmUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgZW1haWwgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWVtYWlsXScpLnZhbCgpO1xuXG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX25hbWUnKS50ZXh0KHRpdGxlICsgJyAnICsgZmlyc3ROYW1lICsgJyAnICsgbGFzdE5hbWUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19zdHJlZXQnKS50ZXh0KHN0cmVldCArICcgJyArIGhvbWVOciArICcgJyArIGZsYXROcik7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX3Bvc3RhbC1jb2RlJykudGV4dChwb3N0YWxDb2RlKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fY2l0eScpLnRleHQoY2l0eSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2NvdW50cnknKS50ZXh0KGNvdW50cnkpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19waG9uZScpLnRleHQocGhvbmUpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19lbWFpbCcpLnRleHQoZW1haWwpO1xufTtcblxuJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2VkaXQtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5hZGRyZXNzLWRhdGEnKS5zaG93KCk7XG4gICAgJCgnLmFkZHJlc3MtZGF0YV9fZ28tYmFjay1idXR0b24nKS5oaWRlKCk7XG4gICAgJCgnLmNvbnRhaW5lci0tZm9ybScpLmhpZGUoKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5hZGRyZXNzLWRhdGEnKTtcbn0pO1xuXG4iLCIkKCcuc2xpZGVyX19pdGVtcycpLnNsaWNrKHtcbiAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgZG90czogZmFsc2UsXG4gICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcbiAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICBhcnJvd3M6IGZhbHNlLFxuICAgIGNlbnRlclBhZGRpbmc6IDAsXG4gICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICB7XG4gICAgICAgICAgICBicmVha3BvaW50OiAxMjgwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogODAwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufSk7Il19
