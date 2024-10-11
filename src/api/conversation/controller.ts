import { Request, Response } from "express";
import { v4 as uuid } from 'uuid'
import FlowService from "../../services/flow";
import Message from "../../models/Message";

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

    res.send('This endpoint is still under construction.')
  }
})

export default init
