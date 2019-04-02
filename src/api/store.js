import axios from 'axios'

export function messageList () {
  return axios({
    method: 'get',
    url: `http://127.0.0.1:4000/messageList`
  })
}

export function addMessageList (message) {
  return axios({
    method: 'post',
    url: `http://127.0.0.1:4000/addMessageList`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: message
  })
}

export function register (userName) {
  return axios({
    method: 'post',
    url: 'http://127.0.0.1:4000/register',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    params: {
      userName: userName
    }
  })
}
