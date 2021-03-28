'use strict'

const models = require('../models')

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable(models.subscription_payments.tableName, models.subscription_payments.rawAttributes).then(() => {
      for (let i = 0; i < models.subscription_payments.options.indexes.length; i++) {
        queryInterface.addIndex(models.subscription_payments.tableName, models.subscription_payments.options.indexes[i]).catch(err => {
          if (typeof err.message !== 'undefined' && err.message.indexOf('Deadlock') === -1) {
            console.log(`× INDEX ERROR: ${err.message}`)
          }
        })
      }
    }).catch(err => {
      if (typeof err.message !== 'undefined') {
        console.log(`× CREATE ERROR: ${err.message}`)
      }
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(models.subscription_payments.tableName)
  }
}
