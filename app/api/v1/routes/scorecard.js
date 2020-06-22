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
 * [GET] Scorecard Grades
 * @memberof module:routes/scorecard
 * @name /scorecard/grades
 */
/* istanbul ignore next */
router.route('/scorecard/grades/:state/:type').get((request, response) => {
  const state = (typeof request.params.state !== 'undefined') ? request.params.state : null
  const type = (typeof request.params.type !== 'undefined') ? request.params.type : null

  ScorecardDomain.getGrades(state, type).then((grades) => {
    response.json(util.createAPIResponse({
      data: grades
    }, request.query.fields))
  }).catch(err => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [err]
    }, request.query.fields))
  })
})

/**
 * [GET] Scorecard Report
 * @memberof module:routes/scorecard
 * @name /scorecard/report
 */
/* istanbul ignore next */
router.route('/scorecard/report/:state/:type/:location').get((request, response) => {
  const state = (typeof request.params.state !== 'undefined') ? request.params.state : null
  const type = (typeof request.params.type !== 'undefined') ? request.params.type : null
  const location = (typeof request.params.location !== 'undefined') ? request.params.location : null

  ScorecardDomain.getReport(state, type, location).then((scorecard) => {
    response.json(util.createAPIResponse({
      data: scorecard
    }, request.query.fields))
  }).catch(err => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: (err && err.message) ? [err.message] : [err]
    }, request.query.fields))
  })
})

/**
 * [GET] Scorecard States
 * @memberof module:routes/scorecard
 * @name /scorecard/states
 */
/* istanbul ignore next */
router.route('/scorecard/states').get((request, response) => {
  ScorecardDomain.getStates().then((states) => {
    response.json(util.createAPIResponse({
      data: states
    }, request.query.fields))
  }).catch(err => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: (err && err.message) ? [err.message] : [err]
    }, request.query.fields))
  })
})

/**
 * [GET] Scorecard State
 * @memberof module:routes/scorecard
 * @name /scorecard/state
 */
/* istanbul ignore next */
router.route('/scorecard/state/:state').get((request, response) => {
  const state = (typeof request.params.state !== 'undefined') ? request.params.state : null

  ScorecardDomain.getState(state).then((data) => {
    response.json(util.createAPIResponse({
      data: data
    }, request.query.fields))
  }).catch(err => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: (err && err.message) ? [err.message] : [err]
    }, request.query.fields))
  })
})

module.exports = router
