require.config({
    baseUrl : 'scripts/app/',
				
    paths: {
        jquery: "../lib/jquery-1.9.1",
        kendo: "../lib/kendo/kendo.web.min",
        text: '../lib/text'
    },
				
    shim: {
        jquery: {
            exports: "jquery"
        },
								
        kendo: {
            deps: ["jquery"],
            exports: "kendo"
        }
    }
});

// Expose the app module to the global scope so Kendo can access it.
var App;
 
require(['app'], function (application) {
    App = application;
    App.init();
});

