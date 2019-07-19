<template>
  <div id="app">
    <home-header @icon-click="iconClick"></home-header>
    <transition :name="transitionName">
      <keep-alive>
        <router-view ref="component"/>
      </keep-alive>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import HomeHeader from '@/components/home/header'

// 禁止鼠标右击事件
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

export default {
  components: {
    HomeHeader
  },
  data () {
    return {
      transitionName: ''
    }
  },
  methods: {
    iconClick () {
      this.$refs.component.$refs.menu.menuShow()
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
