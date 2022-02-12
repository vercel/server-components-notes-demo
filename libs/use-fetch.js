const cache = {}
const endpoint = process.env.NEXT_PUBLIC_VERCEL_URL

export function useData(key, fetcher) {
  if (!cache[key]) {
    let data
    let promise
    cache[key] = () => {
      if (data !== undefined) return data
      if (!promise) promise = fetcher(endpoint + key).then((r) => (data = r))
      throw promise
    }
  }
  return cache[key]()
}

