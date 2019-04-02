<template>
<div>
  <transition name="slide-up">
    <div class="message-input-wrapper" v-show="inputShow">
      <div class="mask" @click="bgClick"></div>
      <cube-textarea class="message-input" v-model="value" indicator="indicator"></cube-textarea>
    </div>
  </transition>
  <div class="icon-add" v-if="inputShow">
    <i class="cubeic-right icon" @click="btnClick"></i>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/assets/js/localStorage'
import { mapState, mapMutations } from 'vuex'
import { addMessageList } from '@/api/store'

export default {
  data () {
    return {
      show: false,
      indicator: {
        negative: true,
        remain: true
      },
      value: ''
    }
  },
  computed: {
    ...mapState([
      'inputShow'
    ])
  },
  methods: {
    ...mapMutations({
      setInputShow: 'SET_INPUT_SHOW',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    bgClick () {
      this.setInputShow(false)
      this.value = ''
    },
    btnClick () {
      if (this.value.length < 1) {
        return
      }
      addMessageList({
        author: getUser(),
        text: this.value,
        time: new Date().toLocaleString()
      }).then((res) => {
        if (res.status === 200) {
          this.$emit('success')
        }
      })
      this.bgClick()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.message-input-wrapper
  z-index 400
  position absolute
  bottom 0
  height 100%
  width 100%
  .mask
    z-index 450
    position absolute
    bottom 175px
    height 100%
    width 100%
  .message-input
    position fixed
    left 0
    right 0
    margin auto
    bottom 75px
    width 90%
    height 100px
.icon-add
  z-index 500
  position fixed
  right 20px
  bottom 20px
  .icon
    font-size 50px
    color #666

 .slide-up-enter, .slide-up-leave-to {
    transform: translate3d(0, 100%, 0)
  }
  .slide-up-enter-to, .slide-up-leave {
    opacity: .5
  }
  .slide-up-enter-active, .slide-up-leave-active {
    transition: all .3s ease-out
  }
</style>
