var renderProducts = function (products) {
    var productsWrapper = $('.products__wrapper');
    productsWrapper.empty();
    for (var i = 0; i < products.length; i++) {
        var productItem = $('<div>', {
            'class': 'products__item',
            'data-color': products[i].color,
            'data-size': products[i].size,
            'data-fabric': products[i].fabric,
            'data-price': products[i].price,
            'data-id': products[i].id
        });
        var productImage = $('<img>', {
            'class': 'products__photo',
            'src': products[i].src,
            'alt': products[i].alt
        });
        var productTitle = $('<div>', {'class': 'products__title'}).text(products[i].title);
        var productInfo = $('<div>', {'class': 'products__info'});
        var productSizeLabel = $('<div>', {'class': 'products__size-label'}).text('size: ');
        var productSize = $('<span>', {'class': 'products__size'}).text(products[i].size);
        var productPriceLabel = $('<div>', {'class': 'products__price-label'}).text('price: ');
        var productPrice = $('<span>', {'class': 'products__price'}).text(products[i].price + '$');
        var productDescription = $('<div>', {'class': 'products__description'}).text(products[i].description);
        var productButton = $('<button class="products__button">add to cart</button>');
        var productPreviev = $('<div class="products__preview"><i class="fa fa-search" aria-hidden="true"></i></div>');

        productsWrapper.append(productItem);
        productItem
            .append(productImage)
            .append(productTitle)
            .append(productInfo)
            .append(productDescription)
            .append(productButton)
            .append(productPreviev);
        productInfo
            .append(productSizeLabel)
            .append(productPriceLabel);
        productSizeLabel.append(productSize);
        productPriceLabel.append(productPrice);
    }

    var productsOnPage = $('.products__wrapper .products__item');
    productsOnPage.hide();
    productsOnPage.slice(0, 3).show();
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
var showNextProducts = function () {
    var items = $('.products__wrapper .products__item:hidden');
    var nextItems = items.slice(0, 3);

    if (nextItems.length < 3) {
        $('.products__button-next').hide();
        $('.products__button-top').show();
    }

    nextItems.show();
};


var bindEvents = function () {
    $('.products__button-next').on('click', function () {
        showNextProducts();
    });

//back to top
    $('.products__button-top').on('click', function () {
        renderProducts(products);
        $('html, body').animate({scrollTop: 0}, 1500);
        $('.products__button-top').hide();
        $('.products__button-next').show();
    });

//add products to small basket, modal-box
    $('.products__wrapper').on('click', '.products__button', function () {
        var productIndex = $(this).closest('.products__item').index();
        $('.modal-box').show();
        addProductToCart(productIndex);
        $('.nav__basket-amount').text(cartArray.length);
    });

    $('.filter__button').on('click', function () {
        filteredProducts(products);
        scrollToElement('.filter__wrapper');
    });

//shop by
    $('.filter__title').on('click', function () {
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

    $('.products__wrapper').on('click', '.products__preview', function () {
        var productIndex = $(this).closest('.products__item').data('id');
        showPreview(productIndex);
    });

    $('.preview__next-button').on('click', function () {
        var productIndex = $(this).closest('.preview__content').data('id') + 1;
        if (productIndex === $('.products__item').length) {
            showPreview(0);
        } else {
            showPreview(productIndex);
        }
    });

    $('.preview__prev-button').on('click', function () {
        var productIndex = $(this).closest('.preview__content').data('id') - 1;
        showPreview(productIndex);
    });

    $('.preview__close-button, .preview__shopping-button').on('click', function () {
        $('.preview').hide();
    });

    $(window).on('resize', function () {
        fixPreviewPosition();
    });

    $('.preview__basket-button').on('click', function () {
        var productIndex = $(this).closest('.preview__content').data('id');
        addProductToCart(productIndex);
        $('.nav__basket-amount').text(cartArray.length);
        $('.preview').hide();
        $('.modal-box').show();

    });

    $('.modal-box__shopping-button, .modal-box__close-button').on('click', function () {
        $('.modal-box').hide();
    });
};

app.initPage['shop.html'] = function () {
    loadProducts();
    bindEvents();
    console.log('shop init');

};