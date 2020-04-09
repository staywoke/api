/**
 * @module routes/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')
const md5 = require('md5')

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
router.route('/update/scorecard').post((request, response) => {
  const token = md5(request.body.token)

  if (token === '5d0f91a00d76444b843046b7c15eb5c2') {
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
  } else {
    response.json(util.createAPIResponse({
      errors: 'Invalid Token'
    }, request.query.fields))
  }
})

module.exports = router
