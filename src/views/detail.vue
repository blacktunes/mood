<template>
  <div class="detail-wrapper">
    <div class="detail" v-finger:swipe="swipeHandler">
      <cube-scroll>
        <message-list :item="messageDetail"></message-list>
        <div class="reply">
          <div class="no-reply" v-if="noReply">
            <div class="no-reply-text">并没有回复</div>
            <cube-button class="no-reply-btn" :inline="true" :outline="true" @click="_getReply">刷新试试</cube-button>
          </div>
          <transition-group name="fade">
            <div v-for="item in replyList" :key="item.id" @click="replyClick(item)">
              <message-list :item="item" :isReply="true"></message-list>
            </div>
          </transition-group>
        </div>
        <div class="loading" v-show="loadingShow">
          <cube-loading></cube-loading>
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
      addressee: null,
      addresseeText: null,
      btnShow: false,
      replyList: [],
      loadingShow: false
    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'messageDetail'
    ]),
    noReply () {
      if (this.replyList.length > 0) {
        return false
      } else if (this.loadingShow) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    replyClick (item) {
      if (this.value.length > 0) {
        return
      }
      this.$refs.textarea.focus()
      this.placeholder = '回复 @' + item.author + ':'
      this.addressee = item.author
      this.addresseeText = item.text
    },
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
        this.placeholder = '请输入内容'
      }
    },
    btnClick () {
      if (this.value.length < 1) {
        return
      }
      addReply({
        id: this.messageDetail.id,
        text: this.value,
        author: getUser(),
        addressee: this.addressee,
        addresseeText: this.addresseeText,
        messageAuthor: this.messageDetail.author
      }).then((res) => {
        if (res.status === 200) {
          this.$refs.textarea.blur()
          this._getReply()
          this.value = ''
          this.addressee = null
        }
      })
    },
    _getReply () {
      if (this.replyList.length < 1) {
        this.loadingShow = true
      }
      getReply({
        id: this.messageDetail.id
      }).then((res) => {
        if (res.status === 200) {
          this.loadingShow = false
          this.replyList = res.data.replyList.reverse()
        }
      })
        .catch(() => {
          this.$createToast({
            txt: '网络异常',
            time: 2000,
            type: 'error'
          }).show()
          this.loadingShow = false
        })
    }
  },
  activated () {
    if (!this.messageDetail.id) {
      this.$router.push('/')
      return
    }
    this._getReply()
    setTimeout(() => {
      if (this.$route.query.author) {
        this.$refs.textarea.focus()
        this.placeholder = '回复 @' + this.$route.query.author + ':'
        this.addressee = this.$route.query.author
        this.addresseeText = this.$route.query.text
      }
    }, 350)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/assets/stylus/transition'
  .detail-wrapper
    width 100vw
    height 100vh
    .detail
      width 100vw
      height calc(100vh - 80px)
      .reply
        margin 5px
        .no-reply
          text-align center
          margin 50px auto 0 auto
          .no-reply-btn
            margin-top 7px
      .loading
        width 24px
        position relative
        left 50%
        transform translate(-50%, 0)
        margin-top 55px
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
