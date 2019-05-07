import axios from 'axios'

export const serverUrl = 'http://119.29.63.228:4000'
// export const serverUrl = 'http://127.0.0.1:4000'

export function messageList () {
  return axios({
    method: 'get',
    url: `${serverUrl}/messageList`
  })
}

export function addMessage (message) {
  return axios({
    method: 'post',
    url: `${serverUrl}/addMessage`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: message
  })
}

export function register (userName) {
  return axios({
    method: 'post',
    url: `${serverUrl}/register`,
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
    url: `${serverUrl}/reviseUsername`,
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
    url: `${serverUrl}/login`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}

export function getNewMessage (id) {
  return axios({
    method: 'post',
    url: `${serverUrl}/getNewMessage`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      id: id
    }
  })
}
