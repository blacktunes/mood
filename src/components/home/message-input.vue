<template>
<div>
  <transition name="inpit-slide-up">
    <div class="message-input-wrapper" v-show="inputShow" @touchmove.stop>
      <div class="mask" @click="bgClick"></div>
      <div class="mask2"></div>
      <span class="add-pic cubeic-picture" @click="addPic"></span>
      <span class="pic-number" v-show="picNum !== 0">{{picNum}}</span>
      <cube-textarea class="message-input"
                     v-model="value"
                     :indicator="indicator"
                     :maxlength="99999"
                     placeholder="这里可以写点什么"
                     ref="textarea"
                     @input="messageInput"
                     @click.prevent></cube-textarea>
      <transition name="fade">
        <input class="slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value="50"
              @input="change"
              @touchstart="inputTouch"
              @touchmove="inputMove"
              ref="slider"
              v-show="moodShow">
      </transition>
      <span class="cubeic-like like-icon" ref="likeIcon" @click="showMood"></span>
      <div class="icon-mask" ref="likeMask2">
        <span class="cubeic-like like-icon2" ref="likeIcon2" @click="showMood"></span>
      </div>
      <div class="icon-mask2" ref="likeMask3">
        <span class="cubeic-like like-icon3" @click="showMood"></span>
      </div>
      <cube-tip :offsetLeft="37" ref="tip" direction="top" class="tip" @click="showMood">心情指数:{{numTween}}</cube-tip>
    </div>
  </transition>
  <div class="icon-add" v-if="inputShow">
    <i class="cubeic-right icon" @click="btnClick"></i>
  </div>
  <upload v-show="isAddPic"
          @submit="submit"
          @pic-num="picChange"
          @success="uploadSuccess"
          ref="upload"></upload>
</div>
</template>

<script type="text/ecmascript-6">
import TWEEN from '@tweenjs/tween.js'
import { getUser, saveMessage, getMessage, delMessage } from '@/assets/js/localStorage'
import { mapState, mapMutations } from 'vuex'
import { addMessage } from '@/api/store'
import { colorArr } from '@/assets/js/color'
import Upload from './upload'

