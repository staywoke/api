'use strict'

const models = require('../models')

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable(models.scorecard_arrests.tableName, models.scorecard_arrests.rawAttributes).then(() => {
      for (let i = 0; i < models.scorecard_arrests.options.indexes.length; i++) {
        queryInterface.addIndex(models.scorecard_arrests.tableName, models.scorecard_arrests.options.indexes[i]).catch(err => {
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
    return queryInterface.dropTable(models.scorecard_arrests.tableName)
  }
}
