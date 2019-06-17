<template>
  <div class="index-wrapper">
    <home-header @icon-click="iconClick"></home-header>
    <home-menu ref="menu"></home-menu>
    <div :style="{height:indexHeight}">
      <cube-scroll class="index-scroll"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp"
                   @scroll="scroll"
                   @scroll-end="scrollEnd"
                   :options="options"
                   :data="messageList"
                   :scroll-events="['scroll', 'scroll-end']"
                   ref="scroll">
        <transition-group name="fade">
          <div v-for="item in messageList" :key="item.id">
            <message-list :item="item"></message-list>
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
        <div class="new-message" v-show="showNewMessageTip">
          <span class="cubeic-select"></span>
          <span style="margin-left: 5px">查看新消息</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import HomeHeader from '@/components/home/header'
import HomeMenu from '@/components/home/menu'
import MessageList from '@/components/home/message-list'
import MessageButton from '@/components/home/message-button'
import MessageInput from '@/components/home/message-input'
import { getMessageList, saveMessageList, getUser } from '@/assets/js/localStorage'
import { mapMutations, mapState } from 'vuex'
import { messageList, getNewMessage, getUserInfo, moreMessageList } from '@/api/store'

export default {
  data () {
    return {
      listLength: 0,
      haveNewMessage: false,
      showNewMessageTip: false,
      menuVisible: false,
      pic: [],
      picShow: false
    }
  },
  components: {
    HomeHeader,
    HomeMenu,
    MessageList,
    MessageButton,
    MessageInput
  },
  computed: {
    ...mapState([
      'messageList',
      'firstStart',
      'homeScrollY'
    ]),
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
    indexHeight () {
      return document.documentElement.clientHeight - 40 + 'px'
    },
    options () {
      return {
        pullDownRefresh: this.pullDownRefreshOptions,
        pullUpLoad: this.pullUpLoadOptions,
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
      setMessageList: 'SET_MESSAGE_LIST',
      setFirstStart: 'SET_FIRST_START',
      setHomeScrollY: 'SET_HOME_SCROLL_Y'
    }),
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
      } else if (e.y === 0 || -1) {
        this._getNewMessage()
      }
    },
    scrollEnd (e) {
      if (this.haveNewMessage) {
        this.showNewMessageTip = true
      }
      this.setHomeScrollY(e.y)
      if (e.y > 50) {
        this.$refs.scroll.scrollTo(0, 0, 500)
      }
    },
    onPullingUp () {
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
  mounted () {
    setTimeout(() => {
      this.$refs.scroll.scrollTo(0, this.homeScrollY)
    }, 50)
  },
  created () {
    if (getUser()) {
      this.setIsLogin(true)
      if (this.firstStart) {
        getUserInfo(getUser())
        this.setFirstStart(false)
        this.setMessageList(getMessageList().slice(0, 30))
      }
    } else {
      this.setIsLogin(false)
      this.setMessageList(getMessageList())
    }
    this._getNewMessage()
  },
  beforeDestroy () {
    if (this.timer || this.i) {
      clearTimeout(this.timer)
      clearTimeout(this.i)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/transition'
.index-scroll
  z-index 200
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
.mask
  z-index 1000
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  background #ccc

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
.success-enter-active, .success-leave-active
  transition: width .5s
.success-enter, .success-leave-to
  width: 70%
.success-enter-to, .success-leave
  width: 100%
</style>
