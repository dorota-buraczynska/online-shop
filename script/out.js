/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// identity function for calling harmony imports with the correct context
    /******/
    __webpack_require__.i = function (value) {
        return value;
    };
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 8);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports) {

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
                var entryButton = $('<button>', {'class': 'blog__button'}).text('read more');

                blogWrapper.append(entry);
                entry
                    .append(entryPhoto)
                    .append(entriesWrapper)
                    .append(entryButton);
                entriesWrapper
                    .append(entryTitle)
                    .append(entryText);
            }
        };

        var loadEntries = function () {
            $.ajax({
                url: 'db/entries.json',
                method: 'GET',
                dataType: 'json'
            }).done(function (response) {
                renderEntries(response.entries);
                console.log(response.entries);
            }).fail(function (error) {
                console.log(error);
            })
        };

        loadEntries();

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports) {

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
            // loadPageContent('cart.html');
            $('.shopping-list__wrapper .shopping-list__product-wrapper').remove();
            renderCart();

            for (var i = 0; i < priceArray.length; i++) {
                totalSum += priceArray[i];
                $('.shopping-list__product-total-price span').text('$' + totalSum);
            }
        });

        $('.shopping-list__wrapper').on('click', '.shopping-list__delete-button', function () {
            deleteProductFromBasket(this);
        });


        /***/
    }),
    /* 2 */
    /***/ (function (module, exports) {

        var filteredProducts = function (products) {
            $('.products__wrapper').empty();
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

        var scrollToElement = function (element) {
            var $targetElement = $(element);
            var position = $targetElement.offset().top;
            var filterHeight = $('.filter__wrapper').height();

            $('html, body').animate({scrollTop: position + filterHeight}, 1500);
        };

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


        /***/
    }),
    /* 3 */
    /***/ (function (module, exports) {

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
        };

        /***/
    }),
    /* 4 */
    /***/ (function (module, exports) {

        $('.nav__button').on('click', function (event) {
            var buttonActiveClass = 'nav__button--active';
            $(this).toggleClass(buttonActiveClass);
            $('.nav__menu').toggleClass('visible');
        });

        $('.nav__menu-item').on('click', function (event) {
            event.preventDefault();
            var listItemActiveClass = 'nav__menu-item--active';
            $(this).siblings().removeClass(listItemActiveClass);
            $(this).addClass(listItemActiveClass);
            var href = $('a', this).attr('href');
            loadPageContent(href);
        });


        /***/
    }),
    /* 5 */
    /***/ (function (module, exports) {

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


        /***/
    }),
    /* 6 */
    /***/ (function (module, exports) {


        var products;

        var loadPageContent = function (href) {
            $.ajax({
                url: href
            }).done(function (response) {
                var $content = $(response).filter('div.container');
                $('div.container').html($content);
            }).fail(function (error) {
                console.log(error);
            })
        };


        /***/
    }),
    /* 7 */
    /***/ (function (module, exports) {

        var changeActiveDot = function (index) {
            $('.slider__dot')
                .eq(index)
                .addClass('slider__dot--active')
                .siblings().removeClass('slider__dot--active');
        };

        var changeActivePhoto = function (index) {
            $('.slider__slide')
                .eq(index)
                .addClass('slider__slide--active')
                .siblings().removeClass('slider__slide--active');
        };

        var getCurrentPhotoIndex = function () {
            return $('.slider__slide.slider__slide--active').index();
        };

        var onDotClick = function (event) {
            clearInterval(autoSlide);
            changeActiveDot($(this).index());
            changeActivePhoto($(this).index());
            currentIndex = getCurrentPhotoIndex();
            startSlideshow();
        };

        var autoSlide;
        var currentIndex = 0;
        var photos = $('.slider__slide');

        var startSlideshow = function () {
            autoSlide = setInterval(function () {
                currentIndex++;
                if (currentIndex > photos.length - 1) {
                    currentIndex = 0;
                }
                changeActivePhoto(currentIndex);
                changeActiveDot(currentIndex);

            }, 5000);
        };

        $('.slider__dot').on('click', onDotClick);

        startSlideshow();


        /***/
    }),
    /* 8 */
    /***/ (function (module, exports, __webpack_require__) {

        __webpack_require__(6);
        __webpack_require__(0);
        __webpack_require__(1);
        __webpack_require__(2);
        __webpack_require__(3);
        __webpack_require__(4);
        __webpack_require__(5);
        module.exports = __webpack_require__(7);


        /***/
    })
    /******/]);