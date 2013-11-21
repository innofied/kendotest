define(["jquery", 
    "kendo", 
    'ext/util',
    'views/Chart',
    'views/Grid'
    ],
    function($, kendo, util, ChartView, GridView) {
        'use strict';

        return kendo.Class.extend({
            init: function(){
                var selectedItem,
                chartView, gridView;
                
                $('#home .menu').kendoTreeView({
                    animation: false,
                    dataTextField: "Name",
//                    dataSource: [
//                    {
//                        Name: "Asia Pacific", 
//                        items: [
//                        {
//                            Name: "China"
//                        }
//                        ]
//                    }
//                    ],
                    select: function(e) {
                        selectedItem  = this.dataItem(e.node).get('Name');
                        // Draw the chart and grid
                        if(!chartView && ! gridView){
                            chartView = new ChartView(),
                            gridView = new GridView();
                        }
                        chartView.render(selectedItem);
                        gridView.render(selectedItem);
                    }
                });  
            },
            
            render: function() {
                
                var gridData = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            type: "GET",
                            url: util.api.getMenuList,
                            data: {
                                DimName: 'Countries_Currency'
                            }
                        }
                    },
                    schema: {
                        data: 'Results.Members',
                        model: {
                            children: "Children"
                        }
                    },
                    error: function(req, exception, error) {
                        util.showErrorOnReqFail(req, exception, error);
                    }
                });
                
                gridData.read();
                
                $('#home .menu').data('kendoTreeView').setDataSource(gridData);
            }
        })
    });