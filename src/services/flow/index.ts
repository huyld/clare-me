import { get } from 'lodash'
import { DEFAULT_RESPONSE_SUICIDAL_INTENT } from './constants'
import { FAQ } from '../../lib/constants'
import Message from '../../models/Message'
import Stores from '../../store/types/Stores'
import IntentService from '../intent'
import { Intent } from '../intent/constants'

export default class FlowService {
  private stores: Stores
  private intentService: IntentService

  constructor(stores: Stores, intentService: IntentService) {
    this.stores = stores
    this.intentService = intentService
  }

  async getContext(userId: string): Promise<Message[] | null> {
    const conversation = await this.stores.conversationStore.get(userId)
    if (conversation?.length) return conversation
    return null
  }

  async updateContext(message: Message): Promise<number> {
    return await this.stores.conversationStore.save(message)
  }

  async generateResponse(message: Message): Promise<string> {
    const intent = this.intentService.getIntent(message)
    const msgText = message.text

    let response = 'Sorry I cannot understand that. Could you please say it again?'

    switch (intent) {
      case Intent.FAQ: {
        response = get(FAQ, msgText, response)
        break
      }
      case Intent.SUICIDAL: {
        response = DEFAULT_RESPONSE_SUICIDAL_INTENT
        break
      }
      default: {
      }
    }

    return response
  }
}

