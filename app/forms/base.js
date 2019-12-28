const Base = require('class-extend')
const Promise = require('bluebird')
const validate = require('validate.js')

require('./validators')

validate.Promise = Promise

/**
 * Base interface for form validation objects on the site
 */
module.exports = Base.extend({
  constraints: {},

  validate: (data) => {
    return validate.async(data, this.constraints)
  }
})
