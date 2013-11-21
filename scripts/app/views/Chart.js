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
                        text: "Revenue By Country"
                    },
                    legend: {
                        position: "bottom"
                    },
                    seriesDefaults: {
                        type: "line",
                        style: "smooth"
                    },
                    valueAxis: {  
                        labels: {  
                            format: "{0}%"  
                        },  
                        line: {  
                            visible: true  
                        },
                        axisCrossingValue: 0
                    },  
                    categoryAxis: {
                        categories: ['Q1', 'Q2', 'Q3', 'Q4'],  
                        majorGridLines: {  
                            visible: false  
                        }  
                    }
                });
            }, 
            
            render: function(data){
                var  me = this,
                chartSeries = [],
                chart = $("#home .chart").data("kendoChart"),
                svg,  chartHeight,  circle,
                chartOptions = chart.options,
                color = ['blue', 'red', 'orange', 'green', 'black', 'yellow'],
                path,  pathLength,  circleLength;
                
                me.index = 0;
                chartHeight = $('#home .chart').height() - 70;

                $.ajax({
                    type: "GET",
                    url: util.api.getChartData,
                    data: {
                        countries_currency: 'MDX:{[Countries_Currency].[' + data + '].Children}'
                    },
                    timeout: util.ajaxTimeOut,
                    success: function(response) {
                        console.log('Chart', response);
                        if (response.ErrorInfo.Success) {
                            showChart(response.Results);
                        } 
                    },
                    error: function(req, exception, error) {
                        util.showErrorOnReqFail(req, exception, error);
                    }
                });
                 
                // Draw the chart with the retrieved data and make the points draggable
                function showChart(data){
                    for(var i=0; i< data.RowSet.Rows.length; i++){
                        var chartData = [];
                        for(var j in data.RowSet.Rows[i]){
                            if(typeof(data.RowSet.Rows[i][j]) === 'number'){
                                chartData.push(Math.floor(data.RowSet.Rows[i][j]/(Math.pow(10,11))))
                            }
                        }
                        chartSeries.push({
                            name: data.RowSet.Rows[i]['Countries_Currency'],
                            data: chartData,
                            color: color[i]
                        });
                    }
                                    
                    // Set the line-chart series and redraw the chart with new data                
                    chartOptions.series = chartSeries;
                    chart.redraw();  
                    
                    // convert to SVG format for dragging the point
                    svg = chart.svg();
                    $("#home .chart").html(svg);
                    
                    circle = $('svg g g circle');
                    path = $('svg g g path');
                    pathLength = $('svg g g path').length;
                    circleLength=  $('svg g g circle').length;
                    
                    // Set attribute to the line path for retrieving the value
                    path.each(function(){
                        if(!$(this).attr('data-index')){
                            $(this).attr('data-index', ++me.index);
                        }
                    });
                
                    // Set attribute to the line circle(point) for retrieving the circle
                    for(var k=0; k<circleLength; k++){
                        $(circle[k]).attr('data-index', (k % pathLength) +1).attr('data-bar', Math.ceil((k+1) / pathLength))
                    }
                
                    // Make the chart points draggable
                    $('#home .chart svg g g circle').kendoDraggable({ 
                        hint: function(element) {
                            return element.clone();
                        },
                        drag: function(e) {
                            movePathWithPoint(e.currentTarget[0], e.offsetY + 2, chartHeight - e.offsetY);
                        },
                        axis: "y",
                        container: $('svg')
                    });
               
                    
                    // Move the line along  with the circle
                    function movePathWithPoint(element, pos, chartHeight) {
                        var pointIndex, path, p_array, pathElement;
                    
                        pos = pos + 2;
                    
                        pointIndex = +$(element).attr('data-bar') - 1; 
                    
                        pathElement = $('svg g g path[data-index='+ $(element).attr('data-index')+ ']');
                        
                        if(chartHeight > 0 && pos > 50){
                            path = pathElement.attr('d');     
                            path = path.substr(1);          
                            
                            // Set the path along with the gragging circle
                            p_array = path.split(" ");            
                            p_array[(pointIndex * 2) + 1] = pos;
                    
                            path = "M"+ p_array.join(" ")         
                            pathElement.attr('d', path);    
                    
                            element.setAttribute('cy', pos);
                        }
                    }
                }
            }
        });
    });