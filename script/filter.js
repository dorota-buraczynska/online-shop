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
};

//filter products
var filterByBlingPrices = function (products, min, max) {
    console.log(products);
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
});
