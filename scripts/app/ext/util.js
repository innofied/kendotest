define(['jquery', 'kendo', 'ext/util'], function($, kendo, util) {
    var _kendoApp;

    return {
        ajaxTimeOut: 20000,
        api: (function() {
            var baseUrl = 'http://www.CarpeDatumInc.com:4080/ES3/esWeb.svc/json/';
            return {
                getMenuList: baseUrl + 'TM1SubsetMembers',
                getGridData: baseUrl + 'ProductSalesByQtr',
                getChartData: baseUrl + 'RevenueByCountry'
            }
        }()),
        init: function(app) {
            _kendoApp = app;
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
        /**
         *
         * Show appropiate error on ajax request failure
         * 
         **/
        showErrorOnReqFail: function(req, exception, error) {
//            this.hideLoading();
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
