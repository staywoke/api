/**
 * @module domain/scorecard
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const { Op } = require('sequelize')

const models = require('../../../models')
const util = require('./util')

const __buildAgency = (result) => {
  const omitColumns = ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'agency_id', 'coordinate', 'created_date', 'modified_date', 'deletedAt']
  const agency = _.omit(result.dataValues, ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'arrests', 'homicide', 'jail', 'police_accountability', 'police_funding', 'police_violence', 'policy', 'report', 'country', 'state', 'city', 'county', 'created_date', 'modified_date', 'deletedAt'])

  const results = {
    agency: util.sortByKeys(agency),
    arrests: result.dataValues.arrests
      ? util.sortByKeys(_.omit(result.dataValues.arrests.dataValues, omitColumns))
      : null,
    homicide: result.dataValues.homicide
      ? util.sortByKeys(_.omit(result.dataValues.homicide.dataValues, omitColumns))
      : null,
    jail: result.dataValues.jail
      ? util.sortByKeys(_.omit(result.dataValues.jail.dataValues, omitColumns))
      : null,
    police_accountability: result.dataValues.police_accountability
      ? util.sortByKeys(_.omit(result.dataValues.police_accountability.dataValues, omitColumns))
      : null,
    police_funding: result.dataValues.police_funding
      ? util.sortByKeys(_.omit(result.dataValues.police_funding.dataValues, omitColumns))
      : null,
    police_violence: result.dataValues.police_violence
      ? util.sortByKeys(_.omit(result.dataValues.police_violence.dataValues, omitColumns))
      : null,
    policy: result.dataValues.policy
      ? util.sortByKeys(_.omit(result.dataValues.policy.dataValues, omitColumns))
      : null,
    report: result.dataValues.report
      ? util.sortByKeys(_.omit(result.dataValues.report.dataValues, omitColumns))
      : null,
    geo: {
      country: result.dataValues.country
        ? util.sortByKeys(_.omit(result.dataValues.country.dataValues, omitColumns))
        : null,
      state: result.dataValues.state
        ? util.sortByKeys(_.omit(result.dataValues.state.dataValues, omitColumns))
        : null,
      city: result.dataValues.city
        ? util.sortByKeys(_.omit(result.dataValues.city.dataValues, omitColumns))
        : null,
      county: result.dataValues.county
        ? util.sortByKeys(_.omit(result.dataValues.county.dataValues, omitColumns))
        : null
    }
  }

  // Add some dynamic info to the report
  if (results.report && results.report.overall_score) {
    const grade = util.getGrade(results.report.overall_score)
    results.report.grade_letter = grade.letter
    results.report.grade_marker = grade.marker
  }

  // Add some more missing dynamic data
  results.report.black_deadly_force_disparity_per_population = util.parseFloat(((results.police_violence.black_people_killed / results.agency.black_population) / (results.police_violence.white_people_killed / results.agency.white_population)).toFixed(2))
  results.report.hispanic_deadly_force_disparity_per_population = util.parseFloat(((results.police_violence.hispanic_people_killed / results.agency.hispanic_population) / (results.police_violence.white_people_killed / results.agency.white_population)).toFixed(2))

  return results
}

/**
 * Domain Scorecard
 * @type {object}
 */
module.exports = {
  /**
   * Get Location
   * @param {String} state
   * @param {String} type
   * @param {String} location
   */
  getSummary () {

  },

  /**
   * Get US States and Support for Each
   */
  getGrades (state, type) {
    if (!state) {
      return Promise.reject('Missing Required `state` parameter')
    }

    const stateDetails = util.getStateByID(state)

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findAll({
      where: {
        type: type,
        state_id: stateDetails.id
      },
      include: [
        'arrests',
        'homicide',
        'jail',
        'police_accountability',
        'police_funding',
        'police_violence',
        'policy',
        'report',
        'country',
        'state',
        'city',
        'county'
      ]
    }).then((results) => {
      if (results) {
        const agencies = []

        results.forEach((result) => {
          agencies.push(__buildAgency(result))
        })

        return agencies
      } else {
        return Promise.reject(`No location found for ${state} ${type}`)
      }
    })
  },

  /**
   * Get US States and Support for Each
   */
  getStates () {

  },

  /**
   * Get Specific US State and Active Scorecards
   */
  getState (state) {

  },

  /**
   * Get Report
   * @param {String} state
   * @param {String} type
   * @param {String} location
   */
  getReport (state, type, location) {
    if (!state) {
      return Promise.reject('Missing Required `state` parameter')
    }

    if (!type) {
      return Promise.reject('Missing Required `type` parameter')
    }

    if (!location) {
      return Promise.reject('Missing Required `location` parameter')
    }

    const stateDetails = util.getStateByID(state)

    // Clean Slug URL Param
    let cleanLocation = location.replace(/-/g, ' ')

    // Add in Missing Period for `St. ` locations
    if (cleanLocation.substring(0, 3) === 'st ') {
      cleanLocation = cleanLocation.replace(/^st /, 'st. ')
    }

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findOne({
      where: {
        type: type,
        state_id: stateDetails.id,
        name: {
          [Op.like]: `%${cleanLocation}%`
        }
      },
      include: [
        'arrests',
        'homicide',
        'jail',
        'police_accountability',
        'police_funding',
        'police_violence',
        'policy',
        'report',
        'country',
        'state',
        'city',
        'county'
      ]
    }).then((result) => {
      if (result && result.dataValues) {
        return __buildAgency(result)
      } else {
        return Promise.reject(`No location found for ${state} ${type} ${location}`)
      }
    })
  }
}
