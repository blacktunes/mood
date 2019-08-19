import axios from 'axios'

export const serverUrl = 'https://www.feizhouxianyu.cn:4001'
// export const serverUrl = 'http://127.0.0.1:4000'

export function messageList (id) {
  return axios({
    method: 'get',
    url: `${serverUrl}/messageList`,
    params: {
      id: id
    }
  })
}

export function moreMessageList (id) {
  return axios({
    method: 'get',
    url: `${serverUrl}/moreMessageList`,
    params: {
      id: id
    }
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

export function getNewMessage (id, lastId) {
  return axios({
    method: 'get',
    url: `${serverUrl}/getNewMessage`,
    params: {
      id: id,
      lastId: lastId
    }
  })
}

export function getUserInfo (userName) {
  return axios({
    method: 'post',
    url: `${serverUrl}/getUserInfo`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}

export function addReply (reply) {
  return axios({
    method: 'post',
    url: `${serverUrl}/addReply`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: reply
  })
}

export function getReply (id) {
  return axios({
    method: 'get',
    url: `${serverUrl}/getReply`,
    params: id
  })
}

export function getUserReply (userName) {
  return axios({
    method: 'post',
    url: `${serverUrl}/getUserReply`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}

export function readReply (userName) {
  return axios({
    method: 'post',
    url: `${serverUrl}/readReply`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}

export function getVersion () {
  return axios({
    method: 'get',
    url: `${serverUrl}/getVersion`
  })
}
