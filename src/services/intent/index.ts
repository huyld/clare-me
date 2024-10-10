import Message from "../../models/Message"

const SUICIDAL_KEYWORDS = [
  'kill', 'hurt', 'die'
]

const FAQ_LIST = [
  "How do I get started with the product?",
  "Can Clare help me with emotional problems, such as anxiety?",
  " Is this anonymous?",
  "Can I call anytime? ",
  "It's my first time with a virtual assistant, how should I behave? ",
  "Does Clare offer psychotherapy?",
  "Is Clare the right solution for me?",
  "Can talking to Clare replace my traditional therapy? ",
  "Why does clare&me not provide support for suicide and suicidal tendencies?",
  "Where can I leave a review?",
  "What is clare&me?",
  "Is Clare a human? ",
  "How does it work?",
  "What can Clare do?",
  "Can I speak to Clare as I would with a human being? ",
  "Are there any useful commands Clare understands, that will improve our communication? ",
  "What are the costs of talking to Clare?",
  "How can I cancel my subscription?",
  "How can I edit my payment details? I used a PayPal account.",
  "How can I edit my payment details? I don't have a PayPal account.",
]

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
