define(['jquery', 'kendo', 'ext/util'], function($, kendo, util) {
    var _kendoApp;

    return {
        ajaxTimeOut: 20000,
        api: (function() {
                var baseUrl = 'http://www.CarpeDatumInc.com:4080/ES3/esWeb.svc/json/';
                return {
                    getCountryList: baseUrl + 'Hierarchy'
                }
        }()),
        init: function(app) {
            _kendoApp = app;
        },
        setViewTitle: function(view, title) {
            view.data("kendoMobileView").title = title;
            var navbar = view.find(".km-navbar").data("kendoMobileNavBar");
            if (navbar) {
                navbar.title(title);
            }
        },
        navigate: function(location, animation) {
            if (animation && animation.type && animation.direction) {
                _kendoApp.navigate(location, animation.type + ':' + animation.direction);
            } else {
                _kendoApp.navigate(location);
            }

        },
        redirect: function(location) {
            _kendoApp.pane.history.pop();
            _kendoApp.navigate(location);
        },
        scrollViewToTop: function(viewElement) {
            viewElement.data("kendoMobileView").scroller.reset();
        },
        showLoading: function(message) {
            $('#loading_custom_modal').css({
                "display": 'block'
            })
            $(".km-loader h1").html(message ? message : "Loading");
            _kendoApp.showLoading();
        },
        hideLoading: function() {
            $('#loading_custom_modal').css({
                "display": 'none'
            })
            _kendoApp.hideLoading();
        },
        showError: function(message, error) {
            var errorMessage = message + (error === undefined ? "" : "\n" + error.status + ": " + error.statusText);
            $("#error-view .message").text(errorMessage);
            //            $("#error-view").show().data().kendoMobileModalView.open();
        },
        closeError: function() {
            $("#error-view").data().kendoMobileModalView.close();
        },
        // Show message alert
        showMessage: function(msg, title, callback) {
            if (!msg) {
                return;
            }

            if (navigator.notification) {
                navigator.notification.alert(msg, callback || function() {
                }, title || 'Error');
            } else {
                alert(msg);
            }
        },
        showConfirmation: function(msg, title, callback) {
            if (!msg) {
                return;
            }
            var callbackFn = callback || function() {
            }
            if (navigator.notification) {
                navigator.notification.confirm(msg, callbackFn, title || 'Confirm', 'LOSE CHANGES,CANCEL');
            } else {
                var buttonPressed = confirm(msg);
                callbackFn(buttonPressed);
            }

        },
        /**
         *
         * Show appropiate error on ajax request failure
         * 
         **/
        showErrorOnReqFail: function(req, exception, error) {
            this.hideLoading();
            if (!window.navigator.onLine) {
                this.showMessage("Try this again when you are connected to WI-FI or have a good cellular connection.",
                        'No connection');
            } else {
                if (exception === 'error') {
                    switch (req.status) {
                        case 404 :
                            this.showMessage("Requested page not found.\nsorry for inconvenience",
                                    'Error');
                            break;
                        case 500 :
                            this.showMessage("Internal Server Error.\nsorry for inconvenience.",
                                    'Error');
                            break;
                    }
                } else {
                    switch (exception) {
                        case 'parsererror' :
                            this.showMessage('Error while parsing requested data.', 'Parse error');
                            break;
                        case 'timeout' :
                            this.showMessage('Request time out.\nTry again.', 'Time Out');
                            break;
                        case 'abort' :
                            this.showMessage('Request aborted.', 'Error');
                            break;
                        default :
                            this.showMessage('Uncaught Error.', req.responseText);
                            break;
                    }
                }
            }
        }
    };
});
