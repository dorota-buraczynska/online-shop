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
    $('.products__not-found').hide();
});

var database = firebase.database();

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

database.ref('/entries').once('value').then(function(snapshot) {
    renderEntries(snapshot.val());
});

// var loadEntries = function () {
//     $.ajax({
//         url: 'db/entries.json',
//         method: 'GET',
//         dataType: 'json'
//     }).done(function (response) {
//         renderEntries(response.entries);
//     }).fail(function (error) {
//         console.log(error);
//     })
// };

// loadEntries();

$('.blog__button-next').on('click', function () {
    showNextProducts('.blog__wrapper .blog__entry:hidden');
});

var cartArray = readCookie('cart') || [];
var $shoppingListWrapper = $('.shopping-list__wrapper');

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

$shoppingListWrapper.on('click', '.shopping-list__plus-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    increaseAmountOfProducts(productId);
    $('.nav__basket-amount').text(sumOfProducts());
});

$shoppingListWrapper.on('click', '.shopping-list__minus-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    decreaseAmountOfProducts(productId);
    $('.nav__basket-amount').text(sumOfProducts());
});


if ($('.shopping-list').length !== 0) {
    renderCart();
}

disableBuyButton();

$shoppingListWrapper.on('click', '.shopping-list__delete-button', function () {
    var productId = $(this.closest('.shopping-list__product-wrapper')).data('id');
    deleteProductFromBasket(productId);
});

$('.shopping-list__product-total-price span').text(totalSum());
$('.nav__basket-amount').text(sumOfProducts());





var validateForm = function () {
    var isValid = true;

    var emailRe = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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

    database.ref('/order').push().set(dataToSend)
        .then(function () {
            cartArray = [];
            createCookie('cart', cartArray, 30);
        })
        .catch(function () {
            alert('We\'re very sorry, but something went wrong. Please try again later');
        });
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
        var filterHeight = $('.filter').outerHeight();
        $('.container__sidebar').css('height', filterHeight);
    } else {
        $('.container__sidebar').css('height', '');
    }
};

