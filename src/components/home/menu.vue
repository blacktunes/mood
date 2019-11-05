<template>
  <transition name="menu">
    <div class="menu-wrapper" v-show="menuVisible" v-finger:swipe="swipeHandler">
      <transition name="menu-slide-right">
        <div class="menu" v-if="menuVisible">
          <div class="user-info">
            <div class="avatar">
              <cube-upload class="upload"
                           :action="uploadAction"
                           :simultaneous-uploads="1"
                           @files-added="filesAdded"
                           v-model="files"
                           ref="upload">
                <div class="clear-fix">
                  <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>
                  <cube-upload-btn :multiple="false">
                    <div>
                      <img class="upload-img" :src="avatar">
                    </div>
                  </cube-upload-btn>
                </div>
              </cube-upload>
            </div>
            <div class="username">{{username}}</div>
            <div class="login">
              <span>已连续登陆{{consecutiveLoginNum}}天</span>
            </div>
          </div>
          <div class="menu-list">
            <div class="menu-btn" @click="cleanMessage">
              <span class="cubeic-delete">清除消息缓存</span>
            </div>
          </div>
          <cube-button class="logoff-btn" icon="cubeic-close" :outline="true" :inline="true" @click="logOff">注销</cube-button>
        </div>
      </transition>
      <div class="mask" @click="menuShow"></div>
      <transition name="fade">
        <div class="mask2" v-if="menuVisible"></div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { getUser, delMessageList, delUser, getLoginInformation } from '@/assets/js/localStorage'
import { serverUrl } from '@/api/store'

export default {
  data () {
    return {
      menuVisible: false,
      username: '',
      consecutiveLoginNum: 0,
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
      if (file.size > 600 * 1024) {
        file.ignore = true
        this.$createToast({
          type: 'warn',
          time: 1000,
          txt: 'You selected > 600k files'
        }).show()
      }
      file && this.$refs.upload.removeFile(file)
    },
    swipeHandler (e) {
      if (e.direction === 'Left') {
        this.menuVisible = false
      }
    },
    menuShow () {
      this.menuVisible = !this.menuVisible
    },
    cleanMessage () {
      delMessageList()
      this.$router.go(0)
    },
    logOff () {
      delUser()
      this.$socket.disconnect()
      this.$router.push('/')
      this.$router.go(0)
    }
  },
  computed: {
    avatar () {
      if (this.username) {
        return 'https://www.feizhouxianyu.cn/mood/upload/' + this.username + '.png'
      } else {
        return ''
      }
    }
  },
  activated () {
    this.username = getUser()
    this.consecutiveLoginNum = getLoginInformation().consecutiveLoginNum
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .menu-wrapper
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    display flex
    .menu
      z-index 1000
      position relative
      flex 0 0 60%
      width 60%
      background #fff
      .logoff-btn
        position absolute
        bottom 10px
        left 50%
        transform translate(-50%, 0)
      .user-info
        padding 20px 0
        background #eee
        .avatar
          overflow hidden
          height 80px
          width 80px
          margin 0 auto 20px auto
          border 1px solid #999
          border-radius 50%
          .upload-img
            width 100%
        .username
          text-align center
        .login
          margin-top 8px
          font-size 12px
          text-align center
      .menu-list
        margin 2px
        text-align center
        .menu-btn
          font-size 14px
          color #000
          padding 15px 0
          width 100%
          position: relative;
          //隐藏溢出的径向渐变背景
          overflow: hidden;
          &:after
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            transform: scale(0, 0);
            opacity: .3;
            //设置初始状态
            transition: 0s;
          &:active:after
            pointer-events: none;
            //设置径向渐变
            background-image: radial-gradient(circle, #bbb 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            transition: transform .3s, opacity .5s;
    .mask
      z-index 1000
      flex 0 0 40%
      width 40%
    .mask2
      z-index 500
      position fixed
      width 100%
      height 100%
      background rgba(0, 0, 0, 0.3)

.menu-enter-active, .menu-leave-active
  transition all .2s linear
</style>
