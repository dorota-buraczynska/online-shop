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
    console.log(dataToSend);
    cartArray = [];
    createCookie('cart', cartArray, 30);
});