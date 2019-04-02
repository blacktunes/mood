<template>
  <div class="header">
    <span class="user-name">{{userName}}</span>
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header
  display flex
  height 20px
  padding 10px 0 10px 0
  margin-bottom 5px
  text-align center
  background #fff
  .user-name
    margin auto
    font-size 20px
</style>
