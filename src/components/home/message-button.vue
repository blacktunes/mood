<template>
  <div class="message-button">
    <div class="icon-add" @click="click" v-if="!inputShow">
      <i class="icon" :class="addCls"></i>
    </div>
    <input v-if="inputShow" class="slider" type="range" min="0" max="99" step="1" value="49" @input="change" ref="slider">
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'
import { colorArr } from '@/assets/js/color'
export default {
  computed: {
    ...mapState([
      'inputShow',
      'isLogin'
    ]),
    addCls () {
      return this.isLogin ? 'cubeic-add' : 'cubeic-warn'
    }
  },
  methods: {
    ...mapMutations({
      setInputShow: 'SET_INPUT_SHOW'
    }),
    click () {
      if (!this.inputShow) {
        if (this.isLogin) {
          this.setInputShow(true)
        } else {
          this.$router.push('/register')
        }
      }
    },
    change () {
      const width = this.$refs.slider.value
      this.$refs.slider.style.background = colorArr[width]
      console.log(colorArr[49])
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .icon-add
    z-index 500
    position fixed
    right 20px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .icon-sad
    z-index 500
    position fixed
    right 70px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .icon-smile
    z-index 500
    position fixed
    right 120px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .slider
    position absolute
    bottom 42px
    left 25px
    z-index 1000
    background #ecf0f1
  input[type=range]
    // 去除浏览器默认的样式
    -webkit-appearance: none
    -moz-appearance: none
    width: 70%
    border-radius: 10px
    &:focus
      // 去除落焦时的外边框效果
      outline: none
  input[type=range]::-webkit-slider-runnable-track
    height: 5px
    border: 1px solid #ddd
    border-radius: 8px /*将轨道设为圆角的*/
  input[type=range]::-webkit-slider-thumb
    -webkit-appearance: none
    -moz-appearance: none
    width: 14px
    height: 14px
    border-radius: 50%
    position: relative
    top: -5px
    background: #666
</style>
