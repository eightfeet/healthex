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
  let timeer = null
  const error = '登录失败'
  switch (state.loggedIn) {
    case 0: // 未登录
      if (state.logging) { // 当前正在登录中
        timeer = setInterval(() => {
          if (state.loggedIn === 1) {
            clearInterval(timeer)
            return next()
          } else if (state.loggedIn === 2) {
            clearInterval(timeer)
            return Promise.reject(error)
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
          return Promise.reject(error)
        }
      }
      break
    case 1: // 已登录
      return next()
    case 2: // 登录失败
      return Promise.reject(error)
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
