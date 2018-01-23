//api link
var api_user_image = 'http://www.obe-apps.tk/obe_apiv2/upload/';
var api_product_image = 'http://www.obe-apps.tk/obe_apiv2/product/';
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
    myApp.showIndicator();
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
    myApp.hideIndicator();
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
    else {
        mainView.router.loadPage('login.html');
    }
}).trigger();
myApp.onPageInit('home', function (page) {
    $$('.refresh-page').on('click', function () {
        page.view.router.refreshPage();
    });
    var ctx = $('#chart');
    var myChart = new Chart(ctx, {
        type: 'line'
        , data: {
            datasets: [{
                label: 'Buying'
                , data: [12, 19, 3, 5, 2, 3, 5]
                , backgroundColor: 'transparent'
                , borderColor: 'rgba(255,99,132,1)'
                , borderWidth: 1
                , lineTension: 0
            , }, {
                label: 'Selling'
                , data: [2, 9, 13, 15, 12, 13, 1]
                , backgroundColor: 'transparent'
                , borderColor: '#36a2eb'
                , borderWidth: 1
                , lineTension: 0
            , }]
            , labels: ['15/1', '16/1', '17/1', '18/1', '19/1', '20/1', '21/1']
        }
        , options: {
            responsive: true
            , legend: {
                position: 'top'
                , labels: {
                    usePointStyle: true
                }
            }
        }
    });
    $$('.trigger-actionsheet').on('click', function () {
        var buttons = [
            {
                text: '<i class="icon material-icons" style="margin-right:8px;color:#777;">&#xE8A0;</i>Open'
        }, {
                text: '<i class="icon material-icons" style="margin-right:8px;color:#777;">&#xE7FD;</i>View User'
        }
            , {
                text: '<i class="icon material-icons" style="margin-right:8px;color:#777;">&#xE92B;</i>Remove'
                , color: 'red'
        }
    , ];
        myApp.actions(buttons);
    });
    $$('.open-vertical-modal').on('click', function () {
        myApp.modal({
            title: 'Add product from'
            , verticalButtons: true
            , buttons: [
                {
                    text: 'Camera'
                    , onClick: function () {
                        myApp.alert('You clicked camera!')
                        mainView.router.loadPage('new-product.html');
                    }
      }
                , {
                    text: 'Photos'
                    , onClick: function () {
                        myApp.alert('You clicked photos!')
                        mainView.router.loadPage('new-product.html');
                    }
      }
    , ]
        })
    });
});
var tabClick;
myApp.onPageInit('profile', function (page) {
    $$('i.material-icons.fav').on('click', function (e) { //Changing color icons onclick
        $$(this).toggleClass('color-change');
    });
    if (localStorage.getItem('OBE_obe_id') != null) {
        $$('.user_name').html(localStorage.getItem('OBE_user_name'));
        $$('.user_img').attr('src', api_user_image + localStorage.getItem('OBE_user_img'));
    }
    $$('.to-pay').on('click', function () {
        tabClick = "#to-pay";
    });
    $$('.to-receive').on('click', function () {
        tabClick = "#to-receive";
    });
    $$('.completed').on('click', function () {
        tabClick = "#completed";
    });
});
myApp.onPageInit('my-purchase', function (page) {
    $$(tabClick).addClass('active');
    $('[href=' + tabClick + ']').addClass('active');
    switch (tabClick) {
    case '#to-pay':
        $$('.mypurchase-tab .tab-link-highlight').attr('style', 'width: 33.3333%;margin-left:0;');
        break;
    case '#to-receive':
        $$('.mypurchase-tab .tab-link-highlight').attr('style', 'width: 33.3333%; margin-left:33.3333%;');
        break;
    case '#completed':
        $$('.mypurchase-tab .tab-link-highlight').attr('style', 'width: 33.3333%; margin-left:66.6666%;');
        break;
    }
    $$('.mypurchase-tab-content .tab').on('show', function () {
        alert("yes");
    });
});
var ind = 1;
myApp.onPageInit('new-product', function (page) {
    $$('.variation-show').hide();
    $$('.back-modal').on('click', function () {
        myApp.confirm('Discard this product?','', function () {
            mainView.router.loadPage('home.html');
        });
    });
    
    $$('.variation-add').on('click', function(){
        var varStr = '<li class="variation-show" data-seq="var_'+ind+'"> <div class="item-content"> <div class="item-media" data-section="variation-field" onclick="removeVar(\'var_'+ind+'\');" style="align-self: auto;margin-top: 30px;"><i class="icon material-icons">&#xE15C;</i></div> <div class="item-inner"> <ul style="padding: 0;"> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE3DE;</i></div> <div class="item-inner"> <div class="item-title floating-label">Type</div> <div class="item-input"> <input type="text" name="variant-'+ind+'-type" placeholder="Type"> </div> </div> </div> </li> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE227;</i></div> <div class="item-inner"> <div class="item-title floating-label">Price</div> <div class="item-input"> <input class="variation-price" type="number" name="variant-'+ind+'-price" placeholder="Price"> </div> </div> </div> </li> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE53B;</i></div> <div class="item-inner"> <div class="item-title floating-label">Stock</div> <div class="item-input"> <input type="number" name="variant-'+ind+'-stock" placeholder="Stock"> </div> </div> </div> </li> </ul> </div> </div> </li>';
        $$('.variation-hide').hide();
        $('.variation-list').before(varStr);
        var varPrice = $$('input[name=variation-price-main]').val();
        if(varPrice){
            $$('input.variation-price').parent().addClass('not-empty-state');
            $$('input.variation-price').parent().parent().addClass('not-empty-state');
            $$('input.variation-price').val(varPrice).addClass('not-empty-state');
            $$('input.variation-price').removeClass('variation-price');
        }
        $$('.variation-show').show();
        ind++;
    });
    $$('.product-save').on('click', function(){
        myApp.alert('You save a product');
    });
});
myApp.onPageInit('wholesale', function (page) {
    $$('.price-tier-remove').each(function(){
       $(this).on('click',function(){
           
       });
    });
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

function removeVar(seq) {
    var target = "[data-seq="+seq+"]";
    if ($$('.variation-show').length == 1){
        $$('.variation-hide').show();
    }
    $(target).remove();
    ind--;
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