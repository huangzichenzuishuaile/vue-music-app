<template>
  <div class="singer" ref="singer">
    <list-view @selectSinger="selectSinger" :data="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import ListView from 'base/listview/listview'
import {getSingerList} from 'api/singer'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex'

const HOT_SINGER_LEN = '9'
const HOT_NAME = '热门'

export default {
  data(){
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({path: `/singer/${singer.id}`})
      this.setSinger(singer)
    },
    _getSingerList(){
      getSingerList().then(res=>{
        this.singerList = this.formatData(res.data.list)
      })
    },
    formatData(list) {
      let map = {}
      list.forEach(item => {
        map[item.Findex] = map[item.Findex] || []
        map[item.Findex].push(new Singer({id: item.Fsinger_mid,name: item.Fsinger_name}))
      });

      let hot = []
      let ret = []
      for(let key in map){
        if(key.match(/[a-zA-Z]/)){
          ret.push({title: key,items:map[key]})
        }else if(key === HOT_SINGER_LEN){
          hot.push({title: HOT_NAME,items:map[key]})
        }
      }
      ret = ret.sort((a, b) => a.title.charCodeAt() - b.title.charCodeAt())
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components:{
    ListView
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
