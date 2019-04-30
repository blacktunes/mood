<template>
<div>
  <transition name="fade">
    <div class="message-input-wrapper" v-if="inputShow">
      <div class="mask" @click="bgClick"></div>
      <div class="mask2"></div>
      <cube-textarea class="message-input" v-model="value" indicator="indicator" ref="textarea"></cube-textarea>
      <input class="slider" type="range" min="0" max="100" step="1" value="50" @input="change" ref="slider">
      <span class="cubeic-like like-icon" @click="showTip"></span>
      <div class="icon-mask" ref="likeIcon">
        <span class="cubeic-like like-icon2" @click="showTip"></span>
      </div>
      <cube-tip :offsetLeft="37" ref="tip" direction="top" class="tip" >心情指数:{{moodNum}}</cube-tip>
    </div>
  </transition>
  <div class="icon-add" v-if="inputShow">
    <i class="cubeic-right icon" @click="btnClick"></i>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/assets/js/localStorage'
import { mapState, mapMutations } from 'vuex'
import { addMessageList } from '@/api/store'
import { colorArr } from '@/assets/js/color'

export default {
  data () {
    return {
      show: false,
      indicator: {
        negative: true,
        remain: true
      },
      value: '',
      moodNum: 0
    }
  },
  computed: {
    ...mapState([
      'inputShow'
    ])
  },
  methods: {
    ...mapMutations({
      setInputShow: 'SET_INPUT_SHOW',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    showTip () {
      this.$refs.tip.show()
    },
    bgClick () {
      this.setInputShow(false)
      this.value = ''
      this.moodNum = 0
      this.$refs.textarea.$el.children[0].style.border = ''
    },
    btnClick () {
      if (this.value.length < 1) {
        return
      }
      addMessageList({
        author: getUser(),
        text: this.value,
        time: new Date().toLocaleString(),
        mood: this.$refs.slider.value
      }).then((res) => {
        if (res.status === 200) {
          this.$emit('success')
        }
      })
      this.bgClick()
    },
    change () {
      this.showTip()
      const mood = this.$refs.slider.value
      this.moodNum = mood - 50
      this.$refs.slider.style.background = colorArr[mood]
      this.$refs.textarea.$el.children[0].style.border = `1.5px solid ${colorArr[mood]}`
      if (mood > 50) {
        this.$refs.likeIcon.style.height = 24 * (mood - 50) / 50 + 'px'
      } else {
        this.$refs.likeIcon.style.height = ''
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .message-input-wrapper
    z-index 400
    position absolute
    bottom 0
    height 100%
    width 100%
    .mask
      position absolute
      bottom 190px
      height calc(100% - 190px)
      width 100%
      z-index 450
    .mask2
      position absolute
      bottom 0
      height 190px
      width 100%
      background rgba(222,222,222,0.9)
    .message-input
      position fixed
      left 0
      right 0
      margin auto
      bottom 75px
      width 90%
      height 100px
      box-shadow 0 0 1px 2px #ddd
  .icon-add
    z-index 500
    position fixed
    right 20px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .slider
    position absolute
    bottom 42px
    left 55px
    z-index 1000
    background #fff
  input[type=range]
    // 去除浏览器默认的样式
    -webkit-appearance: none
    -moz-appearance: none
    width: calc(100% - 135px)
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
  .like-icon
    position fixed
    bottom 32px
    left 25px
    z-index 1000
    font-size 24px
    color #fff
  .icon-mask
    overflow hidden
    position fixed
    bottom 32px
    left 25px
    z-index 1000
    width 24px
    .like-icon2
      z-index 500
      position absolute
      bottom 0
      left 0
      font-size 24px
      color #666
  .tip
    position fixed
    bottom 4px
    left 0px
    font-size 11px
    padding 3px 8px
    & >>> .cube-tip-close
      display none
</style>
