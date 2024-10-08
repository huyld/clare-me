import express from 'express'

const router = express.Router()

router.get(
  '/',
  async (req, res) => {
    res.send('Test endpoint')
  },
)

router.post(
  '/sendMessage',
  async (req, res) => {
    // TODO: Classify messages and handle flows.
    const message = req.body

    res.send('This endpoint is still under construction.')
  },
)

export default router

