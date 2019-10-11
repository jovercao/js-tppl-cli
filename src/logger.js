
const log4js = require('log4js')
const path = require('path')
let logger

module.exports = function ({ enabled, logPath } = { enabled: false, logPath: 'logs/tppl.log' }) {
  if (logger) {
    return logger
  }

  if (!logPath) {
    logPath = 'logs/tppl.log'
  }

  if (!path.isAbsolute(logPath)) {
    logPath = path.resolve(process.cwd(), logPath)
  }

  const logCfg = {
    appenders: {
      logfile: {
        type: 'file',
        filename: logPath
      },
      console: {
        type: 'console',
        category: 'console'
      }
    },
    replaceConsole: 'true',
    categories: {
      default: {
        appenders: [
          'console'
        ],
        level: 'info'
      }
    }
  }

  if (enabled) {
    logCfg.categories.default.appenders.push('logfile')
  }

  log4js.configure(logCfg)

  logger = log4js.getLogger()
  return logger
}
