import { CLARE_ID } from '../lib/constants'
import Logger from '../lib/Logger'
import Message from '../models/Message'
import RedisCache from '../services/cache/RedisCache'


export default class ConversationStore {
  cache: RedisCache

  constructor(cache: RedisCache) {
    this.cache = cache
  }

  /**
   * Get the ID of the user Clare is having conversation with
   */
  private getSenderId(message: Message): string {
    if (message.from === CLARE_ID) return message.to
    else if (message.to === CLARE_ID) return message.from

    return 'Unknown'
  }

  async get(key: string) {
    const messages = await this.cache.listAll(key)
    if (Array.isArray(messages) && messages.length) {
      try {
        const conversation = messages.map(msg => JSON.parse(msg) as Message)
        return conversation
      } catch (err) {
        Logger.error(`Failed to get messages for conversation ${key}.`, err)
        return null
      }
    }
  }

  async save(item: Message): Promise<number> {
    const senderId = this.getSenderId(item)
    const conversationSize = await this.cache.addToList(senderId, JSON.stringify(item))
    return conversationSize
  }
}
