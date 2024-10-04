import express, { Express } from 'express'
import dotenv from 'dotenv'
import Logger from './lib/Logger'
import routes from './api'

dotenv.config()

process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const app: Express = express()

// Routes
app.use('/', routes)

export default app
