/**
 * @module external
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const md5 = require('md5')
const Promise = require('bluebird')

const config = require('./config')
const logger = require('./logger')
const redisClient = require('./redis')

var redisCacheExpires = config.get('redis.cacheExpire')

/* nyc ignore next */
module.exports = {
  /**
   * Get External Content
   * @param {string} url - URL of Content to Fetch
   * @returns {bluebird|exports|module.exports}
   */
  getContent: (url) => {
    const cacheKey = md5(url)

    return new Promise((resolve, reject) => {
      redisClient.get(cacheKey, (err, result) => {
        if (!err && result) {
          resolve(result)
        } else {
          const lib = url.startsWith('https') ? require('https') : require('http')
          const request = lib.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error(`Failed to load page, status code: ${response.statusCode}`))
              logger.log(`Failed to load ${url}, status code: ${response.statusCode}`)
            }

            const body = []

            response.on('data', (chunk) => {
              body.push(chunk)
            })
            response.on('end', () => {
              let content = body.join('')

              if (typeof content === 'object') {
                content = JSON.stringify(content)
              }

              if (!err) {
                redisClient.setex(cacheKey, redisCacheExpires, content)
              } else {
                logger.log(`Redis Error: ${err.code}`)
              }

              resolve(content)
            })
          })

          request.on('error', (err) => {
            reject(err)
          })
        }
      })
    })
  }
}