export default {
  components: {
    Upload
  },
  data () {
    return {
      appReady: false,
      show: false,
      isAddPic: false,
      indicator: {
        negative: true,
        remain: false
      },
      value: '',
      pic: [],
      picNum: 0,
      moodNum: 0,
      numTween: 0,
      moodShow: false
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
    messageInput () {
      saveMessage(this.value)
    },
    uploadSuccess (filename) {
      this.pic.push(filename)
      if (this.pic.length === this.picNum) {
        this.$refs.upload.toastHide()
        this._addMessage()
      }
    },
    picChange (num) {
      this.picNum = num
    },
    addPic () {
      this.isAddPic = true
    },
    submit () {
      this.isAddPic = false
    },
    inputTouch () {
      this.$refs.likeMask2.style.transition = 'height 0.2s linear'
      this.$refs.likeMask3.style.transition = 'height 0.2s linear'
      this.$refs.slider.style.transition = 'background 0.2s linear'
      this.$refs.textarea.$el.children[0].style.transition = 'border 0.2s linear'
    },
    inputMove () {
      this.$refs.likeMask2.style.transition = ''
      this.$refs.likeMask3.style.transition = ''
      this.$refs.slider.style.transition = ' 0.2s linear'
      this.$refs.textarea.$el.children[0].style.transition = ''
    },
    showTip () {
      this.$refs.tip.show()
    },
    showMood () {
      this.moodShow = !this.moodShow
      if (this.moodShow) {
        this.$refs.tip.show()
      } else {
        this.$refs.tip.hide()
      }
    },
    bgClick () {
      this.$refs.textarea.blur()
      setTimeout(() => {
        this.setInputShow(false)
        this.pic = []
        this.$refs.upload.picFiles = []
        this.$refs.upload.pause()
        this.isAddPic = false
        if (this.uploadToast) {
          this.uploadToast.hide()
        }
      }, 50)
    },
    btnClick () {
      if (this.value.length < 1 && this.picNum < 1) {
        return
      }
      if (this.picNum > 0) {
        this.$refs.upload.start()
        this.isAddPic = true
      } else {
        this._addMessage()
      }
    },
    change () {
      this.showTip()
      const mood = this.$refs.slider.value
      this.moodNum = mood - 50
      this.$refs.slider.style.background = colorArr[mood]
      this.$refs.textarea.$el.children[0].style.border = `1.5px solid ${colorArr[mood]}`
      if (mood > 50) {
        this.$refs.likeMask2.style.height = 24 * (mood - 50) / 50 + 'px'
        this.$refs.likeMask3.style.height = ''
        this.$refs.likeIcon2.style.color = colorArr[mood]
      } else if (mood < 50) {
        this.$refs.likeMask3.style.height = 24 * mood / 50 + 'px'
        this.$refs.likeMask2.style.height = ''
        this.$refs.likeIcon.style.color = colorArr[mood]
      } else {
        this.$refs.likeMask3.style.height = ''
        this.$refs.likeMask2.style.height = ''
      }
    },
    _addMessage () {
      const errToast = this.$createToast({
        txt: '发送失败',
        time: 2000,
        type: 'error'
      }, false)
      const toast = this.$createToast({
        txt: '正在发送...',
        mask: true,
        time: 0
      }, false)
      toast.show()
      addMessage({
        author: getUser(),
        text: this.value.replace(/\n|\r\n/g, '<br/>'),
        mood: this.$refs.slider.value,
        pic: this.pic.join('|')
      }).then((res) => {
        if (res.data.ERR_CODE === 0) {
          this.$emit('success')
          this.bgClick()
          this.value = ''
          this.moodNum = 0
          this.$refs.textarea.$el.children[0].style.border = ''
          delMessage()
          toast.hide()
        } else {
          toast.hide()
          errToast.show()
        }
      })
        .catch((e) => {
          console.log(e)
          toast.hide()
          errToast.show()
        })
    }
  },
  watch: {
    moodNum (newNum, oldNum) {
      new TWEEN.Tween({
        number: oldNum
      })
        .to({
          number: newNum
        }, 300)
        .onUpdate(tween => {
          this.numTween = tween.number.toFixed(0)
        })
        .start()
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  },
  created () {
    if (getMessage()) {
      this.value = getMessage()
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
    width 100vw
    .mask
      position absolute
      bottom 90%
      height 10%
      width 100%
      z-index 450
    .mask2
      position absolute
      bottom 0
      height 90%
      width 100%
      border-radius 15px 15px 0 0
      background rgba(222,222,222,0.9)
    .add-pic
      position absolute
      left 25px
      bottom 32px
      z-index 500
      font-size 24px
      color #666
    .pic-number
      position absolute
      left 47px
      bottom 46px
      z-index 500
      width 15px
      height 15px
      border-radius 50%
      background #666
      color #eeeeee
      font-size 10px
      line-height 16px
      text-align center
    .message-input
      position absolute
      left 0
      right 0
      margin auto
      bottom 75px
      width 90%
      min-height 300px
      height calc(90% - 85px)
      box-shadow 0 0 1px 2px #ddd
      & >>> .cube-textarea
        border 1.5px solid transparent
        border-radius 5px
  .icon-add
    z-index 500
    position absolute
    left calc(100vw - 70px)
    bottom 20px
    .icon
      font-size 50px
      color #666
  .slider
    position absolute
    bottom 42px
    left 100px
    z-index 1000
    background #fff
  input[type=range]
    // 去除浏览器默认的样式
    -webkit-appearance: none
    -moz-appearance: none
    width: calc(100% - 180px)
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
    position absolute
    bottom 32px
    left 70px
    z-index 800
    font-size 24px
    color #000
  .icon-mask
    overflow hidden
    position absolute
    bottom 32px
    left 70px
    z-index 1000
    height 0
    width 24px
    .like-icon2
      z-index 500
      position absolute
      bottom 0
      left 0
      font-size 24px
      color #666
  .icon-mask2
    overflow hidden
    position absolute
    bottom 32px
    left 70px
    z-index 900
    height 24px
    width 24px
    .like-icon3
      z-index 500
      position absolute
      bottom 0
      left 0
      font-size 24px
      color #fff
  .tip
    position absolute
    bottom 4px
    left 45px
    font-size 11px
    padding 3px 8px
    & >>> .cube-tip-close
      display none
  .pic-upload
    position absolute
    left 0
    top 0
    width 100vw
    height 100%
    background #ddd
    z-index 600
    .upload
      margin 20px 2px 20px 10px
    & >>> .cube-upload-def
      display flex
      flex-flow row wrap
      margin 0
    & >>> .cube-upload-btn
      flex 0 0 33.33%
      width 30vw
      margin 5px 0
    & >>> .cube-upload-btn-def
      width 30vw
      height 30vw
    & >>> .cube-upload-file
      flex 0 0 33.33%
      width 30vw
      margin 5px 0
    & >>> .cube-upload-file-def
      width 30vw
      height 30vw
  .upload-btn
    width 95%
    margin 10px auto
</style>
