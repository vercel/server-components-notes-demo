const cache = {}

export function useData(key, fetcher) {
  if (!cache[key]) {
    let data
    let promise
    cache[key] = () => {
      if (data !== undefined) return data
      if (!promise) promise = fetcher(key).then((r) => (data = r))
      throw promise
    }
  }
  return cache[key]()
}
