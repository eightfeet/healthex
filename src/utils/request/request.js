/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import extend from 'extend';
import { stringify } from 'qs';
import compose from './compose';
import { isAbsoluteUrl } from './utils';

class Request {
  options = {
    baseUrl: '',
    method: 'GET',
    headers: {},
    params: {},
  };
  middlewares = [];

  constructor(options, middlewares) {
    this.options = extend(true, this.options, options);

    if (Array.isArray(middlewares)) {
      middlewares.reverse().forEach(this.use);
    }
  }

  setHeader(key, value) {
    if (value === undefined) {
      delete this.options.headers[key];
    } else {
      this.options.headers[key] = value;
    }
  }

  use = fn => {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be a function!');
    }

    this.middlewares.unshift(fn);
  };

  request = ctx => {
    const { url, method, params, headers, baseUrl, body } = ctx;
    if (typeof url !== 'string') {
      throw new TypeError(
        `Parameter 'url' must be a string, not ${typeof url}`,
      );
    }

    const _baseUrl = isAbsoluteUrl(url) ? '' : baseUrl; // eslint-disable-line
    const concatSymbol = url.indexOf('?') > -1 ? '&' : '?';
    const queryString = stringify(params);

    return new Promise((resolve, reject) => {
      ctx.cancelToken = wx.request({
        // eslint-disable-line
        url: `${_baseUrl || ''}${url}${queryString && concatSymbol + queryString}`,
        method,
        header: headers,
        data: body,

        success: resolve,
        fail: reject,
      });
    });
  };

  fetch = (url, options) => {
    const fn = compose(this.middlewares);
    const ctx = extend(true, {}, this.options, options, { url });
    return fn(ctx, this.request);
  };

  get = (url, options) =>
    this.fetch(url, extend(options, { method: 'GET' }));

  delete = (url, options) =>
    this.fetch(url, extend(options, { method: 'DELETE' }));

  post = (url, payload, options) =>
    this.fetch(url, extend(options, { method: 'POST', body: payload }));

  put = (url, payload, options) =>
    this.fetch(url, extend(options, { method: 'PUT', body: payload }));
}

export default Request;
