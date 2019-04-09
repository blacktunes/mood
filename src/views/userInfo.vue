<template>
  <div class="register-wrapper">
    <div class="register-input">
      <span class="text">修改昵称</span>
      <input class="input" v-model="userName">
      <i class="cubeic-pullup icon" @click="click"></i>
    </div>
    <cube-button class="button" icon="cubeic-close" :outline="true" :inline="true" @click="logOff">注销</cube-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveUser, getUser, delUser } from '@/assets/js/localStorage'
import { reviseUsername } from '@/api/store'
export default {
  data () {
    return {
      userName: ''
    }
  },
  methods: {
    click () {
      if (this.userName === getUser()) {
        return
      }
      if (this.userName) {
        const toast3 = this.$createToast({
          txt: '正在提交',
          mask: true,
          time: 0
        })
        toast3.show()
        this.timer = setTimeout(() => {
          const toast1 = this.$createToast({
            txt: '请求超时',
            time: 2000,
            type: 'error'
          })
          toast1.show()
        }, 1000 * 15)
        reviseUsername(this.userName, getUser()).then((res) => {
          toast3.hide()
          if (this.timer) {
            clearTimeout(this.timer)
          }
          if (res.data.ERR_CODE === 1) {
            const toast2 = this.$createToast({
              txt: '用户名已存在',
              time: 1500,
              type: 'error'
            })
            toast2.show()
            return
          }
          saveUser(this.userName)
          this.$router.push('/')
        })
      } else {
        this.$router.go(-1)
      }
    },
    logOff () {
      delUser()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.register-wrapper
  height 100vh
  width 100%
  .register-input
    display flex
    align-items center
    flex-direction column
    position absolute
    left 0
    right 0
    top 30%
    width 60%
    margin auto
    .text
      margin-bottom 10px
    .input
      text-align center
      height 30px
      border-radius 5px
      color #666
      font-size 15px
    .icon
      margin-top 5px
      font-size 30px
  .button
    position absolute
    bottom 20px
    left 50%
    transform translate(-50%, 0)
</style>
