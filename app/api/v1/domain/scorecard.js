/**
 * @module domain/scorecard
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const { Op } = require('sequelize')

const models = require('../../../models')
const util = require('./util')

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
   * Get Location
   * @param {String} state
   * @param {String} type
   * @param {String} location
   */
  getLocation (state, type, location) {
    if (!state) {
      // @TODO: Return Error for Required Param
      return null
    }

    const stateDetails = util.getStateByID(state)

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findOne({
      where: {
        type: type,
        state_id: stateDetails.id,
        name: {
          [Op.like]: `%${location.replace(/-/g, ' ')}%`
        }
      },
      include: [
        'arrests',
        'homicide',
        'jail',
        'police_accountability',
        'police_funding',
        'police_violence',
        'policy'
      ]
    }).then((result) => {
      if (result && result.dataValues) {
        const omitColumns = ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'agency_id', 'created_date', 'modified_date', 'deletedAt']
        const agency = _.omit(result.dataValues, ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'arrests', 'homicide', 'jail', 'police_accountability', 'police_funding', 'police_violence', 'policy', 'created_date', 'modified_date', 'deletedAt'])

        return {
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
            : null
        }
      } else {
        return Promise.reject(`No location found for ${state} ${type} ${location}`)
      }
    })
  }
}
