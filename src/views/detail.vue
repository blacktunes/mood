<template>
  <div @click="click" class="detail-wrapper"></div>
</template>

<script type="text/ecmascript-6">
export default {
  methods: {
    click () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .detail-wrapper
    width 100vw
    height 100vh
</style>
