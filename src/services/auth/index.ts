import { Request, Response, NextFunction } from 'express'
import RedisCache from '../cache/RedisCache'
import Logger from '../../lib/Logger'

const AUTH_METHOD = 'Bearer'

export default class AuthService {
  public cache

  constructor(cache: RedisCache) {
    this.cache = cache
  }

  doAuth() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        res.status(401).send('No Authorization header present')
        return
      }
      if (!(authHeader.indexOf(AUTH_METHOD) === 0)) {
        res.status(401).send('Authorization method must be Bearer')
        return
      }
      const token = authHeader.substring(AUTH_METHOD.length, authHeader.length).trim()

      // Very simple authentication logicassuming,
      // assuming when user logged in, a token is generated and put in cache
      try {
        const cachedToken = await this.cache.exists(token)
        if (!cachedToken) {
          res.status(401).send('No valid authorization token present')
          return
        }
      } catch(err) {
        Logger.error('Failed to validate token', err)
      }

      return next()
    }
  }
}
