/**
 * @module debug
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const colors = require('colors')
const config = require('./config')

// Set Console Colors
colors.setTheme({
  success: 'green',
  info: 'blue',
  debug: 'cyan',
  warn: 'yellow',
  error: 'red',
  update: 'gray'
})

const debugEnabled = config.get('debug')

/* nyc ignore next */
module.exports = {
  success: (message) => {
    if (debugEnabled) {
      console.log(colors.success('✔ ' + message))
    }
  },
  error: (message) => {
    if (debugEnabled) {
      console.log(colors.error('× ' + message))
    }
  },
  warn: (message) => {
    if (debugEnabled) {
      console.log(colors.warn('» ' + message))
    }
  },
  debug: (message) => {
    if (debugEnabled) {
      console.log(colors.debug('» ' + message))
    }
  },
  info: (message) => {
    if (debugEnabled) {
      console.log(colors.info('» ' + message))
    }
  },
  update: (message) => {
    if (debugEnabled) {
      console.log(colors.update('✔ ' + message))
    }
  },
  log: (message) => {
    if (debugEnabled) {
      console.log('› ' + message)
    }
  }
}
