<template>
  <div class="pic-upload" @touchmove.stop>
    <cube-upload class="upload"
                 :max="maxUpload"
                 :auto="false"
                 :action="uploadAction"
                 :multiple="true"
                 ref="upload"
                 @files-added="filesAdded"
                 @file-error="fileError"
                 v-model="picFiles"></cube-upload>
    <cube-button class="upload-btn" :outline="true" :disabled="!appReady" @click="getCamera">Camera</cube-button>
    <cube-button class="upload-btn" :outline="true" @click="submitClick">Submit</cube-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/assets/js/localStorage'
import { serverUrl } from '@/api/store'

export default {
  props: {
    maxUpload: {
      type: Number,
      default: 9
    }
  },
  data () {
    return {
      appReady: false,
      picFiles: [],
      uploadAction: {
        target: `${serverUrl}/picUpload`,
        fileName: 'pic',
        data: {
          username: getUser()
        },
        checkSuccess: (res) => {
          if (res.ERR_CODE === 0) {
            this.$emit('success', res.filename)
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
  methods: {
    addPic () {
      this.$refs.upload.$children[0].$el.childNodes[2].click()
    },
    delPic () {
      this.$refs.upload.$children[1].$el.childNodes[0].childNodes[0].click()
    },
    toastHide () {
      this.uploadToast.hide()
    },
    start () {
      this.$refs.upload.start()
      this.uploadToast = this.$createToast({
        txt: '正在上传图片···',
        time: 0,
        mask: true
      }, false)
      this.uploadToast.show()
    },
    pause () {
      this.$refs.upload.pause()
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
    submitClick () {
      this.$emit('submit')
    }
  },
  watch: {
    picFiles () {
      this.$emit('pic-num', this.picFiles.length)
    }
  },
  created () {
    document.addEventListener('plusready', () => {
      this.appReady = true
    }, false)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
