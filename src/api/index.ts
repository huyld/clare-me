import express from 'express'
import bodyParser from 'body-parser'
import conversation from './conversation'
import AuthService from '../services/auth'
import FlowService from '../services/flow'
import Stores from '../store/types/Stores'

const router = express.Router()

const jsonMiddleware = bodyParser.json({
  limit: '200kb',
})

function init(authService: AuthService, stores: Stores, flowService: FlowService) {
  router.use(jsonMiddleware)
  router.use('/', conversation(authService, stores, flowService))
  return router
}

export default init

