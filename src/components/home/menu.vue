<template>
  <transition name="fade">
    <div class="menu-wrapper" v-show="menuVisible">
      <transition name="menu-slide-right">
        <div class="menu" v-if="menuVisible">
          <div class="user-info">
            <div class="avatar">
              <img class="img" :src="avatar">
            </div>
            <div class="username">{{username}}</div>
          </div>
          <div class="menu-list">
            <a class="menu-btn">
              <span class="cubeic-delete" @click="cleanMessage">清除消息缓存</span>
            </a>
          </div>
        </div>
      </transition>
      <div class="mask" @click="menuShow"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { getUser, delMessageList } from '@/assets/js/localStorage'

export default {
  data () {
    return {
      menuVisible: false,
      username: getUser()
    }
  },
  methods: {
    menuShow () {
      this.menuVisible = !this.menuVisible
    },
    cleanMessage () {
      delMessageList()
      this.$router.go(0)
    }
  },
  computed: {
    avatar () {
      return 'https://www.feizhouxianyu.cn/mood/upload/' + this.username + '.png'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .menu-wrapper
    position absolute
    left 0
    top 0
    z-index 1000
    width 100%
    height 100%
    display flex
    background rgba(0, 0, 0, 0.3)
    .menu
      flex 0 0 60%
      width 60%
      background #fff
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
          .img
            width 100%
        .username
          text-align center
      .menu-list
        margin 20px 0
        text-align center
        .menu-btn
          font-size 14px
          color #000
          &:active
           color #666
    .mask
      flex 0 0 40%
      width 40%
</style>
