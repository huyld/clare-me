import express, { Express } from 'express'
import Logger from './lib/Logger'
import routes from './api'
import AuthService from './services/auth'
import { buildCache } from './services/cache'


process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const authCache = buildCache('auth::')
const authService = new AuthService(authCache)
const app: Express = express()

// Routes
app.use('/', routes(authService))

export default app
