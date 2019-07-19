<template>
  <transition name="btn-slier-up">
  <div class="message-button" v-if="!inputShow">
    <transition name="btn-scale">
      <div class="icon-add" @click="click" v-if="isHome">
        <i class="icon" :class="addCls"></i>
      </div>
    </transition>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isHome: true
    }
  },
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
    position absolute
    left calc(100vw - 70px)
    bottom 50px
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
