const validate = require('validate.js')

validate.validators.modelFieldValueUnique = (value, params, data) => {
  return new validate.Promise((resolve, reject) => {
    const conditions = { where: {} }
    conditions.where[params.field] = value
    params.model.findOne(conditions).then((result) => {
      if (result) {
        resolve('is already in use')
      } else {
        resolve()
      }
    })
  })
}
