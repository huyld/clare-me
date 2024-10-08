import { createLogger, transports, format } from 'winston'

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'warn'

const logger = createLogger({
  transports: [
    new transports.Console({
      level: level,
      format: format.combine(
        format.errors({ stack: true }),
        level === 'debug' ? format.json() : format.prettyPrint(),
      ),
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }))
}

export default logger
