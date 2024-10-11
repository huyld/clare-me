import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { get } from 'lodash'
import FlowService from '../../services/flow'
import Message from '../../models/Message'
import Logger from '../../lib/Logger'

const init = (flowService: FlowService) => ({
  sendMessage: async (req: Request, res: Response) => {
    // TODO: Classify messages and handle flows.

    try {
      const body = req.body
      const message = {
        id: uuid(),
        from: body.from,
        to: 'clare',
        text: body.text,
        createdAt: Date.now(),
      } as Message
      await flowService.updateContext(message)
      const response = await flowService.generateResponse(message)

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
      res.status(200).send()
    } catch(err) {
      Logger.error(`Failed to update context.`, err)
      res.status(500).send('Error when updating context')
    }
  }
})

export default init
