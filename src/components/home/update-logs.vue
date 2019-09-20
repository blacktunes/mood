<template>
  <div class="logs-wrapper" v-show="logShow">
    <div class="logs" ref="logs">
      <div class="title">
        <span>2019.9.20</span>
      </div>
      <div class="text">
        <p>优化图片上传功能</p>
        <p>添加回复图片上传功能</p>
        <p>修复部分显示异常</p>
      </div>
      <div class="btn">
        <a @click.prevent="logClose">我知道了</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveShowLog, getShowLog } from '@/assets/js/localStorage'

export default {
  data () {
    return {
      logShow: false
    }
  },
  methods: {
    logClose () {
      this.$refs.logs.style['marginTop'] = `-${this.$refs.logs.offsetHeight}px`
      setTimeout(() => {
        this.logShow = false
        saveShowLog(false)
      }, 200)
    }
  },
  created () {
    this.logShow = getShowLog()
    saveShowLog(false)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.logs-wrapper
  position relative
  width 100%
  margin 1px auto
  background #fff
  .logs
    transition margin 0.2s linear
    padding 10px
    .title
      font-size 15px
    .text
      margin 5px 0 15px 0
      font-size 13px
    .btn
      font-size 13px
</style>
