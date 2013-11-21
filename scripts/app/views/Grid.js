define(["jquery",
        "kendo",
        'ext/util'
    ],
    function($, kendo, util) {
        'use strict';

        return kendo.Class.extend({

            tpl: '<div class="grid"></div>',

            render: function() {
                this.el = $(this.tpl)[0];
                this.onRender();
                return this;
            },

            // After render
            onRender: function() {},

            loadData: function(selectedCountry) {
                var me = this;

                $.ajax({
                    type: "GET",
                    url: util.api.getGridData,
                    data: {
                        Countries_Currency: selectedCountry
                    },
                    timeout: util.ajaxTimeOut,
                    success: function(response){
                        me.renderGrid(response);
                    },
                    error: util.showErrorOnReqFail
                });
            },

            // Initialize and render grid
            renderGrid: function(response) {
                var columns = [],
                    rows;

                if (response.ErrorInfo.Success) {
                    // Data manipulation in accordance to Kendo grid
                    for (var i in response.Results.Columns) {
                        columns.push({
                            field: i,
                            title: response.Results.Columns[i]['Name']
                        });
                    }
                    rows = response.Results.RowSet.Rows;

                    this.grid = $(this.el).kendoGrid({
                        height: 250,
                        columns: columns,
                        dataSource: {
                            data: rows
                        }
                    });
                }
            }
        })
    });
