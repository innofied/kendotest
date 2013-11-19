define(["jquery", 
    "kendo",
    'ext/util'],
    function($, 
        kendo,
        util) {
        'use strict';

        return kendo.Class.extend({
            init: function() {
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
            }, 
            
            render: function(data){
                var chart = $("#home .chart").data("kendoChart"),
                svg;
                //                chart.dataSource.data(data);
                //                chart.refresh();
                
                svg = chart.svg();
                $("#home .chart").html(svg);

                $('circle').kendoDraggable({ 
                    hint: function(element) {
                        return element.clone();
                    },
                    drag: function(e) {
                        console.log('Target', e.currentTarget[0], e.target)
                        movePathForPointId(e.currentTarget[0], e.offsetY + 2);
                    },
                    axis: "y",
                    container: $('svg') 
                });
                
                function movePathForPointId(element, pos) {
                    // Update pos to account for the circle radius 
                    pos = pos + 2;
    
                    // First find the position of the circle,     
                    var pointIndex = $('svg g g circle').index(element); 
   
                    // Get the first path in the graph 
                    var pathElement = $('svg g g path').first();
    
                    var path = pathElement.attr('d');     
                    path = path.substr(1);                
                    var p_array = path.split(" ");            
                    p_array[(pointIndex * 2) + 1] = pos;  
                    path = "M"+ p_array.join(" ")         
                    pathElement.attr('d', path);          
                    element.setAttribute('cy', pos); 
                    return pointIndex;                 
                }
            }
        });
    });