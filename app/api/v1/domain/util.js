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
  createSlug (string) {
    const chars = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const replace = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const pattern = new RegExp(chars.split('').join('|'), 'g')

    return string.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(pattern, match => replace.charAt(chars.indexOf(match)))
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '') // eslint-disable-line no-useless-escape
      .replace(/\-\-+/g, '-') // eslint-disable-line no-useless-escape
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  },

  getGrade (score) {
    if (typeof score !== 'number') {
      return null
    }

    if (score > 100) {
      score = 100
    }

    if (score < 0) {
      score = 0
    }

    if (score <= 29) {
      return {
        letter: 'F-',
        marker: 'f-minus',
        class: 'f-minus'
      }
    } else if (score <= 59 && score >= 30) {
      return {
        letter: 'F',
        marker: 'f',
        class: 'f'
      }
    } else if (score <= 62 && score >= 60) {
      return {
        letter: 'D-',
        marker: 'd-minus',
        class: 'd'
      }
    } else if (score <= 66 && score >= 63) {
      return {
        letter: 'D',
        marker: 'd',
        class: 'd'
      }
    } else if (score <= 69 && score >= 67) {
      return {
        letter: 'D+',
        marker: 'd-plus',
        class: 'd'
      }
    } else if (score <= 72 && score >= 70) {
      return {
        letter: 'C-',
        marker: 'c-minus',
        class: 'c'
      }
    } else if (score <= 76 && score >= 73) {
      return {
        letter: 'C',
        marker: 'c',
        class: 'c'
      }
    } else if (score <= 79 && score >= 77) {
      return {
        letter: 'C+',
        marker: 'c-plus',
        class: 'c'
      }
    } else if (score <= 82 && score >= 80) {
      return {
        letter: 'B-',
        marker: 'b-minus',
        class: 'b'
      }
    } else if (score <= 86 && score >= 83) {
      return {
        letter: 'B',
        marker: 'b',
        class: 'b'
      }
    } else if (score <= 89 && score >= 87) {
      return {
        letter: 'B+',
        marker: 'b-plus',
        class: 'b'
      }
    } else if (score <= 92 && score >= 90) {
      return {
        letter: 'A-',
        marker: 'a-minus',
        class: 'a'
      }
    } else if (score <= 97 && score >= 93) {
      return {
        letter: 'A',
        marker: 'a',
        class: 'a'
      }
    } else if (score >= 98) {
      return {
        letter: 'A+',
        marker: 'a-plus',
        class: 'a'
      }
    }
  },

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

    return mapping[abbr.toUpperCase()] || null
  },

  /**
   * States are not going to change, so doing a database lookup is not necessary 100% of the time
   * @param {number} id
   */
  getStateAbbrByID (id) {
    const mapping = [
      {
        abbr: 'AL', // ID: 1
        name: 'Alabama'
      },
      {
        abbr: 'AK', // ID: 2
        name: 'Alaska'
      },
      {
        abbr: 'AS', // ID: 3
        name: 'American Samoa'
      },
      {
        abbr: 'AZ', // ID: 4
        name: 'Arizona'
      },
      {
        abbr: 'AR', // ID: 5
        name: 'Arkansas'
      },
      {
        abbr: 'CA', // ID: 6
        name: 'California'
      },
      {
        abbr: 'CO', // ID: 7
        name: 'Colorado'
      },
      {
        abbr: 'CT', // ID: 8
        name: 'Connecticut'
      },
      {
        abbr: 'DE', // ID: 9
        name: 'Delaware'
      },
      {
        abbr: 'DC', // ID: 10
        name: 'District of Columbia'
      },
      {
        abbr: 'FL', // ID: 11
        name: 'Florida'
      },
      {
        abbr: 'GA', // ID: 12
        name: 'Georgia'
      },
      {
        abbr: 'GU', // ID: 13
        name: 'Guam'
      },
      {
        abbr: 'HI', // ID: 14
        name: 'Hawaii'
      },
      {
        abbr: 'ID', // ID: 15
        name: 'Idaho'
      },
      {
        abbr: 'IL', // ID: 16
        name: 'Illinois'
      },
      {
        abbr: 'IN', // ID: 17
        name: 'Indiana'
      },
      {
        abbr: 'IA', // ID: 18
        name: 'Iowa'
      },
      {
        abbr: 'KS', // ID: 19
        name: 'Kansas'
      },
      {
        abbr: 'KY', // ID: 20
        name: 'Kentucky'
      },
      {
        abbr: 'LA', // ID: 21
        name: 'Louisiana'
      },
      {
        abbr: 'ME', // ID: 22
        name: 'Maine'
      },
      {
        abbr: 'MD', // ID: 23
        name: 'Maryland'
      },
      {
        abbr: 'MA', // ID: 24
        name: 'Massachusetts'
      },
      {
        abbr: 'MI', // ID: 25
        name: 'Michigan'
      },
      {
        abbr: 'MN', // ID: 26
        name: 'Minnesota'
      },
      {
        abbr: 'MS', // ID: 27
        name: 'Mississippi'
      },
      {
        abbr: 'MO', // ID: 28
        name: 'Missouri'
      },
      {
        abbr: 'MT', // ID: 29
        name: 'Montana'
      },
      {
        abbr: 'NE', // ID: 30
        name: 'Nebraska'
      },
      {
        abbr: 'NV', // ID: 31
        name: 'Nevada'
      },
      {
        abbr: 'NH', // ID: 32
        name: 'New Hampshire'
      },
      {
        abbr: 'NJ', // ID: 33
        name: 'New Jersey'
      },
      {
        abbr: 'NM', // ID: 34
        name: 'New Mexico'
      },
      {
        abbr: 'NY', // ID: 35
        name: 'New York'
      },
      {
        abbr: 'NC', // ID: 36
        name: 'North Carolina'
      },
      {
        abbr: 'ND', // ID: 37
        name: 'North Dakota'
      },
      {
        abbr: 'MP', // ID: 38
        name: 'Northern Mariana Islands'
      },
      {
        abbr: 'OH', // ID: 39
        name: 'Ohio'
      },
      {
        abbr: 'OK', // ID: 40
        name: 'Oklahoma'
      },
      {
        abbr: 'OR', // ID: 41
        name: 'Oregon'
      },
      {
        abbr: 'PA', // ID: 42
        name: 'Pennsylvania'
      },
      {
        abbr: 'PR', // ID: 43
        name: 'Puerto Rico'
      },
      {
        abbr: 'RI', // ID: 44
        name: 'Rhode Island'
      },
      {
        abbr: 'SC', // ID: 45
        name: 'South Carolina'
      },
      {
        abbr: 'SD', // ID: 46
        name: 'South Dakota'
      },
      {
        abbr: 'TN', // ID: 47
        name: 'Tennessee'
      },
      {
        abbr: 'TX', // ID: 48
        name: 'Texas'
      },
      {
        abbr: 'UM', // ID: 49
        name: 'United States Minor Outlying Islands'
      },
      {
        abbr: 'UT', // ID: 50
        name: 'Utah'
      },
      {
        abbr: 'VT', // ID: 51
        name: 'Vermont'
      },
      {
        abbr: 'VI', // ID: 52
        name: 'Virgin Islands, U.S.'
      },
      {
        abbr: 'VA', // ID: 53
        name: 'Virginia'
      },
      {
        abbr: 'WA', // ID: 54
        name: 'Washington'
      },
      {
        abbr: 'WV', // ID: 55
        name: 'West Virginia'
      },
      {
        abbr: 'WI', // ID: 56
        name: 'Wisconsin'
      },
      {
        abbr: 'WY', // ID: 57
        name: 'Wyoming'
      }
    ]

    return mapping[id - 1]
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
    } else if (typeof val === 'string' && val !== '') {
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
    if (typeof val === 'string' && val !== '') {
      // eslint-disable-next-line no-useless-escape
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(val) ? val.toLowerCase() : null
    }

    return null
  },

  /**
   * Custom Function to Parse Float from CSV File
   * @param {*} val
   * @param {*} useZero
   * @param {*} positiveOnly
   */
  parseFloat (val, useZero, positiveOnly) {
    let cleanVal = null

    if (!val) {
      cleanVal = useZero ? 0 : null
    } else if (typeof val === 'number') {
      cleanVal = parseFloat(val)
    } else if (typeof val === 'string' && val !== '' && /[0-9,.-]/.test(val)) {
      cleanVal = parseFloat(val.replace(/[^0-9.-]/g, ''))
    }

    if (cleanVal) {
      if (positiveOnly && cleanVal < 0) {
        cleanVal = 0
      }

      return cleanVal
    }

    return useZero ? 0 : null
  },

  /**
   * Custom Function to Parse Int from CSV File
   * @param {*} val
   * @param {*} useZero
   * @param {*} positiveOnly
   */
  parseInt (val, useZero, positiveOnly) {
    let cleanVal = null

    if (!val) {
      cleanVal = useZero ? 0 : null
    } else if (typeof val === 'number') {
      cleanVal = parseInt(val)
    } else if (typeof val === 'string' && val !== '' && /[0-9,.-]/.test(val)) {
      cleanVal = parseInt(val.replace(/[^0-9.-]/g, ''))
    }

    if (cleanVal !== null) {
      if (positiveOnly && cleanVal < 0) {
        cleanVal = 0
      }

      return cleanVal
    }

    return useZero ? 0 : null
  },

  /**
   * Custom Function to Parse Phone from CSV File
   * @param {*} val
   */
  parsePhone (val) {
    if (typeof val === 'string' && val !== '') {
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
    } else if (typeof val === 'string' && val !== '') {
      return (val.trim() !== '') ? val.trim() : null
    }

    return null
  },

  /**
   * Custom Function to Parse URL from CSV File
   * @param {*} val
   */
  parseURL (val) {
    if (typeof val === 'string' && val !== '') {
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
  },

  /**
   * Left Pad String
   * @param {string} str
   * @param {number} len
   * @param {string} pad
   */
  leftPad (str, len, pad) {
    return (str.length < len) ? Array(len - String(str).length + 1).join(pad || '0') + str : str
  }
}
