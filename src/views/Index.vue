<template>
  <div class="index-wrapper">
    <home-header></home-header>
    <div :style="{height:indexHeight}">
      <cube-scroll class="index-scroll"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp"
                   @scroll="scroll"
                   @scroll-end="scrollEnd"
                   :options="options"
                   :data="showMessageList"
                   :scroll-events="['scroll', 'scroll-end']"
                   ref="scroll">
        <transition-group name="fade">
          <div v-for="item in showMessageList" :key="item.id">
            <message-list :item="item" @loadImage="loadImage"></message-list>
          </div>
        </transition-group>
        <div class="text" v-show="listEmpty">暂无内容</div>
        <template slot="pulldown" slot-scope="props">
          <div v-if="props.pullDownRefresh"
            class="cube-pulldown-wrapper"
            :style="props.pullDownStyle">
            <div v-if="props.beforePullDown"
              class="before-trigger"
              :style="{paddingBottom: props.bubbleY + 'px'}">
              <span :class="{rotate: props.bubbleY > 0}">↓</span>
            </div>
            <div class="after-trigger" v-else>
              <div v-show="props.isPullingDown" class="loading">
                <cube-loading></cube-loading>
              </div>
              <transition name="success">
                <div v-show="!props.isPullingDown" class="text-wrapper">
                  <span class="refresh-text">{{pullDownTxt}}</span>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </cube-scroll>
      <message-button></message-button>
      <message-input @success="onPullingDown"></message-input>
      <transition name="fade">
        <div class="new-message" v-show="haveNewMessage">
          <span class="cubeic-select"></span>
          <span style="margin-left: 5px">查看新消息</span>
        </div>
      </transition>
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
      return document.documentElement.clientHeight - 40 + 'px'
    },
    options () {
      return {
        pullDownRefresh: this.pullDownRefreshOptions,
        pullUpLoad: this.pullUpLoadOptions,
        click: true,
        probeType: 1
      }
    },
    pullUpLoadOptions () {
      if (this.listEmpty) {
        return false
      } else {
        return {
          txt: { noMore: '已经到地底了' }
        }
      }
    },
    pullDownRefreshOptions () {
      if (this.showMessageList) {
        return {
          threshold: 46,
          txt: this.pullDownTxt,
          stopTime: 1000
        }
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'SET_IS_LOGIN',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    loadImage () {
      this.$refs.scroll.refresh()
    },
    scroll (e) {
      if (e.y < 0 && this.listEmpty) {
        this.$refs.scroll.scrollTo(0, 0)
      }
      if (Math.abs(e.y) > 35) {
        this.haveNewMessage = false
        if (e.y > 50) {
          this.$refs.scroll.scrollTo(0, 50)
        }
      } else if (e.y === 0 || -1) {
        this._getNewMessage()
      }
    },
    scrollEnd (e) {
      if (e.y > 50) {
        this.$refs.scroll.scrollTo(0, 0, 500)
      }
    },
    onPullingUp () {
      setTimeout(() => {
        this.$refs.scroll.forceUpdate()
      }, 1000)
    },
    onPullingDown () {
      messageList().then((res) => {
        if (res.status === 200) {
          this.listLength = res.data.messageList.length - this.messageList.length
          this.$refs.scroll.disable()
          saveMessageList(res.data.messageList)
          this.setMessageList(res.data.messageList)
          setTimeout(() => {
            this.$refs.scroll.enable()
          }, 1450)
        }
      })
        .catch(() => {
          const toast = this.$createToast({
            txt: '网络异常',
            time: 2000,
            type: 'error'
          })
          toast.show()
          this.$refs.scroll.forceUpdate()
        })
    },
    _getNewMessage () {
      if (this.listEmpty) {
        this.haveNewMessage = true
      } else {
        if (this.timer) {
          return
        }
        this.timer = setTimeout(() => {
          this.timer = null
        }, 1000 * 30)
        const messageId = !this.listEmpty ? this.showMessageList[0].id : 0
        getNewMessage(messageId).then(res => {
          if (res.status === 200) {
            if (res.data.newMessage > 0) {
              this.haveNewMessage = true
            }
          }
        })
      }
    }
  },
  created () {
    this.setMessageList(getMessageList())
    if (getUser()) {
      this.setIsLogin(true)
    } else {
      this.setIsLogin(false)
    }
    this._getNewMessage()
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
    margin-top 80px
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

.cube-pulldown-wrapper
  text-align: center
  .before-trigger
    height: auto
    font-size: 30px
    align-self: flex-end
    span
      display: inline-block
      line-height: 1
      transition: all 0.3s
      color: #666
      padding: 5px 0
      &.rotate
        transform: rotate(180deg)
  .after-trigger
    flex: 1
    margin: 0
    .text-wrapper
      margin: 0 auto
      margin-top: 10px
      padding: 5px 0
      color: #498ec2
      background-color: #d6eaf8
    & >>> .cube-loading-spinners
      margin: auto
.success-enter-active, .success-leave-active
  transition: width .5s
.success-enter, .success-leave-to
  width: 70%
.success-enter-to, .success-leave
  width: 100%
.fade-enter, .fade-leave-to
  opacity: 0
.fade-enter-active, .fade-leave-active
  transition: all .2s linear;
</style>
