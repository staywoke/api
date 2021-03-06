'use strict'

const models = require('../models')

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable(models.geo_countries.tableName, models.geo_countries.rawAttributes).then(() => {
      for (let i = 0; i < models.geo_countries.options.indexes.length; i++) {
        queryInterface.addIndex(models.geo_countries.tableName, models.geo_countries.options.indexes[i]).catch(err => {
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
    return queryInterface.dropTable(models.geo_countries.tableName)
  }
}
