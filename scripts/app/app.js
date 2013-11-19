define(["jquery", 
    "kendo", 
    'ext/util',
    'views/Chart'
    ],
    function($, kendo, util, ChartView) {
        'use strict';

        return {
            init: function() {
                console.log('App started');
                this.showMenuTreeView();
            },
            /*
             *  Show the menu on the left as a treeview
             */
            showMenuTreeView: function(){
                var selectedItem,
                data = [{
                    name: 'Total Company',
                    items: [{
                        name: 'Asia Paific',
                        items: [{
                            name: 'China'
                        },{
                            name: 'Japan'
                        }]
                    },{
                        name: 'Americas',
                        items: [{
                            name: 'Mexico'
                        },{
                            name: 'USA'
                        }]
                    },{
                        name: 'All Europe',
                        items: [{
                            name: 'Southern Europe'
                        },{
                            name: 'Northern Europe'
                        },{
                            name: 'Central Europe'
                        },{
                            name: 'Go Accessories'
                        }]
                    }]
                }];
                
                // Initialize treeview
                $('#home .menu').kendoTreeView({
                    animation: false,
                    dataSource: data,
                    dataTextField: "name",
                    select: function(e) {
                        selectedItem  = this.dataItem(e.node).get('name');
                        console.log("Selecting", selectedItem);
                        if(!chartView){
                            var chartView = new ChartView();
                        }
                        chartView.render();
                        
                    }
                });
            }
        }
    });