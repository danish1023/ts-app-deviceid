// Dom7
var $$ = Dom7;

Framework7.use(Framework7Keypad);

// Change below value
var HomeURL = 'http://tejoodemo.netcarrots.in';
var BaseURL = 'http://tejoodemo.netcarrots.in/api';
var AuthUsername = 'Tejoo';
var AuthPassword = 'Tejoo@123';

// Init App
var app = new Framework7({
  id: 'com.techstreet.utility',
  root: '#app',
  theme: 'md',
  name: 'UDID',
  view: {
    animate: true,
    xhrCache: false,
    stackPages: true,
  },
  dialog: {
    title: 'UDID',
  },
  panel: {
    swipe: 'left',
    swipeOnlyClose: true,
  },
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/',
  on: {
    init: function (event, page) {

    },
  }
});

function statusMessage(status) {
  if (status == 0) {
    return 'No Network connection';
  }
  else if (status == 500) {
    return 'Internal Server Error';
  }
  else if (status == 400) {
    return 'Bad Request';
  }
  else {
    return 'Something went wrong';
  }
}

function empty(val) {
  if (val == '' || val == null || val == 'undefined') {
    return true;
  }
  else {
    return false;
  }
}

function NA(input) {
  if (input == '' || input == null) {
    return 'NA';
  }
  else {
    return input;
  }
}

function zeroIFNULL(input) {
  if (input == null) {
    return '0';
  }
  else {
    return input;
  }
}

function inputActive() {
  $$('#login-form input[name=country_code]').parent('div').addClass('disabled-focus');
}
function inputDeactive() {
  $$('#login-form input[name=country_code]').parent('div').removeClass('disabled-focus');
}
function putCountryCode(dial_code) {
  var code_trim = dial_code.slice(0, -1);
  var code_arr = code_trim.split('(');
  $$('#login-form input[name=country_code]').val(code_arr[1]);
}

function copyDeviceID() {
  var message = $$('.output-container').text();
  cordova.plugins.clipboard.copy(message);
  window.plugins.toast.show('Copied to clipboard', 'long', 'bottom');
}

function shareDeviceID() {
  var message = $$('.output-container').text();
  var options = {
    message: message,
  };
  var onSuccess = function (result) { };
  var onError = function (msg) { };
  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

function shareApp() {
  var url = 'https://play.google.com/store/apps/details?id=com.techstreet.utility';
  var options = {
    url: url,
  };
  var onSuccess = function (result) { };
  var onError = function (msg) { };
  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

function getDeviceID() {
  window.plugins.uniqueDeviceID.get(success, fail);
  function success(uuid) {
    $$('.output-container').html(uuid);
    $$('#content_copy').show();
    $$('#content_share').show();
  };
  function fail() {
    
  };
}


function login() {
  var DeviceID = localStorage.fcm_token;
  if (!DeviceID) {
    DeviceID = 'null';
  }
  var Country = $$('#login-form select[name=Country]').val();
  var MobileNo = $$('#login-form input[name=MobileNo]').val();
  var EmailId = $$('#login-form input[name=EmailId]').val();
  var ExistingMember = $$('#login-form input[name=ExistingMember]').val();

  var MobileRequired = true;
  if (Country != 'IN(+91)') {
    MobileRequired = false;
  }

  if (MobileNo == '' && MobileRequired == true) {
    app.dialog.alert("Please enter Mobile Number");
  }
  else if (EmailId == '' && MobileRequired == false) {
    app.dialog.alert("Please enter Email ID");
  }
  else {
    var obj = {
      Country: Country.slice(0, -1).split('(')[0],
      MobileNo: MobileNo,
      EmailId: EmailId,
      ExistingMember: ExistingMember,
      IMEINo: '',
      DeviceID: DeviceID,
      OSType: device.platform,
      OTP: '',
    };
    console.log(obj);
    app.request({
      url: BaseURL + '/WholesalerLogin',
      method: 'POST',
      dataType: 'json',
      data: obj,
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(AuthUsername + ":" + AuthPassword));
        var spinnerOptions = { dimBackground: false };
        SpinnerPlugin.activityStart(null, spinnerOptions);
      },
      error: function (xhr, status) {
        alert(statusMessage(status));
      },
      success: function (data, status, xhr) {
        console.log(data);
        if (data.ErrorCode == '0') {

        }
        else if (data.ErrorCode == '3000') {
          // app.router.navigate({
          //   name: 'login',
          //   params: { 'UserName': UserName },
          // });
        }
        else if (data.ErrorCode == '3100') {
          // app.router.navigate({
          //   name: 'first-login',
          //   params: { 'UserName': UserName },
          // });
        }
        else if (data.ErrorCode == '3200') {
          // app.dialog.alert(data.ErrorMessage, function () {
          //   app.router.navigate({
          //     name: 'set-password',
          //     params: { 'UserName': UserName },
          //   });
          // });
        }
        else {
          app.dialog.alert(data.ErrorMessage);
        }
      },
      complete: function (xhr, status) {
        SpinnerPlugin.activityStop();
      }
    })
  }
}

// logout
function logout() {
  localStorage.removeItem("User");
  app.router.navigate('/');
}

// key press
$$('.input-end').keypress(function (e) {
  if (e.keyCode == 13) {
    this.blur();
  }
});