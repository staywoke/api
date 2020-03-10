/**
 * @module routes/scorecard
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')
const config = require('../../../config')
const util = require('./util')

const { ScorecardDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * [GET] Scorecard
 * @memberof module:routes/scorecard
 * @name /scorecard
 */
/* istanbul ignore next */
router.route('/scorecard').get((request, response) => {
  ScorecardDomain.getSummary().then((scorecard) => {
    response.json(util.createAPIResponse({
      data: scorecard
    }, request.query.fields))
  }).catch(err => {
    response.json(util.createAPIResponse({
      errors: [err]
    }, request.query.fields))
  })
})

/**
 * [GET] Scorecard
 * @memberof module:routes/scorecard
 * @name /scorecard
 */
/* istanbul ignore next */
router.route('/scorecard/:state/:type?/:location?').get((request, response) => {
  const state = (typeof request.params.state !== 'undefined') ? request.params.state : null
  const type = (typeof request.params.type !== 'undefined') ? request.params.type : null
  const location = (typeof request.params.location !== 'undefined') ? request.params.location : null

  ScorecardDomain.getLocation(state, type, location).then((scorecard) => {
    response.json(util.createAPIResponse({
      data: scorecard
    }, request.query.fields))
  }).catch(err => {
    response.json(util.createAPIResponse({
      errors: [err]
    }, request.query.fields))
  })
})

module.exports = router
