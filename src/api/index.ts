import express from 'express'
import bodyParser from 'body-parser'
import conversation from './conversation'
import AuthService from '../services/auth'
import Stores from '../store/types/Stores'

const router = express.Router()

const jsonMiddleware = bodyParser.json({
  limit: '200kb',
})

function init(authService: AuthService, stores: Stores) {
  router.use(jsonMiddleware)
  router.use('/', conversation(authService, stores))
  return router
}

export default init

