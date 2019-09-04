<template>
  <div class="long-pic-wrapper" v-if="isLongPic">
    <span>LONG</span>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  props: {
    pic: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState([
      'longPicList'
    ]),
    isLongPic () {
      if (this.longPicList.indexOf(this.pic) !== -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .long-pic-wrapper
    padding 3px 5px
    border-radius 1px
    background rgba(100,100,100,0.8)
    color #fff
    font-size 12px
</style>
