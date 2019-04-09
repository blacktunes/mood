<template>
  <div class="index-wrapper">
    <home-header></home-header>
    <div :style="{height:indexHeight}">
      <cube-scroll class="index-scroll"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp"
                   :options="options"
                   :data="showMessageList"
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
import { messageList } from '@/api/store'

export default {
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
          txt: ``
        },
        pullUpLoad: {
          txt: { noMore: '已经到地底了' }
        },
        click: true
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'SET_IS_LOGIN',
      setMessageList: 'SET_MESSAGE_LIST'
    }),
    onPullingUp () {
      this.$refs.scroll.forceUpdate()
    },
    onPullingDown () {
      messageList().then((res) => {
        if (res.status === 200) {
          this.$refs.scroll.forceUpdate()
          setTimeout(() => {
            saveMessageList(res.data.messageList)
            this.setMessageList(res.data.messageList)
          }, 600)
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.index-scroll
  z-index 100
  .text
    text-align center
    margin 20px

.fade-enter, .fade-leave-to {
  opacity: 0
}
.fade-enter-active, .fade-leave-active {
  transition: all .2s linear;
}
</style>
