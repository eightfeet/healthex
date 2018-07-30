import state from '../globalData'
import { signature as stamp } from '../hash'

export default function login(url) {
  state.logging = true
  wx.login({
    success: data => {
      console.log(2222, data.code, stamp(data.code))
      // return new Promise((resolve, reject) => {
      wx.request({
        // eslint-disable-line
        url: 'https://yygj.by-health.com/weapp_api/user/login',
        method: 'POST',
        data: {
          code: stamp(data.code)
        },
        success: res => {
          if (res.statusCode !== 200) {
            setTimeout(() => {
              state.logging = false
              state.loggedIn = 2
              return Promise.reject(res)
            }, 3000)
          } else {
            setTimeout(() => {
              state.logging = false
              state.loggedIn = 1
              return Promise.resolve(res)
            }, 3000)
          }
        },
        fail: error => Promise.reject(error)
      })
      // })
    },
    fail: error => console.log(error)
  })
}
