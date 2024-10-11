import express, { Express } from 'express'
import Logger from './lib/Logger'
import routes from './api'
import AuthService from './services/auth'
import FlowService from './services/flow'
import storesInit from './store'
import { buildCache } from './services/cache'
import IntentService from './services/intent'


process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const authCache = buildCache({ keyPrefix: 'auth::' })
const authService = new AuthService(authCache)
const stores = storesInit()
const intentService = new IntentService()
const flowService = new FlowService(stores, intentService)
const app: Express = express()

// Routes
app.use('/', routes(authService, stores, flowService))

export default app
