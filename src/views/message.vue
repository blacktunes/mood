<template>
  <div class="message-wrapper">
    <cube-scroll>
    <div v-for="item in userReplyList" :key="item.id">
      <div class="message">
        <div class="message-title">
          <div class="message-img">
            <img class="img" :src="item.img">
          </div>
          <div class="message-info">
            <div class="message-name">
              <span style="font-weight:500">{{item.author}}</span>
            </div>
            <div class="message-time">
              <span>{{item.time}}</span>
            </div>
          </div>
        </div>
        <div class="message-item">
          <span class="message-text" v-html="item.text"></span>
        </div>
        <div class="source-wrapper">
          <div class="source-item">
            <div class="source-img">
              <img class="img" :src="item.source.pic || item.source.img">
            </div>
            <div class="source-info">
              <div class="source-name">
                <span style="font-weight:500">@{{item.source.author}}</span>
              </div>
              <div class="source-text">
                <span v-html="item.source.text.length > 1 ? item.source.text : '[图片]'"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </cube-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUserReply } from '@/api/store'
import { getUser } from '@/assets/js/localStorage'

export default {
  data () {
    return {
      userReplyList: [],
      haveNewReply: false
    }
  },
  methods: {
    _getUserReply () {
      getUserReply(getUser()).then((res) => {
        this.userReplyList = res.data.userReplyList.reverse()
        this.haveNewReply = this.userReplyList.some(item => {
          return item.haveRead === 0
        })
      })
    }
  },
  created () {
    this._getUserReply()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.message-wrapper
  height calc(100vh - 70px)
  .message
    width 100%
    margin 1px auto
    padding 2px 0 2px 0
    background #fff
    .message-title
      display flex
      align-items center
      margin 10px
      .message-img
        overflow hidden
        flex 0 0 30px
        height 30px
        width 30px
        border 1px solid #999
        border-radius 50%
        .img
          height 100%
      .message-info
        flex 1
        margin-left 10px
        .message-name
          margin 4px 0 5px 0
          font-size 14px
          font-weight bold
        .message-time
          margin-bottom 5px
          font-size 10px
          color #666
    .message-item
      width 95%
      margin 5px auto 10px auto
      .message-text
        word-break break-all
        font-size 14px
    .source-wrapper
      margin 5px
      .source-item
        display flex
        width 100%
        height 70px
        background #ddd
        .source-img
          overflow hidden
          flex 0 0 70px
          width 70px
          height 70px
          background #bbb
          .img
            height 100%
        .source-info
          margin 7px 5px 5px 10px
          .source-name
            font-size 13px
            margin-bottom 5px
          .source-text
            font-size 12px
            color #555
</style>
