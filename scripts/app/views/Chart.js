define(["jquery", 
    "kendo",
    'ext/util'],
    function($, 
        kendo,
        util) {
        'use strict';

        return kendo.Class.extend({
            render: function() {
                $("#home .chart").kendoChart({
                    title: {
                        text: "Internet Users"
                    },
                    legend: {
                        position: "bottom"
                    },
                    seriesDefaults: {
                        type: "line"
                    },
                    series: [{
                        name: "World",
                        data: [15.7, 16.7, 20, 23.5, 26.6]
                    }, {
                        name: "United States",
                        data: [67.96, 68.93, 75, 74, 78]
                    }],
                    valueAxis: {
                        labels: {
                            format: "{0}%"
                        }
                    },
                    categoryAxis: {
                        categories: [2005, 2006, 2007, 2008, 2009]
                    }
                });

            }
        });
    });