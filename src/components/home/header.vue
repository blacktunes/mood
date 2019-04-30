<template>
  <div class="header">
    <span class="user-name" @click="nameClick">{{userName}}</span>
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
  z-index 200
  display flex
  height 40px
  text-align center
  background #fff
  box-shadow 0px 1px 1px #bbb
  .user-name
    margin auto
    font-size 20px
</style>
