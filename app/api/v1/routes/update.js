/**
 * @module routes/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')
const config = require('../../../config')
const util = require('./util')

const { UpdateDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * [GET] Categories
 * @memberof module:routes/update
 * @name /update/scorecard
 */
/* istanbul ignore next */
router.route('/update/scorecard').get((request, response) => {
  // Download Scorecard
  UpdateDomain.downloadScorecard().then(() => {
    // Verify CSV is valid before using and get Row Count
    UpdateDomain.validateScorecard().then((rowCount) => {
      // Import Scorecard
      UpdateDomain.importScorecard(rowCount).then((imported) => {
        // Send Success Response when Import Completed
        response.json(util.createAPIResponse({
          data: imported.data,
          errors: imported.errors,
          warnings: imported.warnings
        }, request.query.fields))
      }).catch(err => {
        response.json(util.createAPIResponse({
          errors: [err]
        }, request.query.fields))
      })
    }).catch(err => {
      response.json(util.createAPIResponse({
        errors: [err]
      }, request.query.fields))
    })
  }).catch(err => {
    response.json(util.createAPIResponse({
      errors: [err]
    }, request.query.fields))
  })
})

module.exports = router
