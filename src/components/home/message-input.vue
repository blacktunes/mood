<template>
<div>
  <transition name="inpit-slide-up">
    <div class="message-input-wrapper" v-show="inputShow" @touchmove.stop>
      <div class="mask" @click="bgClick"></div>
      <div class="mask2"></div>
      <span class="add-pic cubeic-picture" @click="addPic"></span>
      <span class="pic-number" v-show="picNumberShow">{{picFiles.length}}</span>
      <cube-textarea class="message-input"
                     v-model="value"
                     :indicator="indicator"
                     :maxlength="99999"
                     placeholder="这里可以写点什么"
                     ref="textarea"
                     @input="messageInput"></cube-textarea>
      <input class="slider"
             type="range"
             min="0"
             max="100"
             step="1"
             value="50"
             @input="change"
             @touchstart="inputTouch"
             @touchmove="inputMove"
             ref="slider">
      <span class="cubeic-like like-icon" @click="showTip"></span>
      <div class="icon-mask" ref="likeIcon">
        <span class="cubeic-like like-icon2" @click="showTip"></span>
      </div>
      <div class="icon-mask2" ref="likeIcon2">
        <span class="cubeic-like like-icon3" @click="showTip"></span>
      </div>
      <cube-tip :offsetLeft="37" ref="tip" direction="top" class="tip" >心情指数:{{numTween}}</cube-tip>
    </div>
  </transition>
  <div class="icon-add" v-if="inputShow">
    <i class="cubeic-right icon" @click="btnClick"></i>
  </div>
  <div class="pic-upload" v-show="isAddPic" @touchmove.stop>
    <cube-upload class="upload"
                 :max="9"
                 :auto="false"
                 :action="uploadAction"
                 :multiple="true"
                 ref="upload"
                 @files-added="filesAdded"
                 @file-error="fileError"
                 v-model="picFiles"></cube-upload>
    <cube-button class="upload-btn" :outline="true" :disabled="!appReady" @click="getCamera">Camera</cube-button>
    <cube-button class="upload-btn" :outline="true" @click="picUpload">Submit</cube-button>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import TWEEN from '@tweenjs/tween.js'
import { getUser, saveMessage, getMessage, delMessage } from '@/assets/js/localStorage'
import { mapState, mapMutations } from 'vuex'
import { addMessage, serverUrl } from '@/api/store'
import { colorArr } from '@/assets/js/color'

export default {
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
      picFiles: [],
      moodNum: 0,
      numTween: 0,
      uploadAction: {
        target: `${serverUrl}/picUpload`,
        fileName: 'pic',
        data: {
          username: getUser()
        },
        checkSuccess: (res) => {
          if (res.ERR_CODE === 0) {
            this.pic.push(res.filename)
            if (this.pic.length === this.picFiles.length) {
              if (this.uploadToast) {
                this.uploadToast.hide()
              }
              this._addMessage()
            }
            return true
          } else {
            this.uploadToast.hide()
            this.$createToast({
              txt: '未知错误',
              time: 2000,
              type: 'error'
            }, false).show()
            return false
          }
        }
      }
    }
  },
  computed: {
    ...mapState([
      'inputShow'
    ]),
    picNumberShow () {
      return this.picFiles.length > 0
    }
  },
  methods: {
    ...mapMutations({
      setInputShow: 'SET_INPUT_SHOW',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    messageInput () {
      saveMessage(this.value)
    },
    getCamera () {
      /* eslint-disable */
      if (this.appReady) {
        const camera = plus.camera.getCamera()
        camera.captureImage((filePath) => {
          plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
            let reader = null
            entry.file((file) => {
              reader = new plus.io.FileReader()
              reader.readAsDataURL(file)
              reader.onloadend = (e) => {
                let arr = e.target.result.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let suffix = mime.split('/')[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n)
                }
                const img = new File([u8arr], file.name, {
                  type: mime
                })
                this.$refs.upload.addFiles([img])
              }
            })
          })
        })
      }
      /* eslint-enable */
    },
    filesAdded (files) {
      // 上传文件校验
      // const file = files[0]
      // if (file.size > 500 * 1024) {
      //   file.ignore = true
      //   this.$createToast({
      //     type: 'warn',
      //     time: 1000,
      //     txt: 'You selected > 500k files'
      //   }).show()
      // }
      // file && this.$refs.upload.removeFile(file)
    },
    addPic () {
      this.isAddPic = true
    },
    picUpload () {
      this.isAddPic = false
    },
    fileError (file) {
      console.log(file)
      this.$refs.upload.pause()
      if (this.uploadToast) {
        this.uploadToast.hide()
      }
      this.$createToast({
        txt: '上传失败',
        time: 2000,
        type: 'error'
      }, false).show()
    },
    inputTouch () {
      this.$refs.likeIcon.style.transition = 'height 0.2s linear'
      this.$refs.likeIcon2.style.transition = 'height 0.2s linear'
      this.$refs.slider.style.transition = 'background 0.2s linear'
      this.$refs.textarea.$el.children[0].style.transition = 'border 0.2s linear'
    },
    inputMove () {
      this.$refs.likeIcon.style.transition = ''
      this.$refs.likeIcon2.style.transition = ''
      this.$refs.slider.style.transition = ' 0.2s linear'
      this.$refs.textarea.$el.children[0].style.transition = ''
    },
    showTip () {
      this.$refs.tip.show()
    },
    bgClick () {
      this.$refs.textarea.blur()
      setTimeout(() => {
        this.setInputShow(false)
        this.pic = []
        this.picFiles = []
        this.$refs.upload.pause()
        this.isAddPic = false
        if (this.uploadToast) {
          this.uploadToast.hide()
        }
      }, 50)
    },
    btnClick () {
      if (this.value.length < 1 && this.picFiles.length < 1) {
        return
      }
      if (this.picFiles.length > 0) {
        this.$refs.upload.start()
        this.isAddPic = true
        this.uploadToast = this.$createToast({
          txt: '正在上传图片···',
          time: 0,
          mask: true
        }, false)
        this.uploadToast.show()
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
        this.$refs.likeIcon.style.height = 24 * (mood - 50) / 50 + 'px'
        this.$refs.likeIcon2.style.height = ''
      } else if (mood < 50) {
        this.$refs.likeIcon2.style.height = 24 * mood / 50 + 'px'
        this.$refs.likeIcon.style.height = ''
      } else {
        this.$refs.likeIcon2.style.height = ''
        this.$refs.likeIcon.style.height = ''
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
    document.addEventListener('plusready', () => {
      this.appReady = true
    }, false)
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
      bottom 210px
      height calc(100% - 210px)
      width 100%
      z-index 450
    .mask2
      position absolute
      bottom 0
      height 210px
      width 100%
      border-radius 15px 15px 0 0
      background rgba(222,222,222,0.9)
    .add-pic
      position absolute
      left 25px
      bottom 180px
      z-index 500
      font-size 24px
      color #666
    .pic-number
      position absolute
      left 48px
      bottom 192px
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
      height 100px
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
    position absolute
    bottom 32px
    left 25px
    z-index 800
    font-size 24px
    color #000
  .icon-mask
    overflow hidden
    position absolute
    bottom 32px
    left 25px
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
    left 25px
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
    left 0px
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
