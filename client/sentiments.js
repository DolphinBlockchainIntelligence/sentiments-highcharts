new Vue({
  el: '#sentiments',
  template: 
  `
  <div>
    <h3>Bitcointalk.org sentiments</h3>
    <div class="content-wrapper">
      <div class="datatable-options mdl-textfield mdl-js-textfield mdl-shadow--2dp">
        <input class="mdl-textfield__input" v-model="query" placeholder="Search post" />
      </div>
      <table class="table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th @click="sort('announce')">
              <span>Announce</span>
              <i class="material-icons"></i>
            </th>
            <th @click="sort('NumReplies')">
              <span>Replies</span>
              <i class="material-icons"></i>
            </th>
            <th @click="sort('DateTimeLastPost')">
              <span>Last comment</span>
              <i class="material-icons"></i>
            </th>
            <th @click="sort('rank')">
              <span>Rank</span>
              <i class="material-icons"></i>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody name="table-row">
          <tr v-for="post in computedList" key="tr" class="table-row-item" :to="'/post/' + post.topicId" @click="goToPost(post.topicId, post.announce)">
            <td key="announce">{{ post.announce }}</td>
            <td key="replies">{{ post.NumReplies }}</td>
            <td key="lastComment">{{ post.DateTimeLastPost }}</td>
            <td key="rank">{{ post.rank }}</td>
            <td class="links" key="links">
              <a href="#" @click="dataHref(post.topicStarterUrl, $event)">
                <i class="material-icons">account_circle</i>
              </a>
              <a href="#" @click="dataHref(post.topicUrl, $event)">
                <i class="material-icons">assignment</i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <p align="center">
        <button type="button" class="success button" @click.prevent="toShowAll($event)">Show all</button>
      </p>
    </div>
  </div>
  `,
  data: () => ({
    query: '',
    sortBy: '',
    sortOrder: '',
    postsList: [],
    showNumber: 100,
    showAll: false,
    assets: []
  }),
  created () {
    axios.get('https://beta.dolphin.bi/dashboard/data/announceList.json')
    .then((response) => {
      this.assets = response.data
    }, (err) => {
      console.log(err)
    })
  },
  methods: {
    dataHref: function (url, event) {
      event.preventDefault()
      event.stopPropagation()
      window.open(url, '_blank')
    },
    goToPost(topicId, announce) {
      // routes.push({ name: 'Sentiment', params: { id: topicId, announce: announce }})
      window.open('sentiment.html?id='+topicId, '_self')
    },
    sort: function (sortBy) {
      this.sortBy = sortBy
      let classList = event.currentTarget.querySelector('i').classList
      let siblings = document.querySelectorAll('.table thead tr .material-icons').forEach(function(item) {
        item.classList.remove('up')
        item.classList.remove('down')
      })
      if (this.sortOrder == 'asc') {
        this.sortOrder = 'desc'
        classList.remove('up')
        classList.add('down')
      } else {
        this.sortOrder = 'asc'
        classList.remove('down')
        classList.add('up')
      }
    },
    toShowAll: function (event) {
      this.showAll = true
      event.currentTarget.classList.add('hide')
    }
  },
  computed: {
    computedList: function () {
      let vm = this
      let list = this.assets
      list = list.filter(function (item) {
        return list = item.announce.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
      if (this.sortBy) {
        list = _.orderBy(list, ['hasRank', this.sortBy], ['asc', this.sortOrder])
      } else {
        list = _.orderBy(list, ['hasRank', 'rank', 'NumReplies', 'DateTimeLastPost', 'announce'], ['asc', 'asc', 'desc', 'desc', 'asc'])
      }
      list = list.map((currElement, index) => {
        currElement['order'] = ++index
        return currElement
      })
      if (!this.showAll) {
        list = list.slice(0, this.showNumber)
      }
      return list
    }
  }
})