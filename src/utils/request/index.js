/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import Request from './request';
import * as middlewares from './middleware';

const inst = new Request({
  type: 'json',
  baseUrl: 'https://yygj.by-health.com/weapp_api/'
}, [
  middlewares.checkLogin,
  middlewares.contentType,
  middlewares.http,
  middlewares.timeout,
]);

export default inst;
export {
  Request,
};
export {
  middlewares,
};
