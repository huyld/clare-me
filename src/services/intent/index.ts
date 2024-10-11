import { Intent, SUICIDAL_KEYWORDS } from "./constants"
import Message from "../../models/Message"
import { FAQ_LIST } from "../../lib/constants"

export default class IntentService {
  getIntent(msg: Message): Intent {
    const text = msg.text
    if (SUICIDAL_KEYWORDS.some(word => text.includes(word))) {
      return Intent.SUICIDAL
    }

    if (FAQ_LIST.some(question => text.includes(question))) {
      return Intent.FAQ
    }

    return Intent.NORMAL
  }
}
