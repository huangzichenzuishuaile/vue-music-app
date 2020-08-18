<template>
  <scroll
    @scroll="scroll"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    ref="listview"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        :key="index"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="item in group.items"
            :key="item.Fsinger_mid"
            class="list-group-item"
            @click="selectSinger(item)"
          >
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{ current: currentIndex == index }"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading/>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },
    created() {
      this.probeType = 3
      this.touch = {}
      this.listenScroll = true
    },
    computed: {
      shortcutList() {
        return this.data.map(group => group.title.substr(0, 1))
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = this.listHeight.length - 2
      }
    },
    methods: {
      selectSinger(item) {
        console.log(item)
        this.$emit('selectSinger', item)
      },
      onShortcutTouchStart(e) {
        if (!getData(e.target, 'index')) {
          return
        }
        let anchorIndex = getData(e.target, 'index')
        this.currentIndex = anchorIndex
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scroll(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this.currentIndex = anchorIndex < 0 ? 0 : anchorIndex > this.shortcutList.length - 1 ? this.shortcutList.length - 1 : anchorIndex
        this._scroll(this.currentIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scroll(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background

    .list-group
      padding-bottom: 30px

      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background

      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px

        .avatar
          width: 50px
          height: 50px
          border-radius: 50%

        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium

    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica

      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small

        &.current
          color: $color-theme

    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%

      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background

    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
