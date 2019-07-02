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
      <span class="message-text" v-html="item.addressee ? '回复 @' + item.addressee + ': ' + item.text : item.text"></span>
    </div>
    <div class="mseeage-pic-wrapper">
      <div :class="picCls" v-for="(pic, index) in item.pic" :key="index">
        <img :class="picCls2" :src="pic.split('.' + pic.split('.').pop())[0] + '-less.jpg'" @load="loadImage" :data-large="pic" v-gallery="item.id" @click.stop v-img-lazy-load>
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

export default {
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
    }
  },
  computed: {
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
      return this.item.pic.length === 1 ? '' : this.item.pic.length === 2 || this.item.pic.length === 4 ? 'message-pic2' : 'message-pic3'
    },
    picCls2 () {
      return this.item.pic.length === 1 ? 'pic1' : 'pic'
    }
  },
  methods: {
    ...mapMutations({
      setMessageDetail: 'SET_MESSAGE_DETAIL'
    }),
    click () {
      if (this.$route.path === '/detail') {
        return
      }
      this.setMessageDetail(this.item)
      this.$router.push('/detail')
    },
    loadImage () {
      this.$emit('load-image')
    },
    // 下面三个方法为touch事件
    bgChange () {
      this.timer = setTimeout(() => {
        this.$refs.message.style.background = '#ccc'
      }, 50)
    },
    bgRestore () {
      setTimeout(() => {
        this.$refs.message.style.background = '#fff'
      }, 200)
    },
    touchMove () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.$refs.message.style.background = '#fff'
    }
  }
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
    width 95%
    margin -5px auto 10px 67px
    .message-text
      word-break break-all
      font-size 14px
  .message-item
    width 95%
    margin 5px auto 10px auto
    .message-text
      word-break break-all
      font-size 14px
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
      .pic
        width 100%
        margin 1.5px auto
    .message-pic2
      flex 0 0 50%
      .pic
        width 100%
        margin 1.5px auto
    .pic1
      width 100%
      max-width 375px
      margin auto
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
