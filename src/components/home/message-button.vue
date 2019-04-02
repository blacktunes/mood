<template>
  <div class="message-button">
    <div class="icon-add" @click="click" v-if="!inputShow">
      <i class="icon" :class="addCls"></i>
    </div>
    <transition name="fade">
      <div class="mood-button" v-if="inputShow">
        <div class="icon-sad" key="sad">
          <i class="cubeic-sad icon"></i>
        </div>
        <div class="icon-smile" key="smile">
          <i class="cubeic-smile icon"></i>
        </div>
      </div>
    </transition>
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

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .2s linear;
  }
</style>
