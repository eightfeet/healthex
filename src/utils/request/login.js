import state from '../globalData'

export default function login(url) {
  state.logging = true
  return new Promise((resolve, reject) => {
    wx.request({
      // eslint-disable-line
      url: 'https://yygj.by-health.com/login',
      method: 'POST',
      data: {},
      success: res => {
        if (res.statusCode !== 200) {
          setTimeout(() => {
            state.logging = false
            state.loggedIn = 2
            reject(res)
          }, 3000)
        } else {
          setTimeout(() => {
            state.logging = false
            state.loggedIn = 1
            resolve(res)
          }, 3000)
        }
      },
      fail: error => reject(error)
    })
  })
}
