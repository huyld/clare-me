import Redis from 'ioredis'
import RedisCache from './RedisCache'
import { config } from '../../config'
import Logger from '../../lib/Logger'

const cacheRedis = new Map()

const buildCache = (keyPrefix: string, redisUrl = 'default') => {
  const redisUrlToUse = (redisUrl === 'default' || redisUrl === undefined) ? config.cacheConfig.redisUrl : redisUrl
  const redisHost = redisUrlToUse.split(':')[1].slice(2)// || 'localhost'
  const redisPort = redisUrlToUse.split(':')[2]// || '6379'

  if (!cacheRedis.has(redisUrl)) {
    try {
      const redisConnection = new Redis(
        Number(redisPort),
        redisHost,
      )
      cacheRedis.set(redisUrl, redisConnection)
    } catch (err) {
      Logger.error(`Failed to connect to Redis at ${redisUrl}.`, err)
    }
  }

  return new RedisCache(cacheRedis.get(redisUrl), keyPrefix)
}

export {
  buildCache,
}
