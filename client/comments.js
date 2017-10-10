var colors = ['#f98a83', '#989898', '#85f77e']
new Vue({
  el: '#comments',
  template: 
  `
  <div id="sentiments-comments" class="sentiments-comments">
    <ul class="comments">
        <li v-for="(comment, key) in comments" :class="'comment sentiment'+comment.Sentiment">
        <div class="heading">
          <div class="author">{{ comment.user }}:</div>
          <div class="date">{{ comment.date }}:</div>
        </div>
        <a :href="'https://bitcointalk.org/index.php?topic='+comment.topicId+'.msg'+key+'#msg'+key" target="_blank" class="text">{{ comment.text }}:</a>
      </li>
    </ul>
    <p align="center">
      <a class="waves-effect waves-light btn btn-show-all" @click.prevent="toShowAll($event)">Show all</a>
    </p>
  </div>
  `,
  data: function data() {
    return {
      commentsSource: [],
      showNumber: 30,
      showAll: false
    }
  },
  mounted () {
    this.loadComments()
  },
  computed: {
    comments () {
      var comments = this.commentsSource
      comments = _.orderBy(comments, ['date'], ['desc'])
      comments = _.forEach(comments, function(item, i) {
        item.date = moment(item.date).calendar()
      })
      if (!this.showAll) {
        const pick = (obj, keys) =>
          Object.keys(obj)
            .slice(0, keys)
            .reduce((acc, key) => {
              acc[key] = obj[key];
              return acc;
            }, {})
        comments = pick(comments, this.showNumber)
      }
      return comments
    }
  },
  methods: {
    loadComments: function () {
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
      axios.get('https://beta.dolphin.bi/dashboard/data/btt-sentiments/D'+ postId +'.json')
      // axios.get('/dashboard/data/btt-sentiments/D'+ postId +'.json')
      .then(response => {
        this.commentsSource = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
    },
    toShowAll: function (event) {
      this.showAll = true
      event.currentTarget.classList.add('hide')
    }
  }
})