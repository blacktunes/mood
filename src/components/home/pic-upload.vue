<template>
  <div class="pic-upload">
    <cube-upload max="9" auto="false" action=""></cube-upload>
  </div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .pic-upload
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    background #ddd
    z-index 1000
</style>
