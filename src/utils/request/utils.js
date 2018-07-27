/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

const METHODS_WITHOUT_BODY = ['GET', 'DELETE', 'OPTIONS', 'HEAD'];
const METHODS_WITH_BODY = ['POST', 'PUT'];

export function isAbsoluteUrl(url) {
  return /^[a-z][a-z0-9+.-]*:/.test(url);
}

export function methodWithBody(method) {
  return METHODS_WITH_BODY.some(m => m === method);
}

export function methodWithoutBody(method) {
  return METHODS_WITHOUT_BODY.some(m => m === method);
}
