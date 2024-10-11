import express from 'express'
import initConversationController from './controller'
import AuthService from '../../services/auth'
import FlowService from '../../services/flow'
import Stores from '../../store/types/Stores'

const router = express.Router()

function init(authService: AuthService, stores: Stores, flowService: FlowService) {
  const conversation = initConversationController(flowService)

  router.post(
    '/sendMessage',
    authService.doAuth(),
    conversation.sendMessage,
  )

  router.get(
    '/retrieveContext/:userId',
    authService.doAuth(),
    conversation.retrieveContext,
  )

  return router
}

export default init
