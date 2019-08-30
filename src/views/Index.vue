<template>
  <div class="index-wrapper">
    <home-menu ref="menu"></home-menu>
    <cube-slide :loop="false"
                :auto-play="false"
                :showDots="false"
                :threshold="0.3"
                @scroll="sildeScroll"
                @change="slideChange"
                :options="slideOptions"
                :refreshResetCurrent="false"
                ref="slide"
                class="slide">
      <cube-slide-item>
        <div :style="{height:indexHeight, transition:transition}" v-finger:swipe="swipeHandler">
          <cube-scroll class="index-scroll"
                      @pulling-down="onPullingDown"
                      @pulling-up="onPullingUp"
                      @scroll="scroll"
                      @scroll-end="scrollEnd"
                      :options="options"
                      :data="messageList"
                      :scroll-events="['scroll', 'scroll-end']"
                      ref="scroll">
            <update-logs></update-logs>
            <transition-group name="fade">
              <div v-for="item in messageList" :key="item.id">
                <message-list :item="item" :is-index="true"></message-list>
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
          <message-input @success="onPullingDown"></message-input>
          <transition name="fade">
            <div class="new-message" v-show="showNewMessageTip">
              <span class="cubeic-select"></span>
              <span style="margin-left: 5px">查看新消息</span>
            </div>
          </transition>
        </div>
      </cube-slide-item>
      <cube-slide-item v-if="isLogin">
        <message ref="message" @new-reply="showNewReply"></message>
      </cube-slide-item>
    </cube-slide>
    <message-button ref="button"></message-button>
    <transition name="slide-up">
    <cube-tab-bar v-model="selectedLabel"
                  :data="tabs"
                  :showSlider="true"
                  @click="tabClick"
                  @change="changeHandler"
                  ref="tabBar"
                  class="tab-bar"
                  v-show="!inputShow"></cube-tab-bar>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="maskShow"></div>
    </transition>
    <div class="new-reply" v-show="haveNewReply"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Message from './message'
import HomeMenu from '@/components/home/menu'
import MessageList from '@/components/home/message-list'
import MessageButton from '@/components/home/message-button'
import MessageInput from '@/components/home/message-input'
import UpdateLogs from '@/components/home/update-logs'
import { getMessageList, saveMessageList, getUser } from '@/assets/js/localStorage'
import { mapMutations, mapState } from 'vuex'
import { messageList, getNewMessage, moreMessageList } from '@/api/store'

