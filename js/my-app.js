//api link
var api_user = 'http://www.obe-apps.tk/obe_apiv2/GO_USER_PROFILE.php?action=';
var api_order = 'http://www.obe-apps.tk/obe_apiv2/GO_ORDER_CONTROLLER.php?action=';
var api_product = 'http://www.obe-apps.tk/obe_apiv2/GO_PRODUCT_CONTROLLER.php?action=';
// Init App
var myApp = new Framework7({
    //    modalTitle: 'Pepin',
    // Enable Material theme
    material: true
    , cache: true
    , materialRipple: true
    , scrollTopOnNavbarClick: true
    , onAjaxStart: function (xhr) {
        myApp.showIndicator();
    }
    , onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});
// Expose Internal DOM library
var $$ = Dom7;
// Add main view
var mainView = myApp.addView('.view-main', {});
// LOGIN & LOGOUT
$$(document).on('click', '.alert-for-pass', function () {
    myApp.modal({
        title: 'Forgot Password ?'
        , text: 'Please enter your email'
        , afterText: '<input type="text" class="modal-text-input forgotpw-email" placeholder="Your email">'
        , buttons: [{
            text: 'OK'
            , onClick: function () {
                var email = $$('.forgotpw-email').val();
                if (email != "") {
                    myApp.showIndicator();
                    $$.get(api_user + 'forgotpassword', {
                        email: email
                    }, function (response) {
                        var response = extractAJAX(response);
                        if (response.status == true) {
                            myModal('Password Reset', response.data);
                            myApp.hideIndicator();
                            mainView.router.loadPage('login.html');
                        }
                        else {
                            myApp.hideIndicator();
                            myModal('Reset Password Error!', response.data);
                        }
                    });
                }
                else {
                    myApp.modal({
                        title: 'Forgot Password ?'
                        , text: 'Email is empty'
                        , buttons: [{
                            text: 'OK'
                        }]
                    });
                }
            }
        , }, {
            text: 'Cancel'
        , }, ]
    });
});
$$(document).on('click', '#login-btn', function () {
    if ($$('[name=user_name]').val() == "" || $$('[name=user_password]').val() == "") {
        myModal('Login Error!', 'Empty Username/Password');
        return;
    }
    $$('#login-form').trigger('submit');
    var formData = myApp.formToJSON('#login-form');
    $$.get(api_user + 'login', $$.serializeObject(formData), function (response) {
        var response = extractAJAX(response);
        if (response.status == true) {
            Object.keys(response.data[0]).forEach(function (key) {
                localStorage.setItem('OBE_' + key, response.data[0][key]);
            });
            mainView.router.loadPage('home.html');
        }
        else {
            myModal('Login Error!', response.data);
        }
    }, function () {
        myModal('Login Error!', 'Connection Error');
    });
});
$$(document).on('click', '.logout', function () {
    myApp.modal({
        title: 'Are sure want to exit ?'
        , buttons: [{
            text: 'OK'
            , onClick: function () {
                myApp.showIndicator();
                $.each(localStorage, function (key, value) {
                    if (key.indexOf("OBE_") >= 0) {
                        localStorage.removeItem(key);
                    }
                });
                window.open("index.html", "_self");
                myApp.hideIndicator();
            }
    }, {
            text: 'Cancel'
        , }, ]
    });
});
//REGISTER
$$(document).on('click', '#register-btn', function () {
    var has_empty = false;
    $('#register-form').find('input[type!="hidden"]').each(function () {
        if (!$(this).val()) {
            has_empty = true;
            return false;
        }
    });
    if (has_empty) {
        myModal('Register Error!', 'All fields required');
        return;
    }
    if ($$('[name=confirmpassword]').val() != $$('[name=regpassword]').val()) {
        myModal('Register Error!', 'Password Mismatch');
        return;
    }
    myApp.confirm('Are you sure?', 'Register', function () {
        myApp.showIndicator();
        $$('#register-form').trigger('submit');
        var formData = myApp.formToJSON('#register-form');
        $$.get(api_user + 'register', $$.serializeObject(formData), function (response) {
            var response = extractAJAX(response);
            if (response.status == true) {
                myModal('Registration Successful!', response.data);
                myApp.hideIndicator();
                mainView.router.loadPage('login.html');
            }
            else {
                myApp.hideIndicator();
                myModal('Registration Error!', response.data);
            }
        }, function () {
            myApp.hideIndicator();
            myModal('Registration Error!', 'Connection Error');
        });
    });
});
$$(document).on('click', '.fav', function () {
    $(this).toggleClass('color-change')
});
$$(document).on('pageInit', function (e) {
    // Do something here when page loaded and initialized
    var mySwiper = myApp.swiper('.swiper-container.swiper-init', {
        pagination: '.swiper-pagination'
        , paginationHide: false
        , autoplay: 3000
        , onReachEnd: function (swiper) {
            //callback function code here
        }
    });
});

