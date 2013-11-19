define(["jquery", 
    "kendo", 
    'ext/util'
    ],
    function($, kendo, util) {
        'use strict';

        return kendo.Class.extend({
        
            init: function() {
                $("#home .grid").kendoGrid({
                    columns:[
                    {
                        field: "FirstName",
                        title: "First Name"
                    },
                    {
                        field: "LastName",
                        title: "Last Name"
                    }],
                
                    dataSource: {
                        data: [
                        {
                            FirstName: "Joe",
                            LastName: "Smith"
                        },
                        {
                            FirstName: "Jane",
                            LastName: "Smith"
                        }]
                    }
                });

            },
            
            render: function(data){
                var grid = $("#home .grid").data("kendoGrid");
                //                grid.dataSource.data(data);
                grid.refresh();
            }
        })
    });