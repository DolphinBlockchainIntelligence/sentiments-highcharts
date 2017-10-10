var colors = ['#f98a83', '#989898', '#85f77e']
new Vue({
  el: '#linechart',
  template: '<div id="sentimentsLineChart" style="min-width: 100%; width: 100%; height: 100vh; min-height: 100vh; margin: 0 auto"></div>',
  mounted () {
    this.sentimentsLineChart()
  },
  methods: {
    sentimentsLineChart: function () {
      var highchartContainer = document.getElementById('sentimentsLineChart')
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
      var names = ['positive', 'neutral', 'negative']
      var component = this
      axios.get('https://beta.dolphin.bi/dashboard/data/btt-sentiments/S'+ postId +'.json')
      // axios.get('/dashboard/data/btt-sentiments/S'+ postId +'.json')
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