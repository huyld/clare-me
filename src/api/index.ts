import express from 'express'
import bodyParser from 'body-parser'
import conversation from './conversation'

const router = express.Router()

const jsonMiddleware = bodyParser.json({
  limit: '200kb',
})
router.use(jsonMiddleware)
router.use('/', conversation)

export default router

