import express, { Express } from 'express'
import Logger from './lib/Logger'
import routes from './api'


process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const app: Express = express()

// Routes
app.use('/', routes)

export default app
