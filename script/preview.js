var fixPreviewPosition = function () {
    var contentHeight = $('.preview__content').height();
    var windowHeight = $(window).height();
    $('.preview__content').toggleClass('preview__content--large', contentHeight > windowHeight);
};

var showPreview = function (productIndex) {
    var product = $('.products__item');
    var photoSrc = product.eq(productIndex).find('.products__photo').attr('src');
    var productFabric = product.eq(productIndex).data('fabric');
    var productSize = product.eq(productIndex).data('size');
    var productPrice = product.eq(productIndex).data('price');
    var productTitle = product.eq(productIndex).find('.products__title').text();
    var productDescription = product.eq(productIndex).find('.products__description').text();
    var productId = product.eq(productIndex).data('id');

    $('.preview').show();
    $('.preview__photo-item').attr('src', photoSrc);
    $('.preview__product-fabric span').text(productFabric);
    $('.preview__product-size span').text(productSize);
    $('.preview__product-price span').text('$' + productPrice);
    $('.preview__product-title').text(productTitle);
    $('.preview__product-description-text').text(productDescription);
    $('.preview__content')
        .data('id', productId)
        .data('price', productPrice);

    fixPreviewPosition();
};


