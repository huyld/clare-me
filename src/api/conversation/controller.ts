import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import FlowService from '../../services/flow'
import Message from '../../models/Message'

const init = (flowService: FlowService) => ({
  sendMessage: async (req: Request, res: Response) => {
    // TODO: Classify messages and handle flows.
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
  }
})

export default init
