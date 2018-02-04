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
        myApp.hideIndicator();
        return;
    }
    $$('#login-form').trigger('submit');
    var formData = myApp.formToJSON('#login-form');
    myApp.showIndicator();
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
// PAGES FUNCTION
myApp.onPageInit('home', function (page) {
    var obe_id = localStorage.getItem('OBE_obe_id');
    if (obe_id != null) {
        $$('.user-callsign').html(localStorage.getItem('OBE_user_callsign'));
        mainView.router.loadPage('home.html');
    }
    else {
        mainView.router.loadPage('login.html');
    }
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
    $$.get(api_product + 'brandcards&obe-id=' + localStorage.getItem('OBE_obe_id'), function (response) {
        var response = extractAJAX(response);
        if (response.status == true) {
            $$('.brand-cards').html("");
            $.each(response.data, function (i, v) {
                if (v.product_count > 0) {
                    var brandStr = '<div class="card ks-card-header-pic brand-card-row" style="margin-bottom:15px;"> <div class="navbar article"> <div class="navbar-inner opacity-container-top"> <div class="center">' + v.brand_name + '</div> <div class="right"> <a href="#" class="link icon-only"> <i class="material-icons fav">favorite</i> </a> <a href="#" class="link icon-only"> <i class="material-icons">book</i> </a> </div> </div> </div> <div class="header-container" style="margin-top: -53px;"> <a href="brand-page.html?brand-id=' + v.brand_id + '"> <div style="background-image:url(img/fleur.jpg)" valign="bottom" class="card-header color-white no-border"></div> </a> </div> <div class="card-footer"> <div class="item-media"><img src="img/gambar2.jpg" width="44" style="margin-top: 5px;"> </div> <div class="item-inner" style="margin-left: 20px;"> <div class="row no-gutter" style="text-align: left;"> <div class="col-100 info" style="text-align: left;font-weight:;font-size: 3vmin;margin-bottom: -10px; color: grey;">Aizal Manan</div> <div class="row" style="padding-top:10px;text-align: left;font-size:1vmin;margin-bottom: 5px;"> <div class="col-10" style="text-align: left;"> <i class="material-icons small-rating">star</i> </div> <div class="col-10" style="text-align: left;"> <i class="material-icons small-rating">star</i> </div> <div class="col-10" style="text-align: left;"> <i class="material-icons small-rating">star</i> </div> <div class="col-10" style="text-align: left;"> <i class="material-icons small-rating">star</i> </div> <div class="col-10" style="text-align: left;"> <i class="material-icons small-unrating">star</i> </div> <div class="col-10" style="text-align: left;"> </div> <div class="col-40" style="text-align: left;"> <div style="font-size: 3vmin;color: grey;line-height: 3vmin;font-weight: lighter;">(Ratings)</div> </div> </div> </div> </div> <div class="icon-social"> <div class="link icon-only" style="color: green; padding-right: 15px; font-size: 4vmin;">' + v.product_count + ' Products</div> </div> </div> </div>';
                    $$('.brand-cards').append(brandStr);
                }
            });
        }
        if ($$('.brand-card-row').length == 0) {
            $$('.brand-title').hide();
        }
    });
}).trigger();
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
myApp.onPageInit('network', function (page) {
    $$('.trigger-actionsheet').on('click', function () {
        var buttons = [
            {
                text: '<a href="#"><i class="icon material-icons" style="margin-right:8px;color:#777;">&#xE8A0;</i>Search User</a>'
        }, {
                text: '<a href="#"><i class="icon material-icons" style="margin-right:8px;color:#777;">&#xE7FD;</i>Add Follower</a>'
        }, ];
        myApp.actions(buttons);
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
var indVar = 1;
var wholesaleJSON = [];
myApp.onPageInit('new-product', function (page) {
    if (page.query.brand_name) {
        $$('.brand-name').html(page.query.brand_name);
        $('input[name=brand-id]').val(page.query.brand_id)
    }
    $$.get(api_product + 'categorylist', function (response) {
        var response = extractAJAX(response);
        if (response.status == true) {
            $$('.product-category-list').html("");
            $.each(response.data, function (i, v) {
                var catStr = '<option value="' + v.category_id + '">' + v.category_name + '</option>';
                $$('.product-category-list').append(catStr);
            });
        }
        else {
            myModal('Error!', response.data);
        }
    });
    $$('.variation-show').hide();
    $('[data-page=new-product] .back-modal').on('click', function () {
        myApp.confirm('Discard this product?', '', function () {
            mainView.router.loadPage('home.html');
        });
    });
    $$('.variation-add').on('click', function () {
        $$('input[name=variation-price-main]').removeClass('required');
        var varStr = '<li class="variation-show var_' + indVar + '"> <div class="item-content"> <div class="item-media" data-section="variation-field" onclick="removeVar(\'.var_' + indVar + '\');" style="align-self: auto;margin-top: 30px;"><i class="icon material-icons">&#xE15C;</i></div> <div class="item-inner"> <ul style="padding: 0;"> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE3DE;</i></div> <div class="item-inner"> <div class="item-title floating-label">Type</div> <div class="item-input"> <input type="text" class="variant-type required" placeholder="Type"> </div> </div> </div> </li> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE227;</i></div> <div class="item-inner"> <div class="item-title floating-label">Price</div> <div class="item-input"> <input class="variation-price variant-price required" type="number" placeholder="Price"> </div> </div> </div> </li> <li> <div class="item-content" style="padding:0;"> <div class="item-media"><i class="icon material-icons">&#xE53B;</i></div> <div class="item-inner"> <div class="item-title floating-label">Stock</div> <div class="item-input"> <input type="number" class="variant-stock" placeholder="Stock"> </div> </div> </div> </li> </ul> </div> </div> </li>';
        $$('.variation-hide').hide();
        $('.variation-list').before(varStr);
        var varPrice = $$('input[name=variation-price-main]').val();
        if (varPrice) {
            $$('input.variation-price').parent().addClass('not-empty-state');
            $$('input.variation-price').parent().parent().addClass('not-empty-state');
            $$('input.variation-price').val(varPrice).addClass('not-empty-state');
            $$('input.variation-price').removeClass('variation-price');
        }
        $$('.variation-show').show();
        indVar++;
    });
    $$('.product-save').on('click', function () {
        var counter = 0;
        var required = $$('.required').length;
        if ($$('.variation-show').length > 0) {
            $$('[name=variation-price-main]').removeClass('required');
        }
        $$('.item-input .required').each(function () {
            if ($$(this).val() == "") {
                $$(this).closest('li').attr('style', 'background:#ff000030');
            }
            else {
                counter++;
                $$(this).closest('li').attr('style', 'background:#fff');
            }
        });
        if (counter == required) {
            myApp.confirm('Add product ?', '', function () {
                myApp.showIndicator();
                var variationJSON = [];
                $$('.variation-show').each(function () {
                    var data = '{"variation-type":"' + $(this).find('.variant-type').val() + '", "variation-price":"' + $(this).find('.variant-price').val() + '", "variation-stock":"' + $(this).find('.variant-stock').val() + '"}'
                    variationJSON.push(data);
                });
                $$.get(api_product + 'addproduct&obe-id=' + localStorage.getItem('OBE_obe_id') + '&' + $('#new-product-form').serialize() + "&product-variant=[" + variationJSON + "]&wholesale=[" + wholesaleJSON + "]&product-image=photo", function (response) {
                    var response = extractAJAX(response);
                    if (response.status == true) {
                        myApp.confirm('Add another product ?', response.data, function () {
                            mainView.router.reloadPage('new-product.html');
                        }, function () {
                            mainView.router.loadPage('home.html');
                        });
                    }
                    else {
                        myModal('Error!', response.data);
                    }
                    myApp.hideIndicator();
                });
            });
        }
        else {
            myApp.hideIndicator();
        }
    });
});
myApp.onPageInit('my-brand', function (page) {
    $$.get(api_product + 'brandlist', function (response) {
        var response = extractAJAX(response);
        if (response.status == true) {
            $$('.my-brand-list').html("");
            $.each(response.data, function (i, v) {
                var brandStr = '<li style="border-bottom:1px solid lightgray"> <a href="#" class="item-link item-content brand-cta" data-brand-id="' + v.brand_id + '"> <div class="item-media"><img src="img/gambar1.jpg" width="44" style="margin-top: 5px;"><span style="margin-left:8px;">' + v.brand_name + '</span></div></a> </li>';
                $$('.my-brand-list').append(brandStr);
            });
        }
        else {
            var brandStr = '<li style="border-bottom:1px solid lightgray"> <a href="#" class="item-link item-content"> <span style="margin-left:8px;">' + response.data + '</span></a> </li>';
            $$('.my-brand-list').append(brandStr);
        }
        $$('.brand-cta').each(function () {
            $$(this).on('click', function () {
                var brand_id = $$(this).attr('data-brand-id');
                var brand_name = $(this).children().find('span').html();
                mainView.router.loadPage('new-product.html?brand_id=' + brand_id + '&brand_name=' + brand_name);
            });
        });
    });
});
myApp.onPageInit('brand-new-add', function (page) {
    $$('.back-modal').on('click', function () {
        myApp.confirm('Discard this brand?', '', function () {
            mainView.router.back();
        });
    });
    $$('.brand-save').on('click', function () {
        var counter = 0;
        var required = $$('.required').length;
        $$('.item-input .required').each(function () {
            if ($$(this).val() == "") {
                $$(this).closest('li').attr('style', 'background:#ff000030');
            }
            else {
                counter++;
                $$(this).closest('li').attr('style', 'background:#fff');
            }
        });
        if (counter == required) {
            myApp.confirm('Add brand ?', '', function () {
                myApp.showIndicator();
                $$.get(api_product + 'addbrand&obe-id=' + localStorage.getItem('OBE_obe_id') + '&' + $('#new-brand-form').serialize(), function (response) {
                    var response = extractAJAX(response);
                    if (response.status == true) {
                        myApp.alert('Successfully created brand', '');
                        mainView.router.reloadPage('my-brand.html');
                    }
                    else {
                        myModal('Error!', response.data);
                    }
                    myApp.hideIndicator();
                });
            });
        }
        else {
            myApp.hideIndicator();
        }
    });
});
var indTier = 2;
myApp.onPageInit('wholesale', function (page) {
    if (wholesaleJSON.length != 0) {
        $$('.price-tier-container').html("");
        var indTier = 2;
        var whStr = JSON.stringify(wholesaleJSON);
        $.each(wholesaleJSON, function (i, v) {
            var whStr = JSON.parse(v);
            console.log(whStr);
            var tierStr = '<div class="row price-tier-row tier_' + indTier + '"> <div style="width:12%"><i class="icon material-icons price-tier-remove" onclick="removeTier(\'.tier_' + indTier + '\')" style="line-height: 37px;">&#xE15C;</i></div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number" value="' + whStr.minorder + '" class="ws-input min-order" style="border: none; width: 100%; text-align: center;"> </div> </div> <div style="width:2%;line-height: 35px;">-</div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number" value="' + whStr.maxorder + '" class="ws-input max-order"style="border: none; width: 100%; text-align: center;"> </div> </div> <div style="width:2%;line-height: 35px;">:</div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number" value="' + whStr.unitprice + '" class="ws-input unit-price" style="border: none; width: 100%; text-align: center;"> </div> </div> </div> </div>';
            $$('.price-tier-container').append(tierStr);
            indTier++;
        });
    }
    $$('.price-tier-save').on('click', function () {
        wholesaleJSON = [];
        $$('.price-tier-row').each(function () {
            var data = '{"minorder":"' + $(this).find('.min-order').val() + '", "maxorder":"' + $(this).find('.max-order').val() + '", "unitprice":"' + $(this).find('.unit-price').val() + '"}';
            wholesaleJSON.push(data);
        });
        mainView.router.back();
        if ($$('.price-tier-row').length > 0) {
            $$('.wholesale-detail').html(">=" + $('.price-tier-container').first('.price-tier-row').find('.min-order').val() + " price RM" + $('.price-tier-container').first('.price-tier-row').find('.unit-price').val());
        }
        else {
            $$('.wholesale-detail').html("");
        }
    });
    $$('.price-tier-add').each(function () {
        $$(this).on('click', function () {
            var tierStr = '<div class="row price-tier-row tier_' + indTier + '"> <div style="width:12%"><i class="icon material-icons price-tier-remove" onclick="removeTier(\'.tier_' + indTier + '\')" style="line-height: 37px;">&#xE15C;</i></div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number" class="min-order" style="border: none; width: 100%; text-align: center;"> </div> </div> <div style="width:2%;line-height: 35px;">-</div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number"  class="max-order"style="border: none; width: 100%; text-align: center;"> </div> </div> <div style="width:2%;line-height: 35px;">:</div> <div style="width:28%"> <div class="item-input" style="margin: 2px 10px; border: 1px solid #afafaf; border-radius: 5px; padding: 5px;"> <input type="number" class="unit-price" style="border: none; width: 100%; text-align: center;"> </div> </div> </div> </div>';
            $$('.price-tier-container').append(tierStr);
            indTier++;
        });
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

function removeVar(target) {
    if ($$('.variation-show').length == 1) {
        $$('.variation-hide').show();
        $$('input[name=variation-price-main]').addClass('required');
    }
    $(target).remove();
    indVar--;
}

function removeTier(target) {
    if ($$('.price-tier-row').length == 1) {
        wholesaleJSON = [];
        $$('.wholesale-detail').html("");
    }
    $(target).remove();
    indTier--;
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