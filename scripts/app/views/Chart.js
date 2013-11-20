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
                        }
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
                var chartSeries = [],
                chart = $("#home .chart").data("kendoChart"),
                svg, chartHeight,
                chartOptions = chart.options;
                
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
                        } else {
                        }
                    },
                    error: function(req, exception, error) {
                        util.showErrorOnReqFail(req, exception, error);
                    }
                });
               
                function showChart(data){
                    var color = ['blue', 'red', 'orange', 'green', 'black', 'yellow']
                    for(var i=0; i< data.RowSet.Rows.length; i++){
                        var chartData = [];
                        for(var j in data.RowSet.Rows[i]){
                            if(typeof(data.RowSet.Rows[i][j]) === 'number'){
                                chartData.push(data.RowSet.Rows[i][j])
                            }
                        }
                        chartSeries.push({
                            name: data.RowSet.Rows[i]['Countries_Currency'],
                            data: chartData,
                            color: color[i]
                        });
                    }
                    
                    
                    
                    chartOptions.series = chartSeries;
                    chart.redraw();  
                    
                    
                    return;
                    
                    
                    svg = chart.svg();
                    $("#home .chart").html(svg);
                
                    chartHeight = $('#home .chart').height() - 70;

                    $('#home .chart svg g g circle').kendoDraggable({ 
                        hint: function(element) {
                            return element.clone();
                        },
                        drag: function(e) {
                            movePathForPointId(e.currentTarget[0], e.offsetY + 2, chartHeight - e.offsetY, e);
                        },
                        axis: "y",
                        container: $('svg')
                    });
               
                
                    function movePathForPointId(element, pos, chartHeight, e) {
                        var pointIndex, path, p_array, pathElement;
                    
                        pos = pos + 2;
    
                        pointIndex = $('svg g g circle').index(element); 
                        
                        var index = $('svg g g path').index(e.currentTarget[0].parentNode);
                        
                        pathElement = $('svg g g path:nth-child(4)');
                        // Get the first path in the graph 
//                        pathElement = $('svg g g path:nth-child('+index+')');
                        
                        console.log('El',e.currentTarget[0].parentNode,index, pathElement,e)
                        
                        if(chartHeight > 0 && pos > 15){
                            path = pathElement.attr('d');     
                            path = path.substr(1);          
                    
                            p_array = path.split(" ");            
                            p_array[(pointIndex * 2) + 1] = pos;
                    
                            path = "M"+ p_array.join(" ")         
                            pathElement.attr('d', path);    
                    
                            element.setAttribute('cy', pos);
                        }
                        return pointIndex;                 
                    }
                }
            }
        });
    });