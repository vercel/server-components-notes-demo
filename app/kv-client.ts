import { kv as vercelKv } from '@vercel/kv'

const hasKvConfig =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

export const kv = hasKvConfig
  ? vercelKv
  : {
      hgetall: async () => ({}),
      hset: async () => {},
      hget: async () => null
    }
