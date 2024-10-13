import request from 'supertest'
import app from '../../../src/app'
import { buildCache } from '../../../src/services/cache'
import { CLARE_ID } from '../../../src/lib/constants'

describe('API', () => {
  describe('POST /sendMessage', () => {
    const userId = 'test-user'
    const token = 'abc'

    beforeAll(async () => {
      const authCache = buildCache({ keyPrefix: 'auth::' })
      await authCache.set(token, 1)
    })

    test('should answer FAQ question', async () => {
      const response = await request(app)
        .post('/sendMessage')
        .set('authorization', `Bearer ${token}`)
        .send({
          from: userId,
          to: CLARE_ID,
          text: 'Is this anonymous?'
        })
        .expect('Content-Type', /text/)
        .expect(200)

        expect(response.text).toBe('Yes. Although we ask a few questions about you during sign-up (first name, age), you use the product anonymously and without any human contact. For security reasons, we are obliged to review anonymized transcripts or recordings of calls and conversations to ensure you and Clare stay safe.')
    })

    test('should reply with sensitive message when receiving suicidal message', async () => {
      const response = await request(app)
        .post('/sendMessage')
        .set('authorization', `Bearer ${token}`)
        .send({
          from: userId,
          to: CLARE_ID,
          text: 'I might hurt myself'
        })
        .expect('Content-Type', /text/)
        .expect(200)

        expect(response.text).toBe('I\'m really sorry you\'re feeling this way. Please talk to a mental health professional or contact a crisis hotline right away. Your safety is very important.')
    })
  })
})

