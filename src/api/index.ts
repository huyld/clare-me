import express from 'express'
import bodyParser from 'body-parser'
import conversation from './conversation'
import AuthService from '../services/auth'

const router = express.Router()

const jsonMiddleware = bodyParser.json({
  limit: '200kb',
})
function init(authService: AuthService) {
  router.use(jsonMiddleware)
  router.use('/', conversation(authService))
  return router
}

export default init