export default {
  data () {
    return {
      listLength: 0,
      haveNewMessage: false,
      showNewMessageTip: false,
      maskShow: true,
      haveNewReply: false,
      selectedLabel: 'Home',
      socketsErr: false
    }
  },
  sockets: {
    // 建立连接自动调用connect
    connect: function () {
      // 与socket.io连接后回调
      // console.log('conn')
      this.socketsErr = false
    },
    connect_error: function () {
      this.socketsErr = true
    },
    disconnect: () => {
      // console.log('disconn')
    }
  },
  components: {
    Message,
    HomeMenu,
    MessageList,
    MessageButton,
    MessageInput,
    UpdateLogs
  },
  computed: {
    ...mapState([
      'isLogin',
      'messageList',
      'inputShow'
    ]),
    tabs () {
      if (this.isLogin) {
        return [{
          label: '',
          icon: 'cubeic-home',
          value: 'Home'
        }, {
          label: '',
          icon: 'cubeic-email',
          value: 'Message'
        }]
      } else {
        return [{
          label: '',
          icon: 'cubeic-home',
          value: 'Home'
        }]
      }
    },
    messageId () {
      return !this.listEmpty ? this.messageList[0].id : 0
    },
    lastId () {
      return !this.listEmpty ? this.messageList[this.messageList.length - 1].id : 0
    },
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
    transition () {
      if (this.inputShow) {
        return 'height 0.15s linear'
      } else {
        return ''
      }
    },
    indexHeight () {
      if (this.inputShow) {
        return document.documentElement.clientHeight - 40 + 'px'
      } else {
        return document.documentElement.clientHeight - 70 + 'px'
      }
    },
    slideOptions () {
      return {
        listenScroll: true,
        probeType: 3,
        flickLimitDistance: 1,
        observeDOM: false
      }
    },
    options () {
      return {
        pullDownRefresh: this.pullDownRefreshOptions,
        pullUpLoad: this.pullUpLoadOptions
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
      if (this.messageList) {
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
    showNewReply (flag) {
      this.haveNewReply = flag
    },
    slideChange (index) {
      if (index === 0) {
        this.$refs.button.isHome = true
        this.selectedLabel = 'Home'
      } else {
        this.$refs.button.isHome = false
        this.selectedLabel = 'Message'
        this.$refs.message._getUserReply('slideChange')
        this.haveNewReply = false
      }
    },
    sildeScroll (e) {
      this.$refs.tabBar.setSliderTransform(-(e.x / 2))
    },
    tabClick (label) {
      if (label === 'Home' && this.$refs.slide.currentPageIndex === 0) {
        this.$refs.scroll.scrollTo(0, 0, 500)
      }
    },
    changeHandler (label) {
      switch (label) {
        case 'Message': this.$refs.slide._goToPage(1)
          break
        case 'Home': this.$refs.slide._goToPage(0)
          break
      }
    },
    swipeHandler (e) {
      if (e.direction === 'Right' && this.isLogin) {
        this.iconClick()
      }
    },
    iconClick () {
      this.$refs.menu.menuShow()
    },
    loadImage () {
      // 图片加载完成时重新计算滚动高度，但是会导致下拉动画错误
      // this.$refs.scroll.refresh()
    },
    scroll (e) {
      if (e.y < 0 && this.listEmpty) {
        this.$refs.scroll.scrollTo(0, 0)
      }
      if (Math.abs(e.y) > 35) {
        this.showNewMessageTip = false
        if (e.y > 50) {
          this.$refs.scroll.scrollTo(0, 50)
        }
      }
    },
    scrollEnd (e) {
      if (this.haveNewMessage) {
        this.showNewMessageTip = true
      }
      if (e.y > 50) {
        this.$refs.scroll.scrollTo(0, 0, 500)
      }
    },
    onPullingUp () {
      this.$refs.scroll.refresh()
      moreMessageList(this.messageList[this.messageList.length - 1].id).then((res) => {
        if (res.status === 200 && res.data.messageList.length > 0) {
          this.setMessageList(this.messageList.concat(res.data.messageList))
          saveMessageList(this.messageList)
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown () {
      getNewMessage(this.messageId, this.lastId).then(numRes => {
        if (numRes.status === 200) {
          this._updataReply(numRes)
          if (numRes.data.newMessage > 0) {
            messageList(this.messageId).then((res) => {
              if (res.status === 200) {
                this.listLength = numRes.data.newMessage
                this.$refs.scroll.disable()
                this.setMessageList(res.data.messageList.concat(this.messageList))
                saveMessageList(this.messageList)
                this.haveNewMessage = false
                setTimeout(() => {
                  this.$refs.scroll.enable()
                }, 1450)
              }
            })
              .catch(() => {
                this.$createToast({
                  txt: '网络异常',
                  time: 2000,
                  type: 'error'
                }).show()
                this.$refs.scroll.forceUpdate()
              })
          } else {
            this.listLength = 0
            this.$refs.scroll.forceUpdate()
            this.$refs.scroll.disable()
            this.i = setTimeout(() => {
              this.$refs.scroll.enable()
            }, 1450)
          }
        }
      })
        .catch(() => {
          this.$createToast({
            txt: '网络异常',
            time: 2000,
            type: 'error'
          }).show()
          this.$refs.scroll.forceUpdate()
        })
    },
    _getNewMessage () {
      if (this.listEmpty) {
        this.showNewMessageTip = true
      } else {
        if (this.timer) {
          return
        }
        this.timer = setTimeout(() => {
          this.timer = null
          this._getNewMessage()
        }, 1000 * 30)
        getNewMessage(this.messageId, this.lastId).then(res => {
          if (res.status === 200) {
            this._updataReply(res)
            if (res.data.newMessage > 0) {
              this.haveNewMessage = true
              this.showNewMessageTip = true
            }
          }
        })
        if (this.isLogin) {
          this.$refs.message._getUserReply()
        }
      }
    },
    _updataReply (res) {
      const tempList = this.messageList
      tempList.map(item => {
        res.data.newReply.forEach(reply => {
          if (reply.id === item.id) {
            item.reply = reply.reply
          }
        })
      })
      this.setMessageList(tempList)
      saveMessageList(tempList)
    }
  },
  activated () {
    this._getNewMessage()
    if (getUser()) {
      this.setIsLogin(true)
    } else {
      this.setIsLogin(false)
    }
    setTimeout(() => {
      this.$refs.slide.refresh()
    }, 20)
  },
  created () {
    this.$socket.emit('login', getUser() || '未注册用户')
    if (getUser()) {
      this.setIsLogin(true)
    } else {
      this.setIsLogin(false)
    }
    this.setMessageList(getMessageList().slice(0, 30))
    setTimeout(() => {
      this.maskShow = false
    }, 200)
  },
  deactivated () {
    if (this.timer || this.i) {
      clearTimeout(this.timer)
      clearTimeout(this.i)
      this.timer = null
      this.i = null
    }
  },
  watch: {
    socketsErr (newVal) {
      var socketsToast = this.$createToast({
        txt: '服务器异常',
        time: 0,
        type: 'error',
        mask: true
      })
      if (newVal) {
        socketsToast.show()
      } else {
        socketsToast.hide()
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/transition'
.slide
  width 100vw
  & >>> .cube-slide-group
    white-space normal
.index-scroll
  z-index 200
  .text
    text-align center
    margin-top 80px
.new-message
  position absolute
  top 20px
  left 50vw
  padding 5px 10px
  transform translate(-50%, 0)
  font-size 12px
  z-index 500
  border-radius 18px
  box-shadow 0 0 1px 2px #ddd
  background #fff
.mask
  z-index 1000
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  background #ccc
.new-reply
  position absolute
  bottom 20px
  right 21%
  width 7px
  height 7px
  border-radius 50%
  background red

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
      margin-top: 7px
      padding: 5px 0
      color: #498ec2
      background-color: #d6eaf8
    & >>> .cube-loading-spinners
      margin: auto

.tab-bar
  background #eee
  & >>> .cube-tab-bar-slider
    background #01579b
  & >>> .cube-tab_active
    color #01579b

.success-enter-active, .success-leave-active
  transition: width .5s
.success-enter, .success-leave-to
  width: 70%
.success-enter-to, .success-leave
  width: 100%
</style>
