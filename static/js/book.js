// echarts
const chartStore = {
    pie: null,
    bar: null,
    line: null,
}

const optionForPie = function(data) {
    let option = {
        // roseType: 'angle',//南丁格尔图
        backgroundColor:'rgba(128, 128, 128, 0.1)', //rgba设置透明度0.1
        title: {
            text: '地区占比',
            x: 'center'
        },
        // legend: {
        //     orient: 'vertical',
        //     left: 10,
        //     data: data
        // },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '地区占比',
                type: 'pie',
                radius: '55%',
                // radius: ['50%', '70%'],
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },


            }
        ]
    }

    return option
}

const optionForArea = function(area) {
    let data = _.map(area, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    let option = optionForPie(data)
    return option
}

const optionForBar = function(data) {
    let option = {
        backgroundColor:'rgba(128, 128, 128, 0.1)', //rgba设置透明度0.1
        title: {
            text: '性价比分析',
            // x: 'center'
        },
        legend: {
            data: ['价格', '数量']
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c0}元"
        },
        xAxis: {
            data: data.axis,
            // name: '国家',
            axisTick: {
                show: false
            },
            // axisLabel: {
            //     interval:0,//代表显示所有x轴标签显示
            // }
        },
        yAxis: {
            // name: '书籍价格',
            // axisLine: {
            //     show: false
            // },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                name: '价格',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },

                },
                data: data.data

            },
            {
                name: '数量',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: "#386db3",//折线点的颜色
                        lineStyle: {
                            color: "#386db3"//折线的颜色
                        }

                    }
                },//line颜色
                data: data.number

            }
        ]
    }
    return option
}

const optionForType = function(type) {
    let data = {
        axis: [],
        data: [],
        number: [],
    }
    _.each(type, (v, k) => {
        let avg = _.meanBy(v, 'price')
        data.axis.push(k)
        //把 Number 四舍五入为指定小数位数的数字。
        data.data.push(avg.toFixed(2))
        data.number.push(v.length)
    })
    // console.log(data)
    let option = optionForBar(data)
    return option
}

const optionForLine = function(data, data1) {
    let option = {
        backgroundColor:'rgba(128, 128, 128, 0.1)', //rgba设置透明度0.1
        title: {
            text: '出版日期增加，平均分数和评价人数变化趋势'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                // console.log(params)
                params_one = params[0]
                params_two = params[1]
                let value1 = params_one.value
                let value2 = params_two.value
                let s = `${value1[0]}年<br/>
                         平均分 ${value1[1]}<br/>
                         评价人数 ${value2[1].split('.')[0]}
                         `
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['平均分数', '平均评价人数']
        },
        xAxis: {
           // name: '出版日期',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: [{
            type: 'value',
            name: '平均分数',
            position: 'left',  // y轴在左侧
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 6,
            max: 10,
        }, {
            type: 'value',
            name: '平均评价人数',
            position: 'right',  // y轴在右侧
            min: 4000,
            },
        ],
        series: [
            {
                name: '平均分数',
                type: 'line',
                stack: '总量',
                yAxisIndex: 0,
                showSymbol: false,
                data: data,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color: 'rgba(195,59,63,0.6)',

                        }
                    }
                },
            },
            {
                name: '平均评价人数',
                type: 'line',
                stack: '总量',
                yAxisIndex: 1,
                showSymbol: false,
                data: data1,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color: 'rgba(34,119,124,0.6)',

                        }
                    }
                },
            }
        ]
    };
    return option
}

const optionForYear = function(year) {
    let data = _.map(year, (v, k) => {
        let avg = _.meanBy(v, 'score')
        let o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    let data1 = _.map(year, (v, k) => {
        let avg = _.meanBy(v, 'number')
        let o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    let option = optionForLine(data, data1)
    return option
}

const renderChart = function(d) {
    let data = d

    let area = _.groupBy(data, 'area')
    let areaOption = optionForArea(area)
    let pie = chartStore.pie
    pie.setOption(areaOption)

    let type = _.groupBy(data, 'area')
    let typeOption = optionForType(type)
    let bar = chartStore.bar
    bar.setOption(typeOption)

    let year = _.groupBy(data, 'year')
    let yearOption = optionForYear(year)
    let line = chartStore.line
    line.setOption(yearOption)
}

const fetchBooks= function() {
    let protocol = location.protocol
    // 如果是通过 node 运行的, prototol 是 http
    // 则调用 api 来获取电影数据
    // 否则直接调用 movieJSON 函数获取电影数据
    if (protocol === 'http:') {
        // 使用 ajax 动态获取数据
        api.fetchBooks(function (d) {
            d = JSON.parse(d)
            renderChart(d)
        })
    } else {
        // 直接使用 JSON 数据 不从后台获取
        let d = bookJSON()
        renderChart(d)
    }
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        let element = document.querySelector(selector)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchBooks()
}

// $(document).ready() 这个东西是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function() {
    __main()
})
