/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import { stringify } from 'qs'
import extend from 'extend'
import request from './request'
import state from '../globalData'
import { methodWithBody } from './utils'
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
  const { url, ...options } = extend(true, {}, ctx)
  const error = `由于程序登录失败，当前接口${url}可能无法正常调用`
  switch (state.loggedIn) {
    case 0: // 未登录
      if (state.logging) { // 当前正在登录中
        const delay = 100
        const requestId = state.requestQueue += 1
        const daly = new Promise((resolve, reject) => {
          timeer = setInterval(() => {
            if (state.loggedIn === 1) {
              clearInterval(timeer)
              resolve(next)
            } else if (state.loggedIn === 2) {
              clearInterval(timeer)
              reject(error)
            }
          })
        })
        daly.then((next) => {
          setTimeout(() => {
            console.log('完成登录', `请求ID${requestId}`, `队列总数${state.requestQueue}`)
            return next()
          }, delay * requestId)
        }).catch(error => {
          setTimeout(() => {
            console.warn(error)
            return next()
          }, delay * requestId)
        })
      } else {
        try {
          console.log('尝试登录')
          clearInterval(timeer)
          await login()
          return next()
        } catch (error) {
          return next()
        }
      }
      break
    case 1: // 已登录
      const res = await next()
      if (res.statusCode === 401) {
        state.loggedIn = 0
        return request.fetch(url, options)
      }
      return res.data
    case 2: // 登录失败
      return next()
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
