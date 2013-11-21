define(["jquery",
        "kendo",
        'ext/util',
        'views/Chart',
        'views/Grid'
    ],
    function($, kendo, util, ChartView, GridView) {
        'use strict';

        return kendo.Class.extend({
            tpl: '<div class="menu"></div>', // Can use a template library here e.g Handlesbars or Underscore

            render: function() {
                this.el = $(this.tpl)[0];
                this.onRender();
                return this;
            },

            onRender: function() {
                var me = this,
                    chartView,
                    gridView;

                me.treeData = new kendo.data.HierarchicalDataSource({
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

                me.treeData.read();

                $(this.el).kendoTreeView({
                    animation: false,
                    dataTextField: "Name",
                    dataSource: me.treeData,
                    select: me.showDetailView
                });
            },

            // Instantiate chart and grid views and render them
            showDetailView: function(e) {
                var selectedCountry = this.dataItem(e.node).get('Name');

                // Draw the chart and grid
                if (!KendoTestApp.view.grid) {
                    KendoTestApp.view.grid = new GridView();
                    $('#home .content').append(KendoTestApp.view.grid.render().el);
                }
                KendoTestApp.view.grid.loadData(selectedCountry);

                if (!KendoTestApp.view.chart) {
                    KendoTestApp.view.chart = new ChartView();
                    $('#home .content').append(KendoTestApp.view.chart.render().el);
                }
                KendoTestApp.view.chart.loadData(selectedCountry);
            }
        })
    });
