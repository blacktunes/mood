<template>
  <div class="message-button">
    <div class="icon-add" @click="click" v-if="!inputShow">
      <i class="icon" :class="addCls"></i>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState([
      'inputShow',
      'isLogin'
    ]),
    addCls () {
      return this.isLogin ? 'cubeic-add' : 'cubeic-warn'
    }
  },
  methods: {
    ...mapMutations({
      setInputShow: 'SET_INPUT_SHOW'
    }),
    click () {
      if (!this.inputShow) {
        if (this.isLogin) {
          this.setInputShow(true)
        } else {
          this.$router.push('/register')
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .icon-add
    z-index 500
    position fixed
    right 20px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .icon-sad
    z-index 500
    position fixed
    right 70px
    bottom 20px
    .icon
      font-size 50px
      color #666
  .icon-smile
    z-index 500
    position fixed
    right 120px
    bottom 20px
    .icon
      font-size 50px
      color #666
</style>
