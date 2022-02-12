let endpoint = ''

if (process.env.NEXT_PUBLIC_VERCEL_URL?.includes('localhost')) {
  endpoint = 'http://localhost:3000'
} else if (process.env.NEXT_PUBLIC_VERCEL_URL !== undefined) {
  endpoint = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
} else {
  endpoint = 'http://localhost:3000'
}

const _CACHE = {}

export function useData(key, fetcher) {
  if (!_CACHE[key]) {
    let data
    let promise
    _CACHE[key] = () => {
      if (data !== undefined) return data
      if (!promise) {
        promise = fetcher(endpoint + key)
          .then((r) => {
            return (data = r)
          }, console.error)
      }
      throw promise
    }
  }
  const fn = _CACHE[key]
  return fn()
}

