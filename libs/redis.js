const Redis = require('ioredis')

export default new Redis(process.env.REDIS_URL)
