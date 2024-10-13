import { FAQ_LIST } from '../../../src/lib/constants'
import Message from '../../../src/models/Message'
import IntentService from '../../../src/services/intent'
import { Intent, SUICIDAL_KEYWORDS } from '../../../src/services/intent/constants'

describe('Intent service', () => {
  let intentService: IntentService

  beforeAll(() => {
    intentService = new IntentService()
  })

  SUICIDAL_KEYWORDS.forEach(keyword => {
    it(`should return suicidal intent if the message contains the word ${keyword}`, () => {
      const detectedIntent = intentService.getIntent({ text: `I want to ${keyword}` } as Message)
      expect(detectedIntent).toBe(Intent.SUICIDAL)
    })
  })

  it('should return FAQ intent if the message is a question from FAQ list', () => {
    const text = FAQ_LIST[0]
    const detectedIntent = intentService.getIntent({ text } as Message)
    expect(detectedIntent).toBe(Intent.FAQ)
  })
})
