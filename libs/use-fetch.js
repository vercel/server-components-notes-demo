let endpoint = ''

if (process.env.NEXT_PUBLIC_VERCEL_URL?.includes('localhost')) {
  endpoint = 'http://localhost:3000'
} else if (process.env.NEXT_PUBLIC_VERCEL_URL !== undefined) {
  endpoint = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
} else {
  endpoint = 'http://localhost:3000'
}

const _CACHE = {}

export function useData(key, fetcher, opts = {}) {
  const now = Date.now()
  function mutate() {
    _CACHE[key].isValidating = true
    return fetcher(endpoint + key)
      .then(
        (r) => {
          _CACHE[key].isValidating = false
          _CACHE[key].timestamp = Date.now()
          _CACHE[key].data = r
          return r
        }, 
        (err) => {
          _CACHE[key].isValidating = false
          console.error(err)
        }
      )
    
  }

  const createFetcher = () => () => {
    const { data, isValidating, promise } = _CACHE[key]
    if (data !== undefined && !isValidating) {
      return data
    }
    if (!promise) {
      _CACHE[key].promise = mutate()
    }
    throw _CACHE[key].promise
  }

  if (!_CACHE[key]) {
    _CACHE[key] = {
      data: undefined,
      promise: null,
      timestamp: 0,
      isValidating: false,
    }
    _CACHE[key].fn = createFetcher()
  } else {    
    if (opts.revalidate) {
      const timeDiff = now - _CACHE[key].timestamp
      
      // revalidate
      if (timeDiff > opts.revalidate * 1000) {
        _CACHE[key].data = undefined
        _CACHE[key].promise = undefined
      }
    }
  }

  return _CACHE[key].fn()
}

