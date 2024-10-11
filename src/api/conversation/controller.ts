import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { get } from 'lodash'
import FlowService from '../../services/flow'
import Message from '../../models/Message'
import Logger from '../../lib/Logger'
import { CLARE_ID } from '../../lib/constants'
import { INITIAL_CHECKIN_MESSAGE } from '../../services/flow/constants'

const init = (flowService: FlowService) => ({
  sendMessage: async (req: Request, res: Response) => {

    try {
      const body = req.body
      const message = {
        id: uuid(),
        from: body.from,
        to: CLARE_ID,
        text: body.text,
        createdAt: Date.now(),
      } as Message
      await flowService.updateContext(message)

      // Add the response to context
      const response = await flowService.generateResponse(message)
      const responseMessage = {
        id: uuid(),
        from: CLARE_ID,
        to: body.from,
        text: response,
        createdAt: Date.now(),
      } as Message
      await flowService.updateContext(responseMessage)

      res.send(response)
    } catch (err) {
      Logger.error('An error occured when processing incoming message.', err)
      res.status(500).send('An error occured when processing the request.')
    }
  },

  retrieveContext: async (req: Request, res: Response) => {
    const userId = req.params.userId
    if (!userId) {
      res.status(404).send('No context found for requested user.')
    }

    const context = await flowService.getContext(userId)
    if (context?.length) {
      res.status(200).send(JSON.stringify(context))
    } else {
      res.status(200).send(JSON.stringify([]))
    }
  },

  updateContext: async (req: Request, res: Response) => {
    const body = req.body
    try {
      const message = {
        id: get(body, 'id', uuid()),
        from: body.from,
        to: body.to,
        text: body.text,
        createdAt: Date.now(),
      } as Message
      await flowService.updateContext(message)
      res.status(200).send('Context updated.')
    } catch(err) {
      Logger.error(`Failed to update context.`, err)
      res.status(500).send('Error when updating context')
    }
  },

  initiateCheckIn: async (req: Request, res: Response) => {
    const receiverId = get(req, 'body.to')
    if (!receiverId) res.status(400).send('Bad request. Expect request body to have the format of { to: <receiverId> }.')

    try {
      const responseMessage = {
        id: uuid(),
        from: CLARE_ID,
        to: receiverId,
        text: INITIAL_CHECKIN_MESSAGE,
        createdAt: Date.now(),
      } as Message
      await flowService.updateContext(responseMessage)

      res.send(INITIAL_CHECKIN_MESSAGE)
    } catch (err) {
      Logger.error('An error occured when initiating check-in flow.', err)
      res.status(500).send('An error occured when initiating check-in flow.')
    }
  },
})

export default init
