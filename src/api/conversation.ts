import express from 'express'
import { v4 as uuid } from 'uuid'
import AuthService from '../services/auth'
import Message from '../models/Message'
import Stores from '../store/types/Stores'

const router = express.Router()

function init(authService: AuthService, stores: Stores) {
  router.get(
    '/',
    async (req, res) => {
      res.send('Test endpoint')
    },
  )

  router.post(
    '/sendMessage',
    authService.doAuth(),
    async (req, res) => {
      // TODO: Classify messages and handle flows.
      const body = req.body
      const message = {
        id: uuid(),
        from: body.from,
        to: 'clare',
        text: body.text,
        createdAt: Date.now(),
      } as Message
      await stores.conversationStore.save(message)

      res.send('This endpoint is still under construction.')
    },
  )

  return router
}

export default init
