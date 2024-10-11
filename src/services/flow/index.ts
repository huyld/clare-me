import Message from "../../models/Message"
import Stores from "../../store/types/Stores"

export default class FlowService {
  private stores: Stores

  constructor(stores: Stores) {
    this.stores = stores
  }

  async getContext(userId: string): Promise<Message[] | null> {
    const conversation = await this.stores.conversationStore.get(userId)
    if (conversation?.length) return conversation
    return null
  }

  async updateContext(message: Message): Promise<number> {
    return await this.stores.conversationStore.save(message)
  }
}

