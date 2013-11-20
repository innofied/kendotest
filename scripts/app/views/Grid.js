define(["jquery", 
    "kendo", 
    'ext/util'
    ],
    function($, kendo, util) {
        'use strict';

        return kendo.Class.extend({
        
            render: function(data){ 
                var columns=[], rows;
                
                $.ajax({
                    type: "GET",
                    url: util.api.getGridData,
                    data: {
                        Countries_Currency: data
                    },
                    timeout: util.ajaxTimeOut,
                    success: function(response) {
                        
                        if (response.ErrorInfo.Success) {
                            
                            for(var i in response.Results.Columns){
                                columns.push({
                                    field: i,
                                    title: response.Results.Columns[i]['Name']
                                });
                            }
                            rows = response.Results.RowSet.Rows;
                            
                            $("#home .grid").kendoGrid({
                                height: 250,
                                columns: columns,
                                dataSource: {
                                    data: rows
                                }
                            });
                        } else {
                        }
                    },
                    error: function(req, exception, error) {
                        util.showErrorOnReqFail(req, exception, error);
                    }
                });
            }
        })
    });