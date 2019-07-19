<template>
  <div class="register-wrapper">
    <div class="register-input">
      <form>
        <input class="username-input" v-model="userName" placeholder="用户名">
        <input class="password-input" v-model="userName" type="password" placeholder="暂时无需密码" autocomplete="on" readonly="true">
        <cube-button class="register-button" :outline="true" @click="click">{{text}}</cube-button>
      </form>
    </div>
    <cube-button class="button" :outline="true" :inline="true" @click="buttonClick">{{button}}</cube-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveUser } from '@/assets/js/localStorage'
import { login, register } from '@/api/store'
export default {
  data () {
    return {
      userName: '',
      login: true
    }
  },
  computed: {
    button () {
      return this.login ? '注册' : '登录'
    },
    text () {
      return this.login ? 'login' : 'register'
    }
  },
  methods: {
    goBack () {
      this.$router.push('/')
      this.$router.go(0)
    },
    click () {
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
        if (this.login) {
          login(this.userName).then((loginRes) => {
            toast3.hide()
            if (this.timer) {
              clearTimeout(this.timer)
            }
            if (loginRes.data.ERR_CODE === 2) {
              const toast4 = this.$createToast({
                txt: '用户不存在',
                time: 1500,
                type: 'error'
              })
              toast4.show()
              return
            }
            saveUser(this.userName)
            this.goBack()
          })
        } else {
          register(this.userName).then((res) => {
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
            this.goBack()
          })
        }
      } else {
        this.$router.push('/')
      }
    },
    buttonClick () {
      this.login = !this.login
      this.userName = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.register-wrapper
  height 100vh
  width 100vw
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
    .username-input
      padding 0 15px
      height 35px
      width 90%
      border-radius 5px 5px 0 0
      color #666
      font-size 12px
      border-bottom 1px solid #ccc
      outline none
    .password-input
      padding 0 15px
      height 35px
      width 90%
      border-radius 0 0 5px 5px
      color #666
      font-size 12px
      outline none
    .register-button
      width calc(90% + 30px)
      padding 10px 0
      margin-top 5px
  .button
    position absolute
    bottom 20px
    left 50%
    transform translate(-50%, 0)
</style>
