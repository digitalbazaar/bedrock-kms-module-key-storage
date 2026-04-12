/*!
 * Copyright (c) 2019-2026 Digital Bazaar, Inc. All rights reserved.
 */
import {LruCache} from '@digitalbazaar/lru-memoize';

export {KeyStorage} from './KeyStorage.js';

// see lru-memoize for cache config docs
export function createKeyRecordCache(cacheConfig) {
  // coerce `maxSize` w/o `sizeCalculation` to `max`
  if(cacheConfig.maxSize !== undefined &&
    cacheConfig.sizeCalculation === undefined) {
    cacheConfig = {...cacheConfig, max: cacheConfig.maxSize};
    delete cacheConfig.maxSize;
  }

  // coerce `maxAge` to `ttl` in `cacheConfig`
  if(cacheConfig.maxAge !== undefined) {
    cacheConfig = {...cacheConfig, ttl: cacheConfig.maxAge};
    delete cacheConfig.maxAge;
  }

  return new LruCache(cacheConfig);
}
