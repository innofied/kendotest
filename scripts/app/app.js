define(["jquery", 
    "kendo", 
    'ext/util',
    'views/Menu'
    ],
    function($, kendo, util, Menu) {
        'use strict';

        return {
            init: function() {
                
                //Show the menu on the left as a treeview
                var menu = new Menu();
                menu.render();
            }
        }
    });