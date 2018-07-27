import state from '../utils/globalData'

export function test() { }

export function LogIn() {
  return new Promise((resolve, reject) => {
    state.logging = true
    console.log(state)
    setTimeout(() => {
      state.logging = false
      state.loggedIn = true
      resolve()
    }, 4000)
  })
}

export default {}
