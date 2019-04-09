<template>
  <div class="message-wrapper">
    <div class="message-title">
      <div class="message-img"></div>
      <div class="message-info">
        <div class="message-name">
          <span>{{item.author}}</span>
        </div>
        <div class="message-time">
          <span>{{item.time}}</span>
        </div>
      </div>
    </div>
    <div class="message-item">
      <span class="message-text">{{item.text}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.message-wrapper
  width 100%
  margin 10px auto
  padding 10px 0
  background #fff
  .message-title
    display flex
    align-items center
    margin 10px
    .message-img
      flex 0 0 40px
      height 40px
      width 40px
      border 1px solid #999
      border-radius 50%
    .message-info
      flex 1
      margin-left 15px
      .message-name
        margin-bottom 5px
        font-size 16px
        font-weight bold
      .message-time
        margin-bottom 5px
        font-size 10px
        color #666
  .message-item
    width 95%
    margin 5px auto
    .message-text
      word-break break-all
      font-size 14px
</style>
