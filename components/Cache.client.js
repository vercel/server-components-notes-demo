import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {createFromFetch} from 'react-server-dom-webpack';

const cache = new Map();
// function createResponseCache() {
//   return new Map();
// }

export function useRefresh() {
  // const refreshCache = unstable_useCacheRefresh();
  return function refresh(key, seededResponse) {
    // refreshCache(createResponseCache, new Map([[key, seededResponse]]));
    cache.clear()
    cache.set(key, seededResponse)
    // console.log(key, seededResponse)
  };
}

export function useServerResponse(location) {
  const key = JSON.stringify(location);
  // const cache = unstable_getCacheForType(createResponseCache);
  let response = cache.get(key);
  if (response) {
    return response;
  }
  response = createFromFetch(
    fetch(
      // 'http://localhost:3000' +
      'https://next-server-components.vercel.app' +
      '/api/react.server?location=' + encodeURIComponent(key)
    )
  );
  cache.set(key, response);
  return response;
}