function gotPic(event) {
    if (event.target.files.length === 1 && event.target.files[0].type.indexOf('img/') === 0) {
        $$('#avatar').attr('src', URL.createObjectURL(event.target.files[0]));
    }
}
$$('#avatarCapture').on('change', gotPic);
// ICONS TRANSITIONS
$$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
    $$(this).toggleClass('color-change');
});
myApp.onPageInit('home', function (page) {
    var obe_id = localStorage.getItem('OBE_obe_id');
    if (obe_id != null) {
        $$('.user-callsign').html(localStorage.getItem('OBE_user_callsign'));
        mainView.router.loadPage('home.html');
    }
    //    else{
    //        mainView.router.loadPage('login.html');
    //    }
}).trigger();
myApp.onPageInit('profile', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
    if (localStorage.getItem('OBE_obe_id') != null) {
        $$('.user_name').html(localStorage.getItem('OBE_user_name'));
        $$('.user_img').attr('src', 'http://www.obe-apps.tk/obe_api/upload/' + localStorage.getItem('OBE_user_img'));
    }
});
myApp.onPageInit('photos', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
});
myApp.onPageInit('videos', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
});
myApp.onPageInit('musiques', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
});
myApp.onPageInit('index2', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
});
myApp.onPageInit('article', function (page) {
    $$('i.material-icons.fav-article').on('click', function () { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
});
myApp.onPageInit('notifications', function (page) { //Change icon when add or delete person
    $$(document).on('click', 'i.material-icons.add', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons done">done</i></div>');
    });
    $$(document).on('click', 'i.material-icons.done', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons add">&#xE7FE;</i></div>');
    });
});
myApp.onPageInit('followers', function (page) { //Change icon when add or delete person
    $$(document).on('click', 'i.material-icons.add', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons done">done</i></div>');
    });
    $$(document).on('click', 'i.material-icons.done', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons add">&#xE7FE;</i></div>');
    });
});
myApp.onPageInit('following', function (page) { //Change icon when add or delete person
    $$(document).on('click', 'i.material-icons.add', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons done">done</i></div>');
    });
    $$(document).on('click', 'i.material-icons.done', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons add">&#xE7FE;</i></div>');
    });
});
myApp.onPageInit('index2', function (page) { //Change icon when add or delete person
    $$(document).on('click', 'i.material-icons.add', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons done">done</i></div>');
    });
    $$(document).on('click', 'i.material-icons.done', function () {
        $(this).replaceWith('<div class="item-after"><i class="material-icons add">&#xE7FE;</i></div>');
    });
});
// PAGES FUNCTION
myApp.onPageInit('article', function (page) {
    $$('.ac-1').on('click', function () {
        var buttons = [
            {
                text: 'Facebook'
            , }
            , {
                text: 'Twitter'
        }
            , {
                text: 'Google Plus'
        }
            , {
                text: 'Cancel'
                , color: 'red'
        }
    , ];
        myApp.actions(buttons);
    });
});
//FUNCTIONS
function extractAJAX(response) {
    var responseJSON = JSON.parse(response);
    var dataJSON;
    if (responseJSON[0].status == true && IsJsonString(responseJSON[0].data) == true) {
        dataJSON = JSON.parse(responseJSON[0].data);
    }
    else {
        dataJSON = responseJSON[0].data;
    }
    return {
        status: responseJSON[0].status
        , data: dataJSON
    };
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}

function cari() {
    $('form#cari').addClass('layer searchbar-active');
}

function pangkah() {
    $('form#cari').removeClass('layer searchbar-active');
}

function myModal(title, text) {
    myApp.modal({
        title: title
        , text: text
        , buttons: [{
            text: 'Close'
    }]
    });
}