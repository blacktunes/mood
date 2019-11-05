<template>
  <div class="logs-wrapper" v-show="logShow">
    <div class="logs" ref="logs">
      <div class="title">
        <span>2019.11.6</span>
      </div>
      <div class="text">
        <p>图片上传/浏览迁移至对象存储，大大减少上传/加载时间</p>
        <p>(图片加载失败请清除一次数据缓存)</p>
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
