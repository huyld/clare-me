import express from 'express'
import AuthService from '../services/auth'

const router = express.Router()

function init(authService: AuthService) {
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

      res.send('This endpoint is still under construction.')
    },
  )

  return router
}

export default init
