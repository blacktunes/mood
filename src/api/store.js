import axios from 'axios'

const url = 'http://119.29.63.228:4000'
// const url = 'http://127.0.0.1:4000'

export function messageList () {
  return axios({
    method: 'get',
    url: `${url}/messageList`
  })
}

export function addMessageList (message) {
  return axios({
    method: 'post',
    url: `${url}/addMessageList`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: message
  })
}

export function register (userName) {
  return axios({
    method: 'post',
    url: `${url}/register`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}

export function reviseUsername (newName, oldName) {
  return axios({
    method: 'post',
    url: `${url}/reviseUsername`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      newName: newName,
      oldName: oldName
    }
  })
}

export function login (userName) {
  return axios({
    method: 'post',
    url: `${url}/login`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}
