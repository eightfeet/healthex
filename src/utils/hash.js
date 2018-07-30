/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import md5 from 'blueimp-md5'

export function signature(params, secret) {
  const token = Object.keys(params)
    .sort()
    .reduceRight(
      (acc, key) => `${key}${params[key]}${acc}`,
      `serverSecret${secret}`,
    )
  return md5(token).toUpperCase()
}

export { md5 }
