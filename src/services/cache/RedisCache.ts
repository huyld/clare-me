import Redis from 'ioredis'
import Logger from '../../lib/Logger'
import { TTL_ONE_DAY } from './constants'

export default class RedisCache {
  private redisClient: Redis
  private defaultTtlSeconds: number
  private keyPrefix: string

  constructor(
    redisClient: Redis,
    keyPrefix: string,
    defaultTtlSeconds = TTL_ONE_DAY,
  ) {
    this.redisClient = redisClient
    this.keyPrefix = keyPrefix
    this.defaultTtlSeconds = defaultTtlSeconds
  }

  prefixKey(key: string) {
    return `${this.keyPrefix}${key}`
  }

  async set(key: string, value: Object, ttl = this.defaultTtlSeconds) {
    try {
      if (ttl > 0) {
        await this.redisClient.set(this.prefixKey(key), JSON.stringify(value), 'EX', ttl)
      } else {
        await this.redisClient.set(this.prefixKey(key), JSON.stringify(value))
      }
      return value
    } catch (err) {
      Logger.error(`Failed to set cache key ${this.prefixKey((key))}.`, err)
      return null
    }
  }

  async get(key: string) {
    try {
      const value = await this.redisClient.get(this.prefixKey(key))

      return value ? JSON.parse(value) : null
    } catch (err) {
      Logger.error(`Failed to get cache key ${this.prefixKey((key))}.`, err)
      return null
    }
  }

  async exists(key: string) {
    try {
      return await this.redisClient.exists(this.prefixKey(key))
    } catch (err) {
      Logger.error(`Failed to check if key exists ${this.prefixKey((key))}.`, err)
      return 0
    }
  }

  async addToList(key: string, value: string): Promise<number> {
    try {
      return await this.redisClient.rpush(this.prefixKey(key), value)
    } catch (err) {
      Logger.error(`Failed to add item to list with key ${this.prefixKey(key)}.`, err)
      return 0
    }
  }

  async listAll(key: string) {
    try {
      const result = await this.redisClient.lrange(this.prefixKey(key), 0, -1)
      return result
    } catch (err) {
      Logger.error(`Failed to extract items from list with key ${this.prefixKey(key)}.`, err)
      return null
    }
  }
}