var stopFilterBeforeFooter = function () {
    var filter = $('.filter');
    var filterHeight = $('.filter').outerHeight();
    var footerOffset = $('.social-links').offset().top;
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
    database.ref('/products').on('value', function (snapshot) {
        products = snapshot.val();
        renderProducts(products);
    });
    // $.ajax({
    //     url: 'db/products.json',
    //     method: 'GET',
    //     dataType: 'json'
    // }).done(function (response) {
    //     products = response.products;
    //     renderProducts(products);
    // }).fail(function (error) {
    //     console.log(error);
    // })
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

//add products to cart
productsWrapper.on('click', '.products__button', function () {
    var productId = $(this).closest('.products__item').index();
    $('.modal-box').show();
    addProductToCart(productId);
    $('.nav__basket-amount').text(sumOfProducts());
});

var scrollToElement = function (element) {
    var $targetElement = $(element);
    var position = $targetElement.offset().top;
    $('html, body').animate({scrollTop: position}, 1500);
};

$(window).on('scroll', function () {
    toggleBackToTopButton();
    if ($(window).width() > 920) {
        toggleFixedFilter();
        stopFilterBeforeFooter();
    }
});

$(window).on('resize', function () {
    fixPreviewPosition();
    fixModalBoxPosition();
    if ($(window).width() > 920) {
        setFilterMaxHeight();
        addHeightToContainerSidebar();
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2stdG8tdG9wLWJ1dHRvbi5qcyIsImJsb2cuanMiLCJjYXJ0LmpzIiwiZGF0YS1mb3JtLmpzIiwiZmlsdGVyLmpzIiwibWFwLmpzIiwibW9kYWwtYm94LmpzIiwibmF2LmpzIiwicHJldmlldy5qcyIsInByb2R1Y3RzLmpzIiwic2NyaXB0LmpzIiwic2hpcHBpbmctbGlzdC5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9nZ2xlQmFja1RvVG9wQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW51SGVpZ2h0ID0gJCgnLm5hdicpLmhlaWdodCgpO1xuICAgIHZhciBkb2N1bWVudFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIGlmIChkb2N1bWVudFBvc2l0aW9uID4gbWVudUhlaWdodCkge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuYmFjay10by10b3BfX2J1dHRvbicpLmhpZGUoKTtcbiAgICB9XG59O1xuXG4kKCcuYmFjay10by10b3BfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDE1MDApO1xuICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuaGlkZSgpO1xufSk7XG4iLCJ2YXIgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xuXG52YXIgcmVuZGVyRW50cmllcyA9IGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgdmFyIGJsb2dXcmFwcGVyID0gJCgnLmJsb2dfX3dyYXBwZXInKTtcbiAgICBibG9nV3JhcHBlci5lbXB0eSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZW50cnkgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeScsXG4gICAgICAgICAgICAnZGF0YS1pZCc6IGVudHJpZXNbaV0uaWRcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbnRyeVBob3RvID0gJCgnPGltZz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiBcImJsb2dfX2VudHJ5LXBob3RvXCIsXG4gICAgICAgICAgICAnc3JjJzogZW50cmllc1tpXS5pbWdfc3JjXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW50cmllc1dyYXBwZXIgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdibG9nX19lbnRyeS13cmFwcGVyJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGVudHJ5VGl0bGUgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAnYmxvZ19fZW50cnktdGl0bGUnfSkudGV4dChlbnRyaWVzW2ldLnRpdGxlKTtcbiAgICAgICAgdmFyIGVudHJ5VGV4dCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS10ZXh0J30pLnRleHQoZW50cmllc1tpXS50ZXh0KTtcbiAgICAgICAgdmFyIGVudHJ5RGF0ZSA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdibG9nX19lbnRyeS1kYXRlJ30pLnRleHQoZW50cmllc1tpXS5kYXRlKTtcbiAgICAgICAgdmFyIGVudHJ5QnV0dG9uID0gJCgnPGJ1dHRvbj4nLCB7J2NsYXNzJzogJ2Jsb2dfX2J1dHRvbid9KS50ZXh0KCdyZWFkIG1vcmUnKTtcblxuICAgICAgICBibG9nV3JhcHBlci5hcHBlbmQoZW50cnkpO1xuICAgICAgICBlbnRyeVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeVBob3RvKVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyaWVzV3JhcHBlcik7XG4gICAgICAgIGVudHJpZXNXcmFwcGVyXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5VGl0bGUpXG4gICAgICAgICAgICAuYXBwZW5kKGVudHJ5RGF0ZSlcbiAgICAgICAgICAgIC5hcHBlbmQoZW50cnlUZXh0KVxuICAgICAgICAgICAgLmFwcGVuZChlbnRyeUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdmFyIGVudHJpZXNPblBhZ2UgPSAkKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnknKTtcbiAgICBlbnRyaWVzT25QYWdlLmhpZGUoKTtcbiAgICBlbnRyaWVzT25QYWdlLnNsaWNlKDAsIDMpLnNob3coKTtcbiAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0Jykuc2hvdygpO1xufTtcblxuZGF0YWJhc2UucmVmKCcvZW50cmllcycpLm9uY2UoJ3ZhbHVlJykudGhlbihmdW5jdGlvbihzbmFwc2hvdCkge1xuICAgIHJlbmRlckVudHJpZXMoc25hcHNob3QudmFsKCkpO1xufSk7XG5cbi8vIHZhciBsb2FkRW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAkLmFqYXgoe1xuLy8gICAgICAgICB1cmw6ICdkYi9lbnRyaWVzLmpzb24nLFxuLy8gICAgICAgICBtZXRob2Q6ICdHRVQnLFxuLy8gICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4vLyAgICAgfSkuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbi8vICAgICAgICAgcmVuZGVyRW50cmllcyhyZXNwb25zZS5lbnRyaWVzKTtcbi8vICAgICB9KS5mYWlsKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4vLyAgICAgfSlcbi8vIH07XG5cbi8vIGxvYWRFbnRyaWVzKCk7XG5cbiQoJy5ibG9nX19idXR0b24tbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzaG93TmV4dFByb2R1Y3RzKCcuYmxvZ19fd3JhcHBlciAuYmxvZ19fZW50cnk6aGlkZGVuJyk7XG59KTtcbiIsInZhciBjYXJ0QXJyYXkgPSByZWFkQ29va2llKCdjYXJ0JykgfHwgW107XG52YXIgJHNob3BwaW5nTGlzdFdyYXBwZXIgPSAkKCcuc2hvcHBpbmctbGlzdF9fd3JhcHBlcicpO1xuXG4vLyBjb29raWVzXG5mdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIG1pbnV0ZXMpIHtcbiAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKG1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAobWludXRlcyAqIDYwICogMTAwMCkpO1xuICAgICAgICBleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgXCI9XCI7XG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09IDApIHJldHVybiBKU09OLnBhcnNlKGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcbiAgICBjcmVhdGVDb29raWUobmFtZSwgXCJcIiwgLTEpO1xufVxuXG52YXIgYWRkUHJvZHVjdFRvQ2FydCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2FydEFycmF5W2ldLmlkID09PSBwcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIGNhcnRBcnJheVtpXS5hbW91bnQrKztcbiAgICAgICAgICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb2R1Y3QgPSB7XG4gICAgICAgIHBhdGg6IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc3JjLFxuICAgICAgICBwcmljZTogcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZSxcbiAgICAgICAgc2l6ZTogcHJvZHVjdHNbcHJvZHVjdElkXS5zaXplLFxuICAgICAgICBpZDogcHJvZHVjdHNbcHJvZHVjdElkXS5pZCxcbiAgICAgICAgYW1vdW50OiAxXG4gICAgfTtcblxuICAgIGNhcnRBcnJheS5wdXNoKHByb2R1Y3QpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuXG59O1xuXG52YXIgcmVuZGVyQ2FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykucmVtb3ZlKCk7XG4gICAgdmFyIGJ1dHRvbnNXcmFwcGVyID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fYnV0dG9ucy13cmFwcGVyXCI+PGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3BsdXMtYnV0dG9uXCI+JiM0Mzs8L2Rpdj48ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fbWludXMtYnV0dG9uXCI+JiM0NTs8L2Rpdj48L2Rpdj4nKTtcbiAgICB2YXIgZGVsZXRlQnV0dG9uID0gKCc8YnV0dG9uIGNsYXNzPVwic2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvblwiPmRlbGV0ZTwvYnV0dG9uPicpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb2R1Y3RQaG90byA9ICgnPGltZyBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtcGhvdG9cIiBzcmM9XCInICsgY2FydEFycmF5W2ldLnBhdGggKyAnXCI+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0QW1vdW50ID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1hbW91bnRcIj48c3Bhbj4nICsgY2FydEFycmF5W2ldLmFtb3VudCArICc8L3NwYW4+JyArIGJ1dHRvbnNXcmFwcGVyICsgJzwvZGl2PicpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1wcmljZVwiPiQnICsgKGNhcnRBcnJheVtpXS5wcmljZSAqIGNhcnRBcnJheVtpXS5hbW91bnQpICsgJyA8L2Rpdj4nKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplID0gKCc8ZGl2IGNsYXNzPVwic2hvcHBpbmctbGlzdF9fcHJvZHVjdC1zaXplXCI+JyArIGNhcnRBcnJheVtpXS5zaXplICsgJzwvZGl2PicpO1xuXG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X193cmFwcGVyJylcbiAgICAgICAgICAgIC5wcmVwZW5kKCcgPGRpdiBjbGFzcz1cInNob3BwaW5nLWxpc3RfX3Byb2R1Y3Qtd3JhcHBlclwiIGRhdGEtaWQ9JyArIGNhcnRBcnJheVtpXS5pZCArICc+JyArIHByb2R1Y3RQaG90byArIHByb2R1Y3RTaXplICsgcHJvZHVjdEFtb3VudCArIHByb2R1Y3RQcmljZSArIGRlbGV0ZUJ1dHRvbiArICc8L2Rpdj4nKTtcblxuICAgIH1cbn07XG5cbnZhciB0b3RhbFN1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVsaXZlcnlQcmljZSA9IHBhcnNlSW50KCQoJy5zaG9wcGluZy1saXN0X19kZWxpdmVyeS1wcmljZScpLnRleHQoKSk7XG4gICAgdmFyIHRvdGFsU3VtID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbFN1bSArPSBwYXJzZUludChjYXJ0QXJyYXlbaV0ucHJpY2UgKiBjYXJ0QXJyYXlbaV0uYW1vdW50KTtcbiAgICB9XG4gICAgaWYgKGNhcnRBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsaXZlcnlQcmljZSA9IDA7XG4gICAgfVxuICAgIHJldHVybiAnJCcgKyAodG90YWxTdW0gKyBkZWxpdmVyeVByaWNlKTtcbn07XG5cbi8vIEFycmF5IFJlbW92ZSAtIEJ5IEpvaG4gUmVzaWcgKE1JVCBMaWNlbnNlZClcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbnZhciBkZWxldGVQcm9kdWN0RnJvbUJhc2tldCA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnRBcnJheS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FydEFycmF5LmluZGV4T2YoY2FydEFycmF5W2ldKTtcbiAgICAgICAgICAgIGNhcnRBcnJheS5yZW1vdmUoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGNyZWF0ZUNvb2tpZSgnY2FydCcsIGNhcnRBcnJheSwgMzApO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuICAgIGRpc2FibGVCdXlCdXR0b24oKTtcblxuICAgIGlmIChjYXJ0QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19lbXB0eS1iYXNrZXQnKS5zaG93KCk7XG4gICAgICAgICQoJy5zaG9wcGluZy1saXN0X19idXktYnV0dG9uJykuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgfVxufTtcblxudmFyIHN1bU9mUHJvZHVjdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN1bU9mUHJvZHVjdHMgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN1bU9mUHJvZHVjdHMgKz0gY2FydEFycmF5W2ldLmFtb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHN1bU9mUHJvZHVjdHM7XG59O1xuXG52YXIgaW5jcmVhc2VBbW91bnRPZlByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJ0QXJyYXlbaV0uaWQgPT09IHByb2R1Y3RJZCkge1xuICAgICAgICAgICAgY2FydEFycmF5W2ldLmFtb3VudCsrO1xuICAgICAgICAgICAgY3JlYXRlQ29va2llKCdjYXJ0JywgY2FydEFycmF5LCAzMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgJCgnLnNob3BwaW5nLWxpc3RfX3Byb2R1Y3QtdG90YWwtcHJpY2Ugc3BhbicpLnRleHQodG90YWxTdW0oKSk7XG4gICAgcmVuZGVyQ2FydCgpO1xuICAgIGRpc2FibGVCdXlCdXR0b24oKTtcbn07XG5cbnZhciBkZWNyZWFzZUFtb3VudE9mUHJvZHVjdHMgPSBmdW5jdGlvbiAocHJvZHVjdElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcnRBcnJheVtpXS5pZCA9PT0gcHJvZHVjdElkKSB7XG4gICAgICAgICAgICBjYXJ0QXJyYXlbaV0uYW1vdW50LS07XG4gICAgICAgICAgICBpZiAoY2FydEFycmF5W2ldLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZVByb2R1Y3RGcm9tQmFza2V0KHByb2R1Y3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDMwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC10b3RhbC1wcmljZSBzcGFuJykudGV4dCh0b3RhbFN1bSgpKTtcbiAgICByZW5kZXJDYXJ0KCk7XG4gICAgZGlzYWJsZUJ1eUJ1dHRvbigpO1xuXG59O1xuXG52YXIgZGlzYWJsZUJ1eUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fZW1wdHktYmFza2V0Jykuc2hvdygpO1xuICAgICAgICAkKCcuc2hvcHBpbmctbGlzdF9fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaG9wcGluZy1saXN0X19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgICAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fYnV5LWJ1dHRvbicpLmFkZENsYXNzKCdzaGlwcGluZy1hZGRyZXNzX19idXktYnV0dG9uLS1kaXNhYmxlZCcpO1xuICAgIH1cbn07XG5cbiRzaG9wcGluZ0xpc3RXcmFwcGVyLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fcGx1cy1idXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcy5jbG9zZXN0KCcuc2hvcHBpbmctbGlzdF9fcHJvZHVjdC13cmFwcGVyJykpLmRhdGEoJ2lkJyk7XG4gICAgaW5jcmVhc2VBbW91bnRPZlByb2R1Y3RzKHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuXG4kc2hvcHBpbmdMaXN0V3JhcHBlci5vbignY2xpY2snLCAnLnNob3BwaW5nLWxpc3RfX21pbnVzLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWNyZWFzZUFtb3VudE9mUHJvZHVjdHMocHJvZHVjdElkKTtcbiAgICAkKCcubmF2X19iYXNrZXQtYW1vdW50JykudGV4dChzdW1PZlByb2R1Y3RzKCkpO1xufSk7XG5cblxuaWYgKCQoJy5zaG9wcGluZy1saXN0JykubGVuZ3RoICE9PSAwKSB7XG4gICAgcmVuZGVyQ2FydCgpO1xufVxuXG5kaXNhYmxlQnV5QnV0dG9uKCk7XG5cbiRzaG9wcGluZ0xpc3RXcmFwcGVyLm9uKCdjbGljaycsICcuc2hvcHBpbmctbGlzdF9fZGVsZXRlLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzLmNsb3Nlc3QoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXdyYXBwZXInKSkuZGF0YSgnaWQnKTtcbiAgICBkZWxldGVQcm9kdWN0RnJvbUJhc2tldChwcm9kdWN0SWQpO1xufSk7XG5cbiQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xuJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcblxuXG5cblxuIiwidmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG5cbiAgICB2YXIgZW1haWxSZSA9IC9eKFthLXpBLVowLTlfXFwuXFwtXSkrXFxAKChbYS16QS1aMC05XFwtXSkrXFwuKSsoW2EtekEtWjAtOV17Miw0fSkrJC87XG4gICAgdmFyIHBvc3RhbENvZGVSZSA9IC9bMC05XXsyfVxcLVswLTldezN9LztcbiAgICB2YXIgcGhvbmVOclJlID0gL1swLTldJC87XG5cbiAgICB2YXIgJGVtYWlsID0gJCgnLmZvcm0gaW5wdXRbdHlwZT1lbWFpbF0nKTtcbiAgICB2YXIgJHBvc3RhbENvZGUgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBvc3RhbC1jb2RlXScpO1xuICAgIHZhciAkcGhvbmVOdW1iZXIgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXBob25lLW51bWJlcl0nKTtcblxuICAgIHZhciBpc0VtYWlsID0gZW1haWxSZS50ZXN0KCRlbWFpbC52YWwoKSk7XG4gICAgdmFyIGlzUG9zdGFsQ29kZSA9IHBvc3RhbENvZGVSZS50ZXN0KCRwb3N0YWxDb2RlLnZhbCgpKTtcbiAgICB2YXIgaXNQaG9uZU5yID0gcGhvbmVOclJlLnRlc3QoJHBob25lTnVtYmVyLnZhbCgpKTtcblxuICAgICQoJy5mb3JtIGlucHV0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpID09ICcnKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJGVtYWlsLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzRW1haWwpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcG9zdGFsQ29kZS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1Bvc3RhbENvZGUpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZm9ybV9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkcGhvbmVOdW1iZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQaG9uZU5yIHx8ICRwaG9uZU51bWJlci52YWwoKS5sZW5ndGggPCA5KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGlzVmFsaWQgJiYgaXNFbWFpbCAmJiBpc1Bvc3RhbENvZGUgJiYgaXNQaG9uZU5yKSB7XG4gICAgICAgICQoJy5hZGRyZXNzLWRhdGEnKS5oaWRlKCk7XG4gICAgICAgIGNvbXBsZXRlU2hpcHBpbmdBZGRyZXNzKCk7XG4gICAgICAgICQoJy5jb250YWluZXItLWZvcm0nKS5zaG93KCk7XG4gICAgICAgIHNjcm9sbFRvRWxlbWVudCgnLnNob3BwaW5nLWxpc3QnKTtcbiAgICB9XG59O1xuXG4vL3JlYWQgaW4gYSBmb3JtJ3MgZGF0YSBhbmQgY29udmVydCBpdCB0byBhIGtleTp2YWx1ZSBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0pIHtcbiAgICB2YXIgb3V0ID0ge307XG4gICAgdmFyIGRhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG5cbiAgICAvL3RyYW5zZm9ybSBpbnRvIHNpbXBsZSBkYXRhL3ZhbHVlIG9iamVjdFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmVjb3JkID0gZGF0YVtpXTtcbiAgICAgICAgb3V0W3JlY29yZC5uYW1lXSA9IHJlY29yZC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuJCgnLmFkZHJlc3MtZGF0YV9fYnV5LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhbGlkYXRlRm9ybSgpO1xuICAgICQoJy5zaG9wcGluZy1saXN0X19wcm9kdWN0LXRvdGFsLXByaWNlIHNwYW4nKS50ZXh0KHRvdGFsU3VtKCkpO1xufSk7XG5cbiQoJy5hZGRyZXNzLWRhdGFfX2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBmaXhNb2RhbEJveFBvc2l0aW9uKCk7XG4gICAgJCgnLm1vZGFsLWJveC0tZm9ybScpLnNob3coKTtcbiAgICB2YXIgZGF0YVRvU2VuZCA9IHtcbiAgICAgICAgY29udGFjdERhdGE6IGdldEZvcm1EYXRhKCcjYWRkcmVzcy1kYXRhJyksXG4gICAgICAgIGNhcnQ6IGNhcnRBcnJheVxuICAgIH07XG5cbiAgICBkYXRhYmFzZS5yZWYoJy9vcmRlcicpLnB1c2goKS5zZXQoZGF0YVRvU2VuZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FydEFycmF5ID0gW107XG4gICAgICAgICAgICBjcmVhdGVDb29raWUoJ2NhcnQnLCBjYXJ0QXJyYXksIDMwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdXZVxcJ3JlIHZlcnkgc29ycnksIGJ1dCBzb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICB9KTtcbn0pOyIsInZhciB0b2dnbGVGaXhlZEZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGZpbHRlciA9ICQoJy5maWx0ZXInKTtcblxuICAgIGlmICghJGZpbHRlci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkb2N1bWVudFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBmaWx0ZXJPZmZzZXQgPSAkZmlsdGVyLnBhcmVudCgpLm9mZnNldCgpLnRvcDtcbiAgICBpZiAoZG9jdW1lbnRQb3NpdGlvbiA+PSBmaWx0ZXJPZmZzZXQpIHtcbiAgICAgICAgJGZpbHRlci5hZGRDbGFzcygnZmlsdGVyLS1maXhlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRmaWx0ZXIucmVtb3ZlQ2xhc3MoJ2ZpbHRlci0tZml4ZWQnKTtcbiAgICB9XG59O1xuXG52YXIgc2V0RmlsdGVyTWF4SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkKCcuZmlsdGVyJykuaGVpZ2h0KCkgPiAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgJCgnLmZpbHRlcicpLmNzcygnbWF4LWhlaWdodCcsICQod2luZG93KS5oZWlnaHQoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcuZmlsdGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xuICAgIH1cbn07XG5cbnZhciBmaWx0ZXJlZFByb2R1Y3RzID0gZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG4gICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5oaWRlKCk7XG4gICAgJCgnLnByb2R1Y3RzX193cmFwcGVyJykuaHRtbCgnJyk7XG4gICAgdmFyIG1heCA9IHBhcnNlSW50KCQoJy5maWx0ZXJfX3ByaWNlLXJhbmdlIGlucHV0W25hbWU9bWF4XScpLnZhbCgpKTtcbiAgICB2YXIgbWluID0gcGFyc2VJbnQoJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1taW5dJykudmFsKCkpO1xuXG4gICAgdmFyIGNvbG9yQXJyYXkgPSBtYWtlQ29sb3JBcnJheSgpO1xuICAgIHZhciBzaXplQXJyYXkgPSBtYWtlU2l6ZUFycmF5KCk7XG4gICAgdmFyIGZhYnJpY3NBcnJheSA9IG1ha2VGYWJyaWNzQXJyYXkoKTtcbiAgICB2YXIgZmlsdGVyZWQgPSBwcm9kdWN0cztcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5QmxpbmdQcmljZXMoZmlsdGVyZWQsIG1pbiwgbWF4KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5Q29sb3JzKGZpbHRlcmVkLCBjb2xvckFycmF5KTtcbiAgICBmaWx0ZXJlZCA9IGZpbHRlckJ5U2l6ZXMoZmlsdGVyZWQsIHNpemVBcnJheSk7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJCeUZhYnJpY3MoZmlsdGVyZWQsIGZhYnJpY3NBcnJheSk7XG4gICAgcmVuZGVyUHJvZHVjdHMoZmlsdGVyZWQpO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19ub3QtZm91bmQnKS5zaG93KCk7XG4gICAgfVxufTtcblxuLy9maWx0ZXIgcHJvZHVjdHNcbnZhciBmaWx0ZXJCeUJsaW5nUHJpY2VzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBtaW4sIG1heCkge1xuICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5wcmljZSA+PSBtaW4gJiYgdmFsdWUucHJpY2UgPD0gbWF4O1xuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5Q29sb3JzID0gZnVuY3Rpb24gKHByb2R1Y3RzLCBjb2xvckFycmF5KSB7XG4gICAgaWYgKGNvbG9yQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuY29sb3IgPT09IGNvbG9yQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5U2l6ZXMgPSBmdW5jdGlvbiAocHJvZHVjdHMsIHNpemVBcnJheSkge1xuICAgIGlmIChzaXplQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zaXplID09PSBzaXplQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxudmFyIGZpbHRlckJ5RmFicmljcyA9IGZ1bmN0aW9uIChwcm9kdWN0cywgZmFicmljQXJyYXkpIHtcbiAgICBpZiAoZmFicmljQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmYWJyaWNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmZhYnJpYyA9PT0gZmFicmljQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuXG4vL2ZpbHRlciBhcnJheXNcbnZhciBtYWtlQ29sb3JBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRDb2xvcnMgPSBbXTtcbiAgICAkKCcuY29sb3JzIGlucHV0OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZWN0ZWRDb2xvcnMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRDb2xvcnM7XG59O1xuXG52YXIgbWFrZVNpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRTaXplcyA9IFtdO1xuICAgICQoJy5zaXplcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkU2l6ZXMucHVzaCgkKHRoaXMpLmF0dHIoJ25hbWUnKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRTaXplcztcbn07XG5cbnZhciBtYWtlRmFicmljc0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZEZhYnJpY3MgPSBbXTtcbiAgICAkKCcuZmFicmljcyBpbnB1dDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGVjdGVkRmFicmljcy5wdXNoKCQodGhpcykuYXR0cignbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RlZEZhYnJpY3M7XG59O1xuXG52YXIgYWRkSGVpZ2h0VG9Db250YWluZXJTaWRlYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDkyMCkge1xuICAgICAgICB2YXIgZmlsdGVySGVpZ2h0ID0gJCgnLmZpbHRlcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICQoJy5jb250YWluZXJfX3NpZGViYXInKS5jc3MoJ2hlaWdodCcsIGZpbHRlckhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmNvbnRhaW5lcl9fc2lkZWJhcicpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgIH1cbn07XG5cbnZhciBzdG9wRmlsdGVyQmVmb3JlRm9vdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmaWx0ZXIgPSAkKCcuZmlsdGVyJyk7XG4gICAgdmFyIGZpbHRlckhlaWdodCA9ICQoJy5maWx0ZXInKS5vdXRlckhlaWdodCgpO1xuICAgIHZhciBmb290ZXJPZmZzZXQgPSAkKCcuc29jaWFsLWxpbmtzJykub2Zmc2V0KCkudG9wO1xuICAgIHZhciBzdG9wUG9pbnQgPSBmb290ZXJPZmZzZXQgLSBmaWx0ZXJIZWlnaHQ7XG5cbiAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+PSBzdG9wUG9pbnQpIHtcbiAgICAgICAgZmlsdGVyLmFkZENsYXNzKCdmaWx0ZXItLXN0b3AnKTtcbiAgICAgICAgZmlsdGVyLmNzcygndG9wJywgc3RvcFBvaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXIucmVtb3ZlQ2xhc3MoJ2ZpbHRlci0tc3RvcCcpO1xuICAgICAgICBmaWx0ZXIuY3NzKCd0b3AnLCAnMCcpO1xuICAgIH1cbn07XG5cbiQoJy5maWx0ZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWx0ZXJlZFByb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoJy5wcm9kdWN0c19fd3JhcHBlcicpO1xufSk7XG5cbmlmICgkKHdpbmRvdykud2lkdGgoKSA+IDkyMCkge1xuICAgIHNldEZpbHRlck1heEhlaWdodCgpO1xufVxuXG4kKCcuZmlsdGVyX190aXRsZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpc2libGVDbGFzcyA9ICdmaWx0ZXJfX3dyYXBwZXItLXZpc2libGUnO1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICdmaWx0ZXJfX3RpdGxlLWJ1dHRvbi0tYWN0aXZlJztcbiAgICAkKCcuZmlsdGVyX193cmFwcGVyJykuZmFkZVRvZ2dsZSh2aXNpYmxlQ2xhc3MpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoYnV0dG9uQWN0aXZlQ2xhc3MpO1xufSk7XG5cbiQoJy5maWx0ZXJfX3Jlc2V0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgJCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1tYXhdJykudmFsKDEwMCk7XG4gICAgJCgnLmZpbHRlcl9fcHJpY2UtcmFuZ2UgaW5wdXRbbmFtZT1taW5dJykudmFsKDApO1xuICAgICQoJy5wcm9kdWN0c19fbm90LWZvdW5kJykuaGlkZSgpO1xufSk7XG5cbmFkZEhlaWdodFRvQ29udGFpbmVyU2lkZWJhcigpOyIsImZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0ge2xhdDogNTEuMTAyMDc1LCBsbmc6IDE3LjA0OTI2Mn07XG4gICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDE1LFxuICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgbWFwVHlwZUNvbnRyb2w6IHRydWUsXG4gICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlLFxuICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogdHJ1ZVxuICAgIH0pO1xuICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBtYXA6IG1hcFxuICAgIH0pO1xufVxuIiwidmFyIGZpeE1vZGFsQm94UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnRIZWlnaHQgPSAkKCcubW9kYWwtYm94X19jb250ZW50JykuaGVpZ2h0KCk7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAkKCcubW9kYWwtYm94X19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ21vZGFsLWJveF9fY29udGVudC0tbGFyZ2UnLCBjb250ZW50SGVpZ2h0ID4gd2luZG93SGVpZ2h0KTtcbn07XG5cbiQoJy5tb2RhbC1ib3hfX3Nob3BwaW5nLWJ1dHRvbiwgLm1vZGFsLWJveF9fY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5tb2RhbC1ib3gnKS5oaWRlKCk7XG59KTtcbiIsIiQoJy5uYXZfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBidXR0b25BY3RpdmVDbGFzcyA9ICduYXZfX2J1dHRvbi0tYWN0aXZlJztcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKGJ1dHRvbkFjdGl2ZUNsYXNzKTtcbiAgICAkKCcubmF2X19tZW51JykudG9nZ2xlQ2xhc3MoJ3Zpc2libGUnKTtcbn0pOyIsInZhciBmaXhQcmV2aWV3UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnRIZWlnaHQgPSAkKCcucHJldmlld19fY29udGVudCcpLmhlaWdodCgpO1xuICAgIHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS50b2dnbGVDbGFzcygncHJldmlld19fY29udGVudC0tbGFyZ2UnLCBjb250ZW50SGVpZ2h0ID4gd2luZG93SGVpZ2h0KTtcbn07XG5cbnZhciBzaG93UHJldmlldyA9IGZ1bmN0aW9uIChwcm9kdWN0SWQpIHtcbiAgICB2YXIgcGhvdG9TcmMgPSBwcm9kdWN0c1twcm9kdWN0SWRdLnNyYztcbiAgICB2YXIgcHJvZHVjdEZhYnJpYyA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uZmFicmljO1xuICAgIHZhciBwcm9kdWN0U2l6ZSA9IHByb2R1Y3RzW3Byb2R1Y3RJZF0uc2l6ZTtcbiAgICB2YXIgcHJvZHVjdFByaWNlID0gcHJvZHVjdHNbcHJvZHVjdElkXS5wcmljZTtcbiAgICB2YXIgcHJvZHVjdFRpdGxlID0gcHJvZHVjdHNbcHJvZHVjdElkXS50aXRsZTtcbiAgICB2YXIgcHJvZHVjdERlc2NyaXB0aW9uID0gcHJvZHVjdHNbcHJvZHVjdElkXS5kZXNjcmlwdGlvbjtcblxuICAgICQoJy5wcmV2aWV3Jykuc2hvdygpO1xuICAgICQoJy5wcmV2aWV3X19waG90by1pdGVtJykuYXR0cignc3JjJywgcGhvdG9TcmMpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LWZhYnJpYyBzcGFuJykudGV4dChwcm9kdWN0RmFicmljKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1zaXplIHNwYW4nKS50ZXh0KHByb2R1Y3RTaXplKTtcbiAgICAkKCcucHJldmlld19fcHJvZHVjdC1wcmljZSBzcGFuJykudGV4dCgnJCcgKyBwcm9kdWN0UHJpY2UpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LXRpdGxlJykudGV4dChwcm9kdWN0VGl0bGUpO1xuICAgICQoJy5wcmV2aWV3X19wcm9kdWN0LWRlc2NyaXB0aW9uLXRleHQnKS50ZXh0KHByb2R1Y3REZXNjcmlwdGlvbik7XG4gICAgJCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcsIHByb2R1Y3RzW3Byb2R1Y3RJZF0uaWQpO1xuICAgICQoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgncHJpY2UnLCBwcm9kdWN0UHJpY2UpO1xuXG4gICAgZml4UHJldmlld1Bvc2l0aW9uKCk7XG59O1xuXG4kKCcucHJvZHVjdHNfX3dyYXBwZXInKS5vbignY2xpY2snLCAnLnByb2R1Y3RzX19wcmV2aWV3JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpLmluZGV4KCk7XG4gICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbn0pO1xuXG4kKCcucHJldmlld19fbmV4dC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb2R1Y3RJZCA9ICQodGhpcykuY2xvc2VzdCgnLnByZXZpZXdfX2NvbnRlbnQnKS5kYXRhKCdpZCcpICsgMTtcbiAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hvd1ByZXZpZXcoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbiAgICB9XG59KTtcblxuJCgnLnByZXZpZXdfX3ByZXYtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcmV2aWV3X19jb250ZW50JykuZGF0YSgnaWQnKSAtIDE7XG4gICAgaWYgKHByb2R1Y3RJZCA9PT0gLTEpIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdHMubGVuZ3RoIC0gMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd1ByZXZpZXcocHJvZHVjdElkKTtcbiAgICB9XG59KTtcblxuJCgnLnByZXZpZXdfX2Nsb3NlLWJ1dHRvbiwgLnByZXZpZXdfX3Nob3BwaW5nLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcucHJldmlldycpLmhpZGUoKTtcbn0pO1xuXG4kKCcucHJldmlld19fYmFza2V0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5jbG9zZXN0KCcucHJldmlld19fY29udGVudCcpLmRhdGEoJ2lkJyk7XG4gICAgYWRkUHJvZHVjdFRvQ2FydChwcm9kdWN0SWQpO1xuICAgICQoJy5uYXZfX2Jhc2tldC1hbW91bnQnKS50ZXh0KGNhcnRBcnJheS5sZW5ndGgpO1xuICAgICQoJy5wcmV2aWV3JykuaGlkZSgpO1xuICAgICQoJy5tb2RhbC1ib3gnKS5zaG93KCk7XG59KTsiLCJ2YXIgcHJvZHVjdHM7XG52YXIgcHJvZHVjdHNXcmFwcGVyID0gJCgnLnByb2R1Y3RzX193cmFwcGVyJyk7XG5cbnZhciByZW5kZXJQcm9kdWN0cyA9IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuICAgIHByb2R1Y3RzV3JhcHBlci5odG1sKCcnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9kdWN0SXRlbSA9ICQoJzxkaXY+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ3Byb2R1Y3RzX19pdGVtJyxcbiAgICAgICAgICAgICdkYXRhLWNvbG9yJzogcHJvZHVjdHNbaV0uY29sb3IsXG4gICAgICAgICAgICAnZGF0YS1zaXplJzogcHJvZHVjdHNbaV0uc2l6ZSxcbiAgICAgICAgICAgICdkYXRhLWZhYnJpYyc6IHByb2R1Y3RzW2ldLmZhYnJpYyxcbiAgICAgICAgICAgICdkYXRhLXByaWNlJzogcHJvZHVjdHNbaV0ucHJpY2VcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwcm9kdWN0SW1hZ2UgPSAkKCc8ZGl2PicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdwcm9kdWN0c19fcGhvdG8nLFxuICAgICAgICAgICAgJ3N0eWxlJzogJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgcHJvZHVjdHNbaV0uc3JjICsgJyknXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvZHVjdFRpdGxlID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX190aXRsZSd9KS50ZXh0KHByb2R1Y3RzW2ldLnRpdGxlKTtcbiAgICAgICAgdmFyIHByb2R1Y3RJbmZvID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19pbmZvJ30pO1xuICAgICAgICB2YXIgcHJvZHVjdFNpemVMYWJlbCA9ICQoJzxkaXY+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fc2l6ZS1sYWJlbCd9KS50ZXh0KCdzaXplOiAnKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTaXplID0gJCgnPHNwYW4+JywgeydjbGFzcyc6ICdwcm9kdWN0c19fc2l6ZSd9KS50ZXh0KHByb2R1Y3RzW2ldLnNpemUpO1xuICAgICAgICB2YXIgcHJvZHVjdFByaWNlTGFiZWwgPSAkKCc8ZGl2PicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3ByaWNlLWxhYmVsJ30pLnRleHQoJ3ByaWNlOiAnKTtcbiAgICAgICAgdmFyIHByb2R1Y3RQcmljZSA9ICQoJzxzcGFuPicsIHsnY2xhc3MnOiAncHJvZHVjdHNfX3ByaWNlJ30pLnRleHQoJyQnICsgcHJvZHVjdHNbaV0ucHJpY2UpO1xuICAgICAgICB2YXIgcHJvZHVjdERlc2NyaXB0aW9uID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3Byb2R1Y3RzX19kZXNjcmlwdGlvbid9KS50ZXh0KHByb2R1Y3RzW2ldLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgdmFyIHByb2R1Y3RCdXR0b24gPSAkKCc8YnV0dG9uIGNsYXNzPVwicHJvZHVjdHNfX2J1dHRvblwiPmFkZCB0byBjYXJ0PC9idXR0b24+Jyk7XG4gICAgICAgIHZhciBwcm9kdWN0UHJldmlldyA9ICQoJzxkaXYgY2xhc3M9XCJwcm9kdWN0c19fcHJldmlld1wiPjxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPjwvZGl2PicpO1xuXG4gICAgICAgIHByb2R1Y3RzV3JhcHBlci5hcHBlbmQocHJvZHVjdEl0ZW0pO1xuICAgICAgICBwcm9kdWN0SXRlbVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0SW1hZ2UpXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3RUaXRsZSlcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEluZm8pXG4gICAgICAgICAgICAuYXBwZW5kKHByb2R1Y3REZXNjcmlwdGlvbilcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdEJ1dHRvbilcbiAgICAgICAgICAgIC5hcHBlbmQocHJvZHVjdFByZXZpZXcpO1xuICAgICAgICBwcm9kdWN0SW5mb1xuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0U2l6ZUxhYmVsKVxuICAgICAgICAgICAgLmFwcGVuZChwcm9kdWN0UHJpY2VMYWJlbCk7XG4gICAgICAgIHByb2R1Y3RTaXplTGFiZWwuYXBwZW5kKHByb2R1Y3RTaXplKTtcbiAgICAgICAgcHJvZHVjdFByaWNlTGFiZWwuYXBwZW5kKHByb2R1Y3RQcmljZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb2R1Y3RzT25QYWdlID0gJCgnLnByb2R1Y3RzX193cmFwcGVyIC5wcm9kdWN0c19faXRlbScpO1xuICAgIHByb2R1Y3RzT25QYWdlLmhpZGUoKTtcbiAgICBwcm9kdWN0c09uUGFnZS5zbGljZSgwLCA0KS5zaG93KCk7XG4gICAgaWYgKHByb2R1Y3RzT25QYWdlLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgJCgnLnByb2R1Y3RzX19idXR0b24tbmV4dCcpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcucHJvZHVjdHNfX2J1dHRvbi1uZXh0JykuaGlkZSgpO1xuICAgIH1cbn07XG5cblxudmFyIGxvYWRQcm9kdWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBkYXRhYmFzZS5yZWYoJy9wcm9kdWN0cycpLm9uKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICBwcm9kdWN0cyA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgfSk7XG4gICAgLy8gJC5hamF4KHtcbiAgICAvLyAgICAgdXJsOiAnZGIvcHJvZHVjdHMuanNvbicsXG4gICAgLy8gICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgLy8gICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAvLyB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICBwcm9kdWN0cyA9IHJlc3BvbnNlLnByb2R1Y3RzO1xuICAgIC8vICAgICByZW5kZXJQcm9kdWN0cyhwcm9kdWN0cyk7XG4gICAgLy8gfSkuZmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIC8vIH0pXG59O1xuXG4vL3Nob3cgbmV4dCBwcm9kdWN0c1xudmFyIHNob3dOZXh0UHJvZHVjdHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBpdGVtcyA9ICQoZWxlbWVudCk7XG4gICAgdmFyIG5leHRJdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIDQpO1xuXG4gICAgaWYgKG5leHRJdGVtcy5sZW5ndGggPCA0KSB7XG4gICAgICAgICQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5oaWRlKCk7XG4gICAgICAgICQoJy5ibG9nX19idXR0b24tbmV4dCcpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBuZXh0SXRlbXMuc2hvdygpO1xufTtcblxubG9hZFByb2R1Y3RzKCk7XG5cbiQoJy5wcm9kdWN0c19fYnV0dG9uLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2hvd05leHRQcm9kdWN0cygnLnByb2R1Y3RzX193cmFwcGVyIC5wcm9kdWN0c19faXRlbTpoaWRkZW4nKTtcbn0pO1xuXG4vL2FkZCBwcm9kdWN0cyB0byBjYXJ0XG5wcm9kdWN0c1dyYXBwZXIub24oJ2NsaWNrJywgJy5wcm9kdWN0c19fYnV0dG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpLmluZGV4KCk7XG4gICAgJCgnLm1vZGFsLWJveCcpLnNob3coKTtcbiAgICBhZGRQcm9kdWN0VG9DYXJ0KHByb2R1Y3RJZCk7XG4gICAgJCgnLm5hdl9fYmFza2V0LWFtb3VudCcpLnRleHQoc3VtT2ZQcm9kdWN0cygpKTtcbn0pO1xuIiwidmFyIHNjcm9sbFRvRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyICR0YXJnZXRFbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB2YXIgcG9zaXRpb24gPSAkdGFyZ2V0RWxlbWVudC5vZmZzZXQoKS50b3A7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogcG9zaXRpb259LCAxNTAwKTtcbn07XG5cbiQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIHRvZ2dsZUJhY2tUb1RvcEJ1dHRvbigpO1xuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDkyMCkge1xuICAgICAgICB0b2dnbGVGaXhlZEZpbHRlcigpO1xuICAgICAgICBzdG9wRmlsdGVyQmVmb3JlRm9vdGVyKCk7XG4gICAgfVxufSk7XG5cbiQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgIGZpeFByZXZpZXdQb3NpdGlvbigpO1xuICAgIGZpeE1vZGFsQm94UG9zaXRpb24oKTtcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MjApIHtcbiAgICAgICAgc2V0RmlsdGVyTWF4SGVpZ2h0KCk7XG4gICAgICAgIGFkZEhlaWdodFRvQ29udGFpbmVyU2lkZWJhcigpO1xuICAgIH1cbn0pOyIsInZhciBjb21wbGV0ZVNoaXBwaW5nQWRkcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGUgPSAkKCcuZm9ybSBzZWxlY3QnKS52YWwoKTtcbiAgICB2YXIgZmlyc3ROYW1lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1maXJzdC1uYW1lXScpLnZhbCgpO1xuICAgIHZhciBsYXN0TmFtZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9bGFzdC1uYW1lXScpLnZhbCgpO1xuICAgIHZhciBzdHJlZXQgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPXN0cmVldF0nKS52YWwoKTtcbiAgICB2YXIgaG9tZU5yID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1ob21lLW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgZmxhdE5yID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1mbGF0LW51bWJlcl0nKS52YWwoKTtcbiAgICB2YXIgcG9zdGFsQ29kZSA9ICQoJy5mb3JtIGlucHV0W25hbWU9cG9zdGFsLWNvZGVdJykudmFsKCk7XG4gICAgdmFyIGNpdHkgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWNpdHldJykudmFsKCk7XG4gICAgdmFyIGNvdW50cnkgPSAkKCcuZm9ybSBpbnB1dFtuYW1lPWNvdW50cnldJykudmFsKCk7XG4gICAgdmFyIHBob25lID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1waG9uZS1udW1iZXJdJykudmFsKCk7XG4gICAgdmFyIGVtYWlsID0gJCgnLmZvcm0gaW5wdXRbbmFtZT1lbWFpbF0nKS52YWwoKTtcblxuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19uYW1lJykudGV4dCh0aXRsZSArICcgJyArIGZpcnN0TmFtZSArICcgJyArIGxhc3ROYW1lKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fc3RyZWV0JykudGV4dChzdHJlZXQgKyAnICcgKyBob21lTnIgKyAnICcgKyBmbGF0TnIpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19wb3N0YWwtY29kZScpLnRleHQocG9zdGFsQ29kZSk7XG4gICAgJCgnLnNoaXBwaW5nLWFkZHJlc3NfX2NpdHknKS50ZXh0KGNpdHkpO1xuICAgICQoJy5zaGlwcGluZy1hZGRyZXNzX19jb3VudHJ5JykudGV4dChjb3VudHJ5KTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fcGhvbmUnKS50ZXh0KHBob25lKTtcbiAgICAkKCcuc2hpcHBpbmctYWRkcmVzc19fZW1haWwnKS50ZXh0KGVtYWlsKTtcbn07XG5cbiQoJy5zaGlwcGluZy1hZGRyZXNzX19lZGl0LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuYWRkcmVzcy1kYXRhJykuc2hvdygpO1xuICAgICQoJy5hZGRyZXNzLWRhdGFfX2dvLWJhY2stYnV0dG9uJykuaGlkZSgpO1xuICAgICQoJy5jb250YWluZXItLWZvcm0nKS5oaWRlKCk7XG4gICAgc2Nyb2xsVG9FbGVtZW50KCcuYWRkcmVzcy1kYXRhJyk7XG59KTtcblxuIiwiJCgnLnNsaWRlcl9faXRlbXMnKS5zbGljayh7XG4gICAgc2xpZGVzVG9TaG93OiAzLFxuICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgIGRvdHM6IGZhbHNlLFxuICAgIGZvY3VzT25TZWxlY3Q6IHRydWUsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgYXJyb3dzOiBmYWxzZSxcbiAgICBjZW50ZXJQYWRkaW5nOiAwLFxuICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogMTI4MCxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDgwMCxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn0pOyJdfQ==
