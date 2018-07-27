/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

function compose(middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  if (middlewares.some(fn => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be composed of functions!');
  }

  return function dispatch(context, done) {
    let index = -1;

    function next(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      let fn = middlewares[i];
      if (i === middlewares.length) fn = done;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, () => next(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return next(0);
  };
}

export default compose;
