const validate = require('validate.js')

validate.validators.modelFieldValueUnique = (value, params, data) => {
  return new validate.Promise((resolve, reject) => {
    const conditions = { where: {} }
    conditions.where[params.field] = value
    params.model.findOne(conditions).then((result) => {
      if (result) {
        return resolve('is already in use')
      } else {
        return resolve()
      }
    }).catch((err) => {
      if (err) {
        const fields = {}

        fields[params.field] = ['Invalid or Missing Parameter']
        return reject(fields)
      }
    })
  })
}
