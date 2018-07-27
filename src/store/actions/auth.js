import { SIGN_IN } from '../types/auth'
import { createAction } from 'redux-actions'

export const signIn = createAction(SIGN_IN, () => {
  return new Promise(resolve => {
    const user = {
      isSignIn: true,
      user: {
        name: '老王',
        nickName: '隔壁老王',
        phone: '13622809420'
      },
      sessionId: '64ecd82404c51e03dc91cb9e8c025574',
      order: ['order1', 'order2', 'order3', 'order4', 'order5', 'order6'],
      address: ['address1', 'address2', 'address3', 'address4', 'address5', 'address6']
    }
    setTimeout(() => {
      resolve(user)
    }, 4000)
  })
})
