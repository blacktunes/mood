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

export function saveMessageList (messageList) {
  return setLocalStorage('messageList', messageList)
}
