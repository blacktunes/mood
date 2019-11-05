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
      <transition-group name="slide-up">
        <div class="cubeic-picture pic-btn" v-show="btnShow" @click.stop.prevent="picClick" key="1"></div>
        <div class="cubeic-right right-btn" v-show="btnShow" @click.stop.prevent="rightClick" key="2"></div>
        <span class="pic-number" v-show="btnShow && picNum !== 0" key="3">{{picNum}}</span>
      </transition-group>
      <upload @success="uploadSuccess"
              @pic-num="picChange"
              :maxUpload="1"
              v-show="false"
              ref="upload"></upload>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import messageList from '@/components/home/message-list'
import { addReply, getReply } from '@/api/store'
import { getUser } from '@/assets/js/localStorage'
import Upload from '@/components/home/upload'

export default {
  components: {
    messageList,
    Upload
  },
  data () {
    return {
      value: '',
      placeholder: '请输入内容',
      addressee: null,
      addresseeText: null,
      btnShow: false,
      replyList: [],
      loadingShow: false,
      pic: '',
      picNum: 0
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
    picChange (num) {
      this.picNum = num
      if (num > 0) {
        this.$refs.textarea.$el.style.height = '80px'
        this.btnShow = true
      } else {
        this.$refs.textarea.$el.style.height = ''
        this.btnShow = false
      }
    },
    uploadSuccess (filename) {
      this.pic = filename
      this.$refs.upload.toastHide()
      this._addReply()
    },
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
    picClick () {
      if (this.picNum < 1) {
        this.$refs.upload.addPic()
      } else {
        this.$refs.upload.delPic()
      }
    },
    rightClick () {
      if (this.value.length < 1 && this.picNum < 1) {
        return
      }
      if (this.picNum > 0) {
        this.$refs.upload.start()
      } else {
        this._addReply()
      }
    },
    _addReply () {
      const errToast = this.$createToast({
        txt: '发送失败',
        time: 2000,
        type: 'error'
      }, false)
      const replyTosat = this.$createToast({
        txt: '正在发送...',
        time: 0,
        mask: true
      })
      replyTosat.show()
      addReply({
        id: this.messageDetail.id,
        text: this.value.replace(/\n|\r\n/g, '<br/>'),
        pic: this.pic,
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
          replyTosat.hide()
          this.$refs.upload.picFiles = []
          this.pic = ''
        }
      })
        .catch(() => {
          replyTosat.hide()
          errToast.show()
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
    if (this.$route.query.author) {
      setTimeout(() => {
        this.$refs.textarea.focus()
        this.placeholder = '回复 @' + this.$route.query.author + ':'
        this.addressee = this.$route.query.author
        this.addresseeText = this.$route.query.text
      }, 350)
    }
  },
  deactivated () {
    this.$refs.upload.picFiles = []
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
      .right-btn
        z-index 600
        position fixed
        bottom 10px
        right 10px
        font-size 25px
        color #666
      .pic-btn
        z-index 600
        position fixed
        bottom 10px
        right 45px
        font-size 25px
        color #666
      .pic-number
        position absolute
        right 36px
        bottom 24px
        z-index 500
        width 15px
        height 15px
        border-radius 50%
        background #666
        color #eeeeee
        font-size 10px
        line-height 16px
        text-align center
</style>
