import dotenv from 'dotenv'
dotenv.config()

import Logger from './lib/Logger'
import app from './app'

const port = process.env.PORT

app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`)
  })
  .on('error', (e) => Logger.error(e))
