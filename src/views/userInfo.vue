<template>
  <div class="register-wrapper">
    <div class="upload-wrapper">
      <cube-upload
      class="upload"
      :action="uploadAction"
      :simultaneous-uploads="1"
      @files-added="filesAdded"
      v-model="files"
      ref="upload">
        <div class="clear-fix">
          <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>
          <cube-upload-btn :multiple="false">
            <div>
              <i>＋</i>
            </div>
          </cube-upload-btn>
        </div>
      </cube-upload>
    </div>
    <div class="register-input">
      <span class="text">修改昵称</span>
      <input class="input" v-model="userName">
      <i class="cubeic-pullup icon" @click="click"></i>
    </div>
    <cube-button class="button" icon="cubeic-close" :outline="true" :inline="true" @click="logOff">注销</cube-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveUser, getUser, delUser } from '@/assets/js/localStorage'
import { reviseUsername, serverUrl } from '@/api/store'
export default {
  data () {
    return {
      userName: '',
      uploadAction: {
        target: `${serverUrl}/upload`,
        fileName: 'avatar',
        data: {
          username: getUser()
        }
      },
      files: []
    }
  },
  methods: {
    filesAdded (files) {
      const file = files[0]
      if (file.size > 500 * 1024) {
        file.ignore = true
        this.$createToast({
          type: 'warn',
          time: 1000,
          txt: 'You selected > 500k files'
        }).show()
      }
      file && this.$refs.upload.removeFile(file)
    },
    click () {
      if (this.userName === getUser()) {
        return
      }
      if (this.userName) {
        const toast3 = this.$createToast({
          txt: '正在提交',
          mask: true,
          time: 0
        })
        toast3.show()
        this.timer = setTimeout(() => {
          const toast1 = this.$createToast({
            txt: '请求超时',
            time: 2000,
            type: 'error'
          })
          toast1.show()
        }, 1000 * 15)
        reviseUsername(this.userName, getUser()).then((res) => {
          toast3.hide()
          if (this.timer) {
            clearTimeout(this.timer)
          }
          if (res.data.ERR_CODE === 1) {
            const toast2 = this.$createToast({
              txt: '用户名已存在',
              time: 1500,
              type: 'error'
            })
            toast2.show()
            return
          }
          saveUser(this.userName)
          this.$router.push('/')
        })
      } else {
        this.$router.go(-1)
      }
    },
    logOff () {
      delUser()
      this.$socket.disconnect()
      this.$router.push('/')
      this.$router.go(0)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.register-wrapper
  height 100vh
  width 100%
  display flex
  flex-direction column
  align-items center
  .register-input
    flex 1
    display flex
    align-items center
    flex-direction column
    margin auto
    .text
      margin-bottom 10px
    .input
      text-align center
      height 30px
      border-radius 5px
      color #666
      font-size 15px
    .icon
      margin-top 5px
      font-size 30px
  .button
    position absolute
    bottom 20px
    left 50%
    transform translate(-50%, 0)

  .upload-wrapper
    flex 0 0 30%
    .upload
      overflow hidden
      width 100px
      height 100px
      margin-top 100%
      border 1px solid black
      border-radius 50%
    & >>> .cube-upload
      .cube-upload-file, .cube-upload-btn
        margin: 0
        height: 100px
      .cube-upload-file
        margin: 0
        + .cube-upload-btn
          margin-top: -100px
          opacity: 0
      .cube-upload-file-def
        width: 100%
        height: 100%
        .cubeic-wrong
          display: none
      .cube-upload-btn
        display: flex
        align-items: center
        justify-content: center
        > div
          text-align: center
        i
          display: inline-flex
          align-items: center
          justify-content: center
          width: 50px
          height: 50px
          font-size: 32px
          line-height: 1
          font-style: normal
          color: #333
          border-radius: 50%
</style>
