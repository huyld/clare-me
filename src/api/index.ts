import express from 'express'
import conversation from './conversation'

const router = express.Router()
router.use('/', conversation)

export default router

