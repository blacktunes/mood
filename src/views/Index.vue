<template>
  <div class="index-wrapper">
    <home-header></home-header>
    <div :style="{height:indexHeight}">
      <cube-scroll class="index-scroll"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp"
                   @scroll="scroll"
                   :options="options"
                   :data="showMessageList"
                   :scroll-events="['scroll']"
                   ref="scroll">
          <transition-group name="fade">
            <div v-for="item in showMessageList" :key="item.id">
              <message-list :item="item"></message-list>
            </div>
          </transition-group>
          <div class="text" v-show="listEmpty">暂无内容</div>
      </cube-scroll>
      <message-button></message-button>
      <message-input @success="onPullingDown"></message-input>
      <div class="new-message" v-show="haveNewMessage">
        <span class="cubeic-select"></span>
        <span style="margin-left: 5px">查看新消息</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import HomeHeader from '@/components/home/header'
import MessageList from '@/components/home/message-list'
import MessageButton from '@/components/home/message-button'
import MessageInput from '@/components/home/message-input'
import { getMessageList, saveMessageList, getUser } from '@/assets/js/localStorage'
import { mapMutations, mapState } from 'vuex'
import { messageList, getNewMessage } from '@/api/store'

export default {
  data () {
    return {
      listLength: 0,
      haveNewMessage: false
    }
  },
  components: {
    HomeHeader,
    MessageList,
    MessageButton,
    MessageInput
  },
  computed: {
    ...mapState([
      'messageList'
    ]),
    listEmpty () {
      if (this.messageList.length < 1) {
        return true
      } else {
        return false
      }
    },
    pullDownTxt () {
      return this.listLength === 0 ? '暂无新消息' : `已更新${this.listLength}条新消息`
    },
    showMessageList () {
      let list = this.messageList
      return list.reverse()
    },
    indexHeight () {
      return document.documentElement.clientHeight - 50 + 'px'
    },
    options () {
      return {
        pullDownRefresh: {
          threshold: 50,
          txt: this.pullDownTxt,
          stopTime: 500
        },
        pullUpLoad: {
          txt: { noMore: '已经到地底了' }
        },
        click: true,
        probeType: 1
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'SET_IS_LOGIN',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    scroll (e) {
      if (Math.abs(e.y) > 45) {
        this.haveNewMessage = false
      } else if (e.y === 0) {
        this._getNewMessage()
      }
    },
    onPullingUp () {
      this.$refs.scroll.forceUpdate()
    },
    onPullingDown () {
      messageList().then((res) => {
        if (res.status === 200) {
          this.listLength = res.data.messageList.length - this.messageList.length
          this.$refs.scroll.forceUpdate()
          this.$refs.scroll.disable()
          setTimeout(() => {
            saveMessageList(res.data.messageList)
            this.setMessageList(res.data.messageList)
            this.$refs.scroll.enable()
          }, 1100)
        }
      })
    },
    _getNewMessage () {
      if (this.timer) {
        return
      }
      getNewMessage(this.showMessageList[0].id).then(res => {
        this.timer = setTimeout(() => {
          this.timer = null
        }, 1000 * 30)
        if (res.status === 200) {
          if (res.data.newMessage > 0) {
            this.haveNewMessage = true
          }
        }
      })
    }
  },
  created () {
    this.setMessageList(getMessageList())
    if (getUser()) {
      this.setIsLogin(true)
    } else {
      this.setIsLogin(false)
    }
    if (this.showMessageList.length > 0) {
      this._getNewMessage()
      // this.timer = setInterval(() => {
      //   this._getNewMessage()
      // }, 1000 * 60 * 5)
    } else {
      this.haveNewMessage = true
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.index-scroll
  z-index 100
  .text
    text-align center
    margin-top 50px
.new-message
  position absolute
  top 60px
  left 50%
  padding 5px 10px
  transform translate(-50%, 0)
  font-size 12px
  z-index 500
  border-radius 18px
  box-shadow 0 0 1px 2px #ddd
  background #fff

.fade-enter, .fade-leave-to {
  opacity: 0
}
.fade-enter-active, .fade-leave-active {
  transition: all .2s linear;
}
</style>
