import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function getLocalStorage (key) {
  return localStorage.get(key)
}

export function setLocalStorage (key, value) {
  return localStorage.set(key, value)
}

export function removeLocalStorage (key) {
  return localStorage.delete(key)
}

export function clearLocalStorage () {
  return localStorage.clear()
}

export function getUser () {
  return getLocalStorage('user')
}

export function saveUser (user) {
  return setLocalStorage('user', user)
}

export function delUser () {
  return removeLocalStorage('user')
}

export function getMessageList () {
  if (!getLocalStorage('messageList')) {
    let list = []
    saveMessageList(list)
  }
  return getLocalStorage('messageList')
}

export function delMessageList () {
  return removeLocalStorage('messageList')
}

export function saveMessageList (messageList) {
  return setLocalStorage('messageList', messageList)
}

export function saveShowLog (flag) {
  return setLocalStorage('showLog', flag)
}

export function getShowLog () {
  return getLocalStorage('showLog')
}

export function saveMessage (message) {
  return setLocalStorage('message', message)
}

export function delMessage () {
  return removeLocalStorage('message')
}

export function getMessage () {
  return getLocalStorage('message')
}

export function saveLoginInformation (object) {
  return setLocalStorage('loginInformation', object)
}

export function delLoginInformation () {
  return removeLocalStorage('loginInformation')
}

export function getLoginInformation () {
  if (!getLocalStorage('loginInformation')) {
    let today = new Date(new Date().toLocaleDateString()).getTime()
    let object = {
      secondDay: today + 24 * 60 * 60 * 1000,
      thirdDay: today + 24 * 60 * 60 * 1000 * 2,
      consecutiveLoginNum: 1,
      isYesterdayLogin: false,
      isTodayLogin: true,
      loginTime: [new Date().getTime()]
    }
    saveLoginInformation(object)
  }
  return getLocalStorage('loginInformation')
}
