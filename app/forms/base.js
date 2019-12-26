import Base from 'class-extend'
import Promise from 'bluebird'
import validate from 'validate.js'

import './validators'

validate.Promise = Promise

/**
 * Base interface for form validation objects on the site
 */
export default Base.extend({
  constraints: {},

  validate: (data) => {
    return validate.async(data, this.constraints)
  }
})
