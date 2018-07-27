/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import { stringify } from 'qs'
import state from '../globalData'
import { methodWithBody, methodWithoutBody } from './utils'
import login from './login'

export function contentType(ctx, next) {
  if (methodWithBody(ctx.method)) {
    switch (ctx.type) {
      case 'form':
        ctx.body = stringify(ctx.body)
        ctx.headers['Content-Type'] =
          'application/x-www-form-urlencoded;charset=utf-8'
        break
      case 'json':
        ctx.body = JSON.stringify(ctx.body)
        ctx.headers['Content-Type'] = 'application/json;charset=utf-8'
        break
      default:
        break
    }
  }

  return next()
}

export async function checkLogin(ctx, next) {
  if (state.loggedIn) {
    return next()
  }
  let timeer = null
  if (state.logging) {
    timeer = setInterval(() => {
      console.log('等待中')
      if (state.loggedIn) {
        clearInterval(timeer)
        return next()
      }
    })
  } else {
    try {
      console.log('尝试登录')
      clearInterval(timeer)
      const res = await login()
      console.log(res)
      return next()
    } catch (error) {
      console.log('登录失败', error)
    }
  }
}

export async function http(ctx, next) {
  const res = await next()
  if (res.statusCode >= 200 && res.statusCode <= 299) {
    return res.data
  }

  return Promise.reject(res)
}

export function timeout(ctx, next) {
  if (typeof ctx.timeout === 'number') {
    if (ctx.timeout > 0 && ctx.timeout !== Infinity) {
      return Promise.race([
        next(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (
              ctx.cancelToken &&
              typeof ctx.cancelToken.abort === 'function'
            ) {
              ctx.cancelToken.abort()
            }
            reject(new Error('Timeout Error'))
          }, ctx.timeout)
        })
      ])
    }
  }

  return next()
}
