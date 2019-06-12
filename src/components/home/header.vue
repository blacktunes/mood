<template>
  <div class="header">
    <span class="user-name" @click="nameClick">{{userName}}</span>
    <span class="icon cubeic-more" @click="iconClick"></span>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/assets/js/localStorage'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'isLogin'
    ]),
    userName () {
      return this.isLogin ? getUser() : 'mood'
    }
  },
  methods: {
    iconClick () {
      if (this.isLogin) {
        this.$emit('icon-click')
      }
    },
    nameClick () {
      if (this.isLogin) {
        this.$router.push('/userInfo')
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header
  position relative
  z-index 300
  display flex
  height 40px
  text-align center
  background #fff
  box-shadow 0px 1px 1px #bbb
  .user-name
    margin auto
    font-size 20px
  .icon
    position fixed
    top 10px
    left 5px
    color #666
</style>
