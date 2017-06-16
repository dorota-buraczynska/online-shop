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

