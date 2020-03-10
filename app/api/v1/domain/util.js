/**
 * @module domain/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

/**
 * Doing domain utilities
 * @type {Object}
 */
module.exports = {
  /**
   * States are not going to change, so doing a database lookup is not necessary 100% of the time
   * @param {string} abbr
   */
  getStateByID (abbr) {
    const mapping = {
      AL: {
        id: 1,
        name: 'Alabama'
      },
      AK: {
        id: 2,
        name: 'Alaska'
      },
      AS: {
        id: 3,
        name: 'American Samoa'
      },
      AZ: {
        id: 4,
        name: 'Arizona'
      },
      AR: {
        id: 5,
        name: 'Arkansas'
      },
      CA: {
        id: 6,
        name: 'California'
      },
      CO: {
        id: 7,
        name: 'Colorado'
      },
      CT: {
        id: 8,
        name: 'Connecticut'
      },
      DE: {
        id: 9,
        name: 'Delaware'
      },
      DC: {
        id: 10,
        name: 'District of Columbia'
      },
      FL: {
        id: 11,
        name: 'Florida'
      },
      GA: {
        id: 12,
        name: 'Georgia'
      },
      GU: {
        id: 13,
        name: 'Guam'
      },
      HI: {
        id: 14,
        name: 'Hawaii'
      },
      ID: {
        id: 15,
        name: 'Idaho'
      },
      IL: {
        id: 16,
        name: 'Illinois'
      },
      IN: {
        id: 17,
        name: 'Indiana'
      },
      IA: {
        id: 18,
        name: 'Iowa'
      },
      KS: {
        id: 19,
        name: 'Kansas'
      },
      KY: {
        id: 20,
        name: 'Kentucky'
      },
      LA: {
        id: 21,
        name: 'Louisiana'
      },
      ME: {
        id: 22,
        name: 'Maine'
      },
      MD: {
        id: 23,
        name: 'Maryland'
      },
      MA: {
        id: 24,
        name: 'Massachusetts'
      },
      MI: {
        id: 25,
        name: 'Michigan'
      },
      MN: {
        id: 26,
        name: 'Minnesota'
      },
      MS: {
        id: 27,
        name: 'Mississippi'
      },
      MO: {
        id: 28,
        name: 'Missouri'
      },
      MT: {
        id: 29,
        name: 'Montana'
      },
      NE: {
        id: 30,
        name: 'Nebraska'
      },
      NV: {
        id: 31,
        name: 'Nevada'
      },
      NH: {
        id: 32,
        name: 'New Hampshire'
      },
      NJ: {
        id: 33,
        name: 'New Jersey'
      },
      NM: {
        id: 34,
        name: 'New Mexico'
      },
      NY: {
        id: 35,
        name: 'New York'
      },
      NC: {
        id: 36,
        name: 'North Carolina'
      },
      ND: {
        id: 37,
        name: 'North Dakota'
      },
      MP: {
        id: 38,
        name: 'Northern Mariana Islands'
      },
      OH: {
        id: 39,
        name: 'Ohio'
      },
      OK: {
        id: 40,
        name: 'Oklahoma'
      },
      OR: {
        id: 41,
        name: 'Oregon'
      },
      PA: {
        id: 42,
        name: 'Pennsylvania'
      },
      PR: {
        id: 43,
        name: 'Puerto Rico'
      },
      RI: {
        id: 44,
        name: 'Rhode Island'
      },
      SC: {
        id: 45,
        name: 'South Carolina'
      },
      SD: {
        id: 46,
        name: 'South Dakota'
      },
      TN: {
        id: 47,
        name: 'Tennessee'
      },
      TX: {
        id: 48,
        name: 'Texas'
      },
      UM: {
        id: 49,
        name: 'United States Minor Outlying Islands'
      },
      UT: {
        id: 50,
        name: 'Utah'
      },
      VT: {
        id: 51,
        name: 'Vermont'
      },
      VI: {
        id: 52,
        name: 'Virgin Islands, U.S.'
      },
      VA: {
        id: 53,
        name: 'Virginia'
      },
      WA: {
        id: 54,
        name: 'Washington'
      },
      WV: {
        id: 55,
        name: 'West Virginia'
      },
      WI: {
        id: 56,
        name: 'Wisconsin'
      },
      WY: {
        id: 57,
        name: 'Wyoming'
      }
    }

    return mapping[abbr]
  },

  /**
   * Takes a string of comma-separated numbers, e.g. "1,5,7", splits by comma and returns an array of integers, pruning out anything that's not an integer
   * @param  {string} str Comma-separated numbers
   * @return {array}
   */
  normalizeCommaSeparatedIntegers (str) {
    const ints = _.compact(_.map(str.split(','), (raw) => {
      const num = parseInt(_.trim(raw), 10)
      /* istanbul ignore else */
      if (_.isNumber(num)) {
        return num
      } else {
        return null
      }
    }))

    return ints && ints.length ? ints : null
  },

  /**
   * Custom Function to Parse Boolean from CSV File
   * @param {*} val
   */
  parseBoolean (val) {
    if (typeof val === 'number') {
      if (val === 0) {
        return false
      } else if (val === 1) {
        return true
      }
    } else if (typeof val === 'string') {
      if (val.trim() === '0' || val.trim().toUpperCase() === 'N' || val.trim().toUpperCase() === 'NO') {
        return false
      } else if (val.trim() === '1' || val.trim().toUpperCase() === 'Y' || val.trim().toUpperCase() === 'YES') {
        return true
      }
    }

    return null
  },

  /**
   * Custom Function to Parse Email from CSV File
   * @param {*} val
   */
  parseEmail (val) {
    if (typeof val === 'string') {
      // eslint-disable-next-line no-useless-escape
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(val) ? val.toLowerCase() : null
    }

    return null
  },

  /**
   * Custom Function to Parse Float from CSV File
   * @param {*} val
   */
  parseFloat (val) {
    if (typeof val === 'number') {
      return parseFloat(val)
    } else if (typeof val === 'string') {
      return parseFloat(val.trim().replace('$', '').replace(/,/g, ''))
    }

    return null
  },

  /**
   * Custom Function to Parse Int from CSV File
   * @param {*} val
   */
  parseInt (val) {
    if (typeof val === 'number') {
      return parseInt(val)
    } else if (typeof val === 'string') {
      return parseInt(val.trim().replace('$', '').replace(/,/g, ''))
    }

    return null
  },

  /**
   * Custom Function to Parse Phone from CSV File
   * @param {*} val
   */
  parsePhone (val) {
    if (typeof val === 'string') {
      const pattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
      return pattern.test(val) ? val : null
    }

    return null
  },

  /**
   * Custom Function to Parse String from CSV File
   * @param {*} val
   */
  parseString (val) {
    if (typeof val === 'number') {
      return val.toString()
    } else if (typeof val === 'string') {
      return (val.trim() !== '') ? val.trim() : null
    }

    return null
  },

  /**
   * Custom Function to Parse URL from CSV File
   * @param {*} val
   */
  parseURL (val) {
    if (typeof val === 'string') {
      try {
        // eslint-disable-next-line no-new
        new URL(val)
        return val
      } catch (_) {
        return null
      }
    }

    return null
  },

  /**
   * Sort Object by Keys
   * @param obj
   * @returns {Object}
   */
  sortByKeys (obj) {
    const keys = Object.keys(obj)
    const sortedKeys = _.sortBy(keys)

    return _.fromPairs(
      _.map(
        sortedKeys,
        (key) => {
          return [key, obj[key]]
        }
      )
    )
  },

  /**
   * Convert String to Title Case
   * @param str
   * @param stripDashes
   * @returns {string}
   */
  /* istanbul ignore next: not currently used */
  titleCase (str, stripDashes) {
    if (typeof str === 'string') {
      if (stripDashes) {
        str = str.replace(/-/g, ' ')
      }

      return str.trim().replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    }

    return null
  }
}
