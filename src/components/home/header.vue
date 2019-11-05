<template>
  <div class="header">
    <span class="user-name" @click="nameClick">{{userName}}</span>
    <span class="icon cubeic-more" @click="iconClick" v-show="iconShow"></span>
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
    },
    iconShow () {
      return this.$route.name === 'index' && this.isLogin
    }
  },
  methods: {
    iconClick () {
      this.$emit('icon-click')
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
    width 35px
    height 25px
    position fixed
    top 10px
    left 10px
    color #666
</style>
