define(["jquery", 
    "kendo", 
    'ext/util',
    'views/Menu'
    ],
    function($, kendo, util, Menu) {
        'use strict';

        window.KendoTestApp = {
            view : {}
        };

        return {
            init: function() {
                //Show the menu on the left as a treeview
                var menu = KendoTestApp.view.menu = new Menu();
                $('#home').prepend(menu.render().el);

            }
        }
    });