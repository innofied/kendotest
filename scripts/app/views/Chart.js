define(["jquery",
        "kendo",
        'ext/util'
    ],
    function($,
        kendo,
        util) {
        'use strict';

        return kendo.Class.extend({
            tpl: '<div class="chart"></div>',

            render: function() {
                this.el = $(this.tpl)[0];
                this.onRender();
                return this;
            },

            onRender: function() {
                var me = this;
                me.renderChart();
            },

            // Create chart panel
            renderChart: function() {
                this.chart = $(this.el).kendoChart({
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

            // Load chart data
            loadData: function(selectedCountry) {
                var me = this;
                this.selectedCountry = selectedCountry;

                $.ajax({
                    type: "GET",
                    url: util.api.getChartData,
                    data: {
                        countries_currency: 'MDX:{[Countries_Currency].[' + this.selectedCountry + '].Children}'
                    },
                    timeout: util.ajaxTimeOut,
                    success: function(response) {
                        if (response.ErrorInfo.Success) {
                            me.displayCharts(response.Results);
                        }
                    },
                    error: util.showErrorOnReqFail
                });
            },

            // Draw the charts in chart panel
            displayCharts: function(data) {
                var me = this,
                    chartSeries = [],
                    chart = this.chart = $(this.el).data("kendoChart"),
                    chartOptions = chart.options,
                    color = ['blue', 'red', 'orange', 'green', 'black', 'yellow'];


                for (var i = 0; i < data.RowSet.Rows.length; i++) {
                    var chartData = [];
                    for (var j in data.RowSet.Rows[i]) {
                        if (typeof(data.RowSet.Rows[i][j]) === 'number') {
                            chartData.push(Math.floor(data.RowSet.Rows[i][j] / (Math.pow(10, 11))))
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

                me.makeChartDraggable();
            },

            // Enable dragging og chart circles
            makeChartDraggable: function() {
                // convert to SVG format for dragging the point
                var chart = this.chart,
                    me = this,
                    circle,
                    path, pathLength, circleLength,
                    chartHeight,
                    svg = chart.svg();

                $(this.el).html(svg);
                me.index = 0;
                chartHeight = $(this.el).height() - 70;

                circle = $(me.el).find('svg g g circle');
                path = $(me.el).find('svg g g path');
                pathLength = path.length;
                circleLength = circle.length;

                // Set attribute to the line path for retrieving the value
                path.each(function() {
                    if (!$(this).attr('data-index')) {
                        $(this).attr('data-index', ++me.index);
                    }
                });

                // Set attribute to the line circle(point) for retrieving the circle
                for (var k = 0; k < circleLength; k++) {
                    $(circle[k]).attr('data-index', (k % pathLength) + 1).attr('data-bar', Math.ceil((k + 1) / pathLength))
                }

                // Make all the chart points draggable
                circle.kendoDraggable({
                    hint: function(element) {
                        return element.clone();
                    },
                    drag: function(e) {
                        me.movePathWithPoint(e.currentTarget[0], e.offsetY + 2, chartHeight - e.offsetY);
                    },
                    axis: "y",
                    container: $('svg')
                });
            },

            // Move the line along  with the circle
            movePathWithPoint: function(element, pos, chartHeight) {
                var pointIndex, path, p_array, pathElement;

                pos = pos + 2;

                pointIndex = +$(element).attr('data-bar') - 1;

                pathElement = $('svg g g path[data-index=' + $(element).attr('data-index') + ']');

                if (chartHeight > 0 && pos > 50) {
                    path = pathElement.attr('d');
                    path = path.substr(1);

                    // Set the path along with the gragging circle
                    p_array = path.split(" ");
                    p_array[(pointIndex * 2) + 1] = pos;

                    path = "M" + p_array.join(" ")
                    pathElement.attr('d', path);

                    element.setAttribute('cy', pos);
                }
            }
        });
    });
