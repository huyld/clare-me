import { buildCache } from '../services/cache';
import { TTL_ONE_DAY } from '../services/cache/constants';
import ConversationStore from './conversation';
import Stores from './types/Stores';

const conversationCache = buildCache({ keyPrefix: 'conversation::', ttl: TTL_ONE_DAY })

export default function init(): Stores {
  const conversationStore = new ConversationStore(conversationCache)

  return {
    conversationStore,
  }
}
