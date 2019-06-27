<template>
  <div class="detail-wrapper">
    <div class="detail" v-finger:swipe="swipeHandler">
      <cube-scroll>
        <message-list :item="messageDetail"></message-list>
        <div class="reply">
          <div v-for="item in replyList" :key="item.id">
            <message-list :item="item" :isReply="true"></message-list>
          </div>
        </div>
      </cube-scroll>
      <cube-textarea class="reply-input"
                     :indicator="false"
                     :placeholder="placeholder"
                     v-model="value"
                     :maxlength="255"
                     :disabled="!isLogin"
                     ref="textarea"
                     @focus="focus"
                     @blur="blur"></cube-textarea>
      <transition name="slide-up">
        <div class="cubeic-right btn" v-show="btnShow" @click.stop.prevent="btnClick"></div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import messageList from '@/components/home/message-list'
import { addReply, getReply } from '@/api/store'
import { getUser } from '@/assets/js/localStorage'
export default {
  components: {
    messageList
  },
  data () {
    return {
      value: '',
      placeholder: '请输入内容',
      btnShow: false,
      replyList: []
    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'messageDetail'
    ])
  },
  methods: {
    swipeHandler (e) {
      if (e.direction === 'Right') {
        this.click()
      }
    },
    click () {
      this.$router.go(-1)
    },
    focus () {
      this.btnShow = true
    },
    blur () {
      if (this.value.length < 1) {
        this.btnShow = false
      }
    },
    btnClick () {
      addReply({
        id: this.messageDetail.id,
        text: this.value,
        author: getUser(),
        messageAuthor: this.messageDetail.author
      }).then((res) => {
        if (res.status === 200) {
          this.$refs.textarea.blur()
          this.replyList.push({
            id: this.messageDetail.id,
            text: this.value,
            author: getUser(),
            time: '刚刚',
            img: 'https://www.feizhouxianyu.cn/mood/upload/' + getUser() + '.png'
          })
          this.value = ''
        }
      })
    }
  },
  activated () {
    getReply({
      id: this.messageDetail.id
    }).then((res) => {
      if (res.status === 200) {
        this.replyList = res.data.replyList
      }
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .detail-wrapper
    width 100vw
    height 100vh
    .header
      position relative
      z-index 500
      display flex
      height 40px
      text-align center
      background #fff
      box-shadow 0px 1px 1px #bbb
      .header-text
        margin auto
        font-size 20px
      .icon
        position fixed
        top 10px
        left 5px
        color #666
    .detail
      width 100vw
      height calc(100vh - 80px)
      .reply
        margin 5px
      .reply-input
        z-index 500
        position fixed
        bottom 0
        width 100vw
        & >>> .cube-textarea
          background #eee
          padding-right 35px
      .btn
        z-index 600
        position fixed
        bottom 10px
        right 10px
        font-size 25px
        color #666
</style>
