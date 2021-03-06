import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 是否打开输入框
    inputShow: false,
    // 是否已登录
    isLogin: false,
    messageList: [],
    // 是否首次启动
    firstStart: true,
    messageDetail: {},
    // 长图列表
    longPicList: []
  },
  mutations: {
    SET_INPUT_SHOW (state, flag) {
      state.inputShow = flag
    },
    SET_IS_LOGIN (state, flag) {
      state.isLogin = flag
    },
    SET_MESSAGE_LIST (state, list) {
      state.messageList = list
    },
    SET_FIRST_START (state, flag) {
      state.firstStart = flag
    },
    SET_MESSAGE_DETAIL (state, object) {
      state.messageDetail = object
    },
    SET_LONG_PIC_LIST (state, list) {
      state.longPicList = list
    }
  },
  getters: {
    inputShow: state => state.inputShow
  },
  actions: {}
})
