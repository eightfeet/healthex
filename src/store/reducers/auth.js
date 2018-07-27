import { handleActions } from 'redux-actions'
import { SIGN_IN, LOGIN_OUT } from '../types/auth'
export default handleActions({
  [LOGIN_OUT] (state) {
    return {
      ...state,
      isSignIn: false,
      user: {},
      sessionId: null,
      order: [],
      address: []
    }
  },
  [SIGN_IN] (state, action) {
    const {isSignIn, user, sessionId, orders, addresses} = action.payload
    return {
      ...state,
      isSignIn,
      user,
      sessionId,
      orders,
      addresses
    }
  }
}, {
  isSignIn: false,
  user: {
  },
  sessionId: null,
  order: [],
  address: []
})
