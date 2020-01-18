<template>
  <div class="message-wrapper" ref="message" @click="click">
    <div :class="titleCls">
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
    <div class="label" :style="labelColor"></div>
    <div :class="messageCls">
      <span :class="ellipsis" class="message-text" v-html="item.addressee ? '回复 @' + item.addressee + ': ' + item.text : item.text" ref="messageText"></span>
      <!-- <a class="message-text" v-if="isEllipsis">查看全文</a> -->
    </div>
    <div class="mseeage-pic-wrapper">
      <div :class="picCls" v-for="(pic, index) in item.pic" :key="index">
        <img :class="picCls2" v-lazy="pic + '?imageMogr2/thumbnail/x275/auto-orient'" @click="handleImgsClick(index, item.pic)" @click.stop>
        <long-pic class="long-pic" :pic="pic + '?imageMogr2/thumbnail/x275/auto-orient'"></long-pic>
      </div>
    </div>
    <div class="message-btn" v-if="showBtn && !isReply">
      <span class="cubeic-message reply-btn"></span>
      <span class="reply-text">{{item.reply || 0}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'
import { colorArr } from '@/assets/js/color'
import LongPic from './long-pic'

export default {
  components: {
    LongPic
  },
  data () {
    return {
      initialIndex: 0,
      textHeight: 0
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    isReply: {
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isDetail () {
      return this.$route.path === '/detail'
    },
    // isEllipsis () {
    //   if (this.textHeight > 64 && this.isIndex) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    ellipsis () {
      if (this.isIndex) {
        return 'ellipsis'
      } else {
        return ''
      }
    },
    labelColor () {
      return this.item.mood === 0 ? `border-color: transparent ${colorArr[0]} transparent transparent` : `border-color: transparent ${colorArr[this.item.mood]}`
    },
    titleCls () {
      return this.isReply ? 'reply-title' : 'message-title'
    },
    messageCls () {
      return this.isReply ? 'reply-item' : 'message-item'
    },
    picCls () {
      return this.isReply ? 'reply-pic' : this.item.pic.length === 1 ? 'message-pic1' : this.item.pic.length === 2 || this.item.pic.length === 4 ? 'message-pic2' : 'message-pic3'
    },
    picCls2 () {
      return this.item.pic.length === 1 ? 'pic1' : 'pic'
    }
  },
  methods: {
    ...mapMutations({
      setMessageDetail: 'SET_MESSAGE_DETAIL'
    }),
    handleImgsClick (index, pic) {
      this.initialIndex = index
      const params = {
        $props: {
          imgs: pic,
          initialIndex: 'initialIndex', // 响应式数据的key名
          loop: false,
          zIndex: 1000
        },
        $events: {
          change: (i) => {
            // 必须更新 initialIndex
            this.initialIndex = i
          }
        }
      }
      const imagePreview = this.$createImagePreview({ ...params })
      imagePreview.show()
      /* eslint-disable */
      plus.key.addEventListener('backbutton', (e) => {
        imagePreview.hide()
      }, true)
      /* eslint-enable */
    },
    click () {
      if (this.$route.path === '/detail') {
        return
      }
      this.setMessageDetail(this.item)
      setTimeout(() => {
        this.$router.push('/detail')
      }, 50)
    }
    // // 下面三个方法为touch事件
    // bgChange () {
    //   this.timer = setTimeout(() => {
    //     this.$refs.message.style.background = '#ccc'
    //   }, 50)
    // },
    // bgRestore () {
    //   setTimeout(() => {
    //     this.$refs.message.style.background = '#fff'
    //   }, 200)
    // },
    // touchMove () {
    //   if (this.timer) {
    //     clearTimeout(this.timer)
    //     this.timer = null
    //   }
    //   this.$refs.message.style.background = '#fff'
    // }
  }
  // mounted () {
  //   this.textHeight = this.$refs.messageText.scrollHeight
  // }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
title-class()
.message-img
  overflow hidden
  flex 0 0 40px
  height 40px
  width 40px
  border 1px solid #999
  border-radius 50%
  .img
    height 100%
.message-info
  flex 1
  margin-left 15px
  .message-name
    margin 3px 0 5px 0
    font-size 16px
    font-weight bold
  .message-time
    margin-bottom 5px
    font-size 10px
    color #666

.message-wrapper
  position relative
  width 100%
  margin 1px auto
  padding 5px 0 0 0
  background #fff
  transition background 0.2s linear
  .reply-title
    display flex
    align-items center
    margin 5px 10px
    title-class()
  .message-title
    display flex
    align-items center
    margin 10px
    title-class()
  .reply-item
    width calc(100% - 67px)
    margin -5px auto 10px 67px
    .message-text
      word-break break-all
      font-size 14px
  .message-item
    width 95%
    margin 5px auto 10px auto
    .message-text
      line-height 20px
      word-break normal
      font-size 14px
    .ellipsis
      overflow hidden
      display -webkit-box
      -webkit-line-clamp 8
      -webkit-box-orient vertical
      margin-bottom 8px
  .label
    position absolute
    top 0
    left 100%
    width 0
    height 0
    transform translate(-100%, 0)
    border-style: solid
    border-width: 0 30px 30px 0
    border-color: transparent
  .mseeage-pic-wrapper
    width 96%
    max-width 500px
    display flex
    flex-flow row wrap
    margin auto
    .message-pic3
      flex 0 0 33.33%
      height 120px
      overflow hidden
      position relative
      display flex
      align-items center
      background rgba(200, 200, 200, 0.3)
      .pic
        width 100%
        margin 1.5px
      .long-pic
        position absolute
        bottom 0
        right 1.5px
    .message-pic2
      flex 0 0 50%
      height 180px
      overflow hidden
      position relative
      display flex
      align-items center
      background rgba(200, 200, 200, 0.3)
      .pic
        width 100%
        margin 1.5px
      .long-pic
        position absolute
        bottom 0
        right 1.5px
    .message-pic1
      max-height 275px
      overflow hidden
      position relative
      .pic1
        width 100%
        max-width 375px
        margin auto
      .long-pic
        position absolute
        bottom 0
        right 0
    .reply-pic
      max-height 175px
      overflow hidden
      position relative
      margin 0 auto 5px 60px
      .pic1
        width 100%
        max-width 175px
        margin auto
      .long-pic
        position absolute
        bottom 0
        right 0
  .message-btn
    margin 10px auto 0 auto
    height 20px
    text-align right
    color #666
    .reply-btn
      font-size 13px
    .reply-text
      font-size 15px
      margin 0 5px
</style>
