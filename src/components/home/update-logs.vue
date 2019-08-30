<template>
  <div class="logs-wrapper" v-show="logShow">
    <div class="logs" ref="logs">
      <div class="title">
        <span>2019.8.30</span>
      </div>
      <div class="text">
        <p>更新各种异常提醒</p>
        <p>修改输入框部分设置</p>
        <p>首页增加折叠显示</p>
      </div>
      <div class="btn">
        <a @click.prevent="logClose">我知道了</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { setSecondStart, isSecondStart } from '@/assets/js/localStorage'

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
        setSecondStart(true)
      }, 200)
    }
  },
  created () {
    this.logShow = !isSecondStart()
    setSecondStart(true)
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
