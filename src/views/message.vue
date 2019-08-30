<template>
  <div class="message-wrapper">
    <cube-scroll>
    <transition-group name="fade">
      <div v-for="item in userReplyList" :key="item.id">
        <div class="message" @click.stop="messageClick(item)">
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
          <div class="reply-item" v-show="item.addressee">
            <span class="message-text" v-html="item.addressee ? '回复 @' + item.addressee + ': ' + item.addresseeText : item.addresseeText"></span>
          </div>
          <div class="source-wrapper">
            <div class="source-item">
              <div class="source-img">
                <img class="img" :src="item.source.pic ? item.source.pic[0].split('.' + item.source.pic[0].split('.').pop())[0] + '-less.jpg' : item.source.img">
              </div>
              <div class="source-info">
                <div class="source-name">
                  <span style="font-weight:500">@{{item.source.author}}</span>
                </div>
                <div class="source-text">
                  <span v-html="item.source.text.length > 0 ? item.source.text : '[图片]'"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    <div class="loading" v-show="loadingShow">
      <cube-loading></cube-loading>
    </div>
    </cube-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUserReply, readReply } from '@/api/store'
import { getUser } from '@/assets/js/localStorage'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      userReplyList: [],
      haveNewReply: false
    }
  },
  computed: {
    ...mapState([
      'isLogin'
    ]),
    loadingShow () {
      if (this.userReplyList.length < 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      setMessageDetail: 'SET_MESSAGE_DETAIL'
    }),
    messageClick (item) {
      this.setMessageDetail(item.source)
      this.$router.push({
        path: '/detail',
        query: {
          author: item.author,
          text: item.text
        }
      })
    },
    _getUserReply (param) {
      if (!this.isLogin) {
        return
      }
      getUserReply(getUser()).then((res) => {
        this.userReplyList = res.data.userReplyList.reverse()
        if (param === 'slideChange' && this.haveNewReply) {
          readReply(getUser())
        } else {
          this.haveNewReply = this.userReplyList.some(item => {
            return (item.authorRead === 0 && item.source.author === getUser()) || (item.addresseeRead === 0 && item.addressee === getUser())
          })
          if (this.haveNewReply) {
            this.$emit('new-reply', this.haveNewReply)
          }
        }
      })
    },
    _readReply () {
      if (this.haveNewReply) {
        readReply(getUser())
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.message-wrapper
  height calc(100vh - 70px)
  .loading
    width 24px
    position relative
    left 50%
    transform translate(-50%, 0)
    margin-top 30px
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
      margin 5px
      padding-left 5px
      .message-text
        word-break break-all
        font-size 14px
    .reply-item
      margin 5px
      padding 5px
      background #eee
      .message-text
        word-break break-all
        font-size 14px
    .source-wrapper
      margin 0 5px 5px 5px
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
            width 100%
        .source-info
          margin 7px 5px 5px 10px
          .source-name
            font-size 13px
            margin-bottom 5px
          .source-text
            font-size 12px
            color #555
</style>
