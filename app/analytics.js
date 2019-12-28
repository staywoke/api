/**
 * @module analytics
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const async = require('async')
const request = require('request')

const config = require('./config')

const Analytics = {
  trackEvent: (apikey, category, action, label, value) => {
    if (config.get('devFlags.enableBugTracking') && config.get('analytics')) {
      // Convert Objects to String
      if (typeof category === 'object') {
        category = JSON.stringify(category)
      }

      if (typeof action === 'object') {
        action = JSON.stringify(action)
      }

      if (typeof label === 'object') {
        label = JSON.stringify(label)
      }

      // Remove API Key from Params
      label = label.replace('apikey=' + apikey, '').replace('"apikey":"' + apikey + '",', '').replace('"apikey":"' + apikey + '"', '')

      const data = {
        v: '1',
        tid: config.get('analytics'),
        cid: apikey || '49A50B59-BBD7-EC84-FD97-C0AA262B0F16',
        t: 'event',
        ec: category,
        ea: action,
        el: label,
        ev: value
      }

      const requests = [{
        url: 'http://www.google-analytics.com/collect',
        method: 'POST',
        form: data
      }]

      /* nyc ignore next */
      if (config.get('env') !== 'test') {
        async.map(requests, (fetch) => {
          request(fetch)
        })
      }

      return requests
    }
  }
}

module.exports = Analytics
