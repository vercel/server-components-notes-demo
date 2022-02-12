if (process.env.NEXT_PUBLIC_VERCEL_URL?.includes('localhost')) {
  endpoint = 'http://localhost:3000'
} else if (process.env.NEXT_PUBLIC_VERCEL_URL !== undefined) {
  endpoint = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
} else {
  endpoint = 'http://localhost:3000'
}

const cache = {}
let endpoint = ''

export function useData(key, fetcher) {
  if (!cache[key]) {
    let data
    let promise
    cache[key] = () => {
      if (data !== undefined) return data
      if (!promise) promise = fetcher(endpoint + key).then((r) => (data = r), console.error)
      throw promise
    }
  }
  return cache[key]()
}

