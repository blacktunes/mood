<template>
  <div id="app">
    <transition :name="transitionName">
    <router-view/>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'detail' && from.name === 'index') {
        this.transitionName = 'slide-left'
      } else if (from.name === 'detail' && to.name === 'index') {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = ''
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" sccped>
body
  background #ddd
</style>
