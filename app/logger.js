/**
 * @module logger
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import config from './config'
import logger from 'logzio-nodejs'

let log

if (config.get('env') !== 'test') {
  log = logger.createLogger({
    token: config.get('logzio.token'),
    type: config.get('logzio.type'),
    debug: config.get('logzio.debug')
  })
} else {
  log = {
    debug: () => {
      return true
    },
    error: () => {
      return true
    },
    info: () => {
      return true
    },
    log: () => {
      return true
    },
    warn: () => {
      return true
    }
  }
}

export default log
