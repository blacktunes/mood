import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 是否打开输入框
    inputShow: false,
    // 是否已登录
    isLogin: false,
    messageList: []
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
    }
  },
  getters: {
    inputShow: state => state.inputShow
  },
  actions: {}
})
