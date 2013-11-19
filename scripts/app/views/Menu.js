define(["jquery", 
    "kendo", 
    'ext/util',
    'views/Chart',
    'views/Grid'
    ],
    function($, kendo, util, ChartView, GridView) {
        'use strict';

        return kendo.Class.extend({
        
            render: function() {
                var selectedItem,
                chartView, gridView,
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
                        
                        // Draw the chart and grid
                        if(!chartView && ! gridView){
                            chartView = new ChartView(),
                            gridView = new GridView();
                        }
                        chartView.render();
                        gridView.render();
                    }
                });

            }
        })
    });