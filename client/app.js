var colors = ['#f98a83', '#989898', '#85f77e']

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  mounted () {
    this.sentimentsLineChart()
  },
  methods: {
    sentimentsLineChart: function () {
      var highchartContainer = 'sentimentsLineChart'
      var seriesOptions = []
      var seriesCounter = 0
      var createChart = function () {
        Highcharts.stockChart(highchartContainer, {
          chart: {
            spacingBottom: 30
          },
          legend: {
            enabled: true,
            floating: true,
            verticalAlign: 'bottom',
            align:'center',
            y: 30
          },
          rangeSelector: {
            selected: 4
          },
          plotOptions: {
            series: {
              showInNavigator: true
            },
          },
          series: seriesOptions
        })
      }
      var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
      var postId = getParameterByName('id', window.location.href)
      console.log(postId)
      var names = ['positive', 'neutral', 'negative']
      var component = this
      axios.get('/dashboard/data/btt-sentiments/S'+ postId +'.json')
      .then(response => {
        var data = response.data
        var chartData = {
          negative: [],
          neutral: [],
          positive: [],
          pointStart: ''
        }
        var dates = []
        var names = ['negative', 'neutral', 'positive']
        chartData.negative = data.chart.negative
        chartData.neutral = data.chart.neutral
        chartData.positive = data.chart.positive
        chartData.pointStart = data.pointStart
        names.forEach(function (name, i) {
          seriesOptions[i] = {
            name: name,
            data: chartData[name],
            color: colors[i],
            pointStart: chartData.pointStart * 10,
            pointInterval: 3600 * 1000 * 24
          }
          seriesCounter += 1
          if (seriesCounter === names.length) {
            createChart()
          }
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  }
})