import state from '../globalData'
import { signature as stamp } from '../hash'

export default function login(url) {
  return new Promise((resolve, reject) => {
    state.logging = true
    wx.login({
      success: data => {
        console.log(2222, data.code, stamp(data.code))
        const requestData = {
          code: data.code,
          timestamp: Date.now(),
          serverKey: '2016'
        }
        requestData.sign = stamp(requestData, 'bcttcwls789')
        wx.request({
          url: 'https://yygj.by-health.com/weapp_api/user/login',
          method: 'POST',
          data: requestData,
          success: res => {
            console.log('res', res)
            if (res.statusCode !== 200) {
              state.loggedIn = 2
              reject(res)
            } else {
              state.loggedIn = 1
              resolve(res)
            }
          },
          fail: error => reject(error)
        })
      },
      fail: error => reject(error)
    })
  })
}
