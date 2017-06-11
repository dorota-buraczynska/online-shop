var cartArray = [];
var priceArray = [];
var totalSum = 0;

var addProductToCart = function (productIndex) {
    var product = {
        path: $('.products__item').eq(productIndex).find('.products__photo').attr('src'),
        price: $('.products__item').eq(productIndex).data('price'),
        size: $('.products__item').eq(productIndex).data('size'),
        index: $('.products__item').eq(productIndex).data('id')
    };
    cartArray.push(product);
    priceArray.push(product.price);
};

var renderCart = function () {
    var buttonsWrapper = ('<div class="shopping-list__buttons-wrapper"><div class="shopping-list__plus-button">&#43;</div><div class="shopping-list__minus-button">&#45;</div></div>');
    var deleteButton = ('<button class="shopping-list__delete-button">delete</button>');

    for (var i = 0; i < cartArray.length; i++) {
        var productPhoto = ('<img class="shopping-list__product-photo" src="' + cartArray[i].path + '">');
        var productAmount = ('<div class="shopping-list__product-amount">1 ' + buttonsWrapper + '</div>');
        var productPrice = ('<div class="shopping-list__product-price">$' + cartArray[i].price + ' </div>');
        var productSize = ('<div class="shopping-list__product-size">' + cartArray[i].size + '</div>');

        $('.shopping-list__wrapper')
            .prepend(' <div class="shopping-list__product-wrapper">' + productPhoto + productSize + productAmount + productPrice + deleteButton + '</div>');

    }
};

var deleteProductFromBasket = function (element) {
    var price = $(element).closest('.shopping-list__product-wrapper').find('.shopping-list__product-price').text();
    var number = parseInt(price.slice(1, 4));
    totalSum -= number;
    $('.shopping-list__product-total-price span').text('$' + totalSum);
    $(this).closest('.shopping-list__product-wrapper').remove();
    console.log(price);
};

$('.nav__basket').on('click', function (event) {
    event.preventDefault();
    loadPageContent('cart.html');
    $('.shopping-list__wrapper .shopping-list__product-wrapper').remove();
    renderCart();

    for (var i = 0; i < priceArray.length; i++) {
        totalSum += priceArray[i];
        $('.shopping-list__product-total-price span').text('$' + totalSum);
    }
});

var bindEvents = function () {
    $('.shopping-list__wrapper').on('click', '.shopping-list__delete-button', function () {
        deleteProductFromBasket(this);
    });
};


app.initPage['cart.html'] = function () {
    bindEvents();
};