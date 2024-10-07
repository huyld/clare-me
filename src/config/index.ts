import PRODUCTION from './production'
import NON_PRODUCTION from './non-production'

const env = process.env.NODE_ENV || 'development'
export const config = env === 'production' ? PRODUCTION : NON_PRODUCTION

