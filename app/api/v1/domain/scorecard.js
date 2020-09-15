/**
 * @module domain/scorecard
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const models = require('../../../models')
const util = require('./util')
const omitColumns = ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'agency_id', 'coordinate', 'created_date', 'modified_date', 'deletedAt']

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const __buildAgency = (result) => {
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

  return results
}

const __buildGeoJSON = (result, collection) => {
  const geoJSON = {
    type: 'Feature',
    id: '',
    properties: {}
  }

  if (collection) {
    delete geoJSON.id
  }

  // Add Department Name
  if (result && typeof result.name === 'string') {
    geoJSON.properties.name = result.name
  }

  // Add Department Score
  if (result && typeof result.report !== 'undefined' && typeof result.report.overall_score !== 'undefined') {
    geoJSON.properties.score = result.report.overall_score
  }

  // Add Department Grade
  if (result && typeof result.report !== 'undefined' && typeof result.report.grade_class !== 'undefined') {
    geoJSON.properties.grade = (result.complete) ? result.report.grade_marker : 'incomplete'
    geoJSON.properties.enableHover = true
  }

  // Add Department URL
  if (result && typeof result.slug !== 'undefined' && typeof result.state_id !== 'undefined' && typeof result.type !== 'undefined') {
    const stateInfo = util.getStateAbbrByID(result.state_id)
    geoJSON.properties.url = `/${stateInfo.abbr.toLowerCase()}/${result.type}/${result.slug}`
    geoJSON.properties.state = stateInfo.abbr

    if (!collection) {
      geoJSON.id = `scorecard_${stateInfo.abbr.toLowerCase()}_${result.type}_${result.slug}`
    }
  }

  if (result && result.type === 'police-department') {
    geoJSON.properties.type = result.type

    if (result.city && typeof result.city.latitude !== 'undefined' && typeof result.city.longitude !== 'undefined') {
      geoJSON.geometry = {
        type: 'Point',
        coordinates: [
          parseFloat(result.city.longitude),
          parseFloat(result.city.latitude)
        ]
      }
    }
  }

  if (result && result.type === 'sheriff') {
    geoJSON.properties.type = result.type

    if (result.county && typeof result.county.fips_state_code !== 'undefined' && typeof result.county.fips_county_code !== 'undefined') {
      geoJSON.properties.fips = `${result.county.fips_state_code}${result.county.fips_county_code}`
    }
  }

  if (result && typeof result.complete === 'boolean') {
    geoJSON.properties.complete = result.complete
  }

  geoJSON.properties = util.sortByKeys(geoJSON.properties)

  return geoJSON
}

/**
 * Domain Scorecard
 * @type {object}
 */
module.exports = {
  /**
   * Get US States and Support for Each
   */
  getGrades (state, type, limit) {
    if (!state) {
      return Promise.reject('Missing Required `state` parameter')
    }

    if (!type) {
      return Promise.reject('Missing Required `type` parameter')
    }

    if (!limit) {
      limit = 0
    }

    let stateDetails

    if (state !== 'us') {
      stateDetails = util.getStateByID(state)

      if (!stateDetails) {
        return Promise.reject('Invalid `state` parameter')
      }
    }

    const where = {
      type: type
    }

    const includes = [
      'report',
      'state'
    ]

    if (stateDetails && state !== 'us') {
      where.state_id = stateDetails.id
    }

    if (type === 'sheriff') {
      includes.push('county')
    } else if (type === 'police-department') {
      includes.push('city')
    } else {
      includes.push('city')
      includes.push('county')
    }

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findAll({
      where: where,
      include: includes,
      limit: parseInt(limit),
      order: [
        [
          'report', 'overall_score', 'ASC'
        ]
      ]
    }).then((agencies) => {
      if (agencies) {
        const grades = []

        agencies.forEach((agency) => {
          // Skip Agency if No Report Generated
          if (!agency.dataValues.report) {
            return
          }

          const grade = util.getGrade(agency.dataValues.report.dataValues.overall_score)

          grades.push({
            agency_name: agency.dataValues.name,
            change_overall_score: agency.dataValues.report.dataValues.change_overall_score || 0,
            complete: agency.dataValues.complete,
            district: (agency.dataValues.county) ? `us-${state.toLowerCase()}-${agency.dataValues.county.dataValues.fips_county_code}` : null,
            grade_class: grade ? grade.class : null,
            grade_letter: grade ? grade.letter : null,
            latitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.latitude) : null,
            longitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.longitude) : null,
            overall_score: agency.dataValues.report.dataValues.overall_score,
            slug: agency.dataValues.slug,
            title: `${agency.dataValues.name}, ${agency.dataValues.state.dataValues.abbr} ${util.titleCase(agency.dataValues.type, true)}`,
            url_pretty: `/${state.toLowerCase()}/${agency.dataValues.type}/${agency.dataValues.slug}`,
            url: `/?state=${state.toLowerCase()}&type=${agency.dataValues.type}&location=${agency.dataValues.slug}`
          })
        })

        // Return the agencies in order of best score to worse
        return _.reverse(_.sortBy(grades, ['overall_score']))
      } else {
        return Promise.reject(`No location found for ${state} ${type}`)
      }
    })
  },

  /**
   * Get US States and Support for Each
   */
  getStates () {
    // Search Counties for Sheriff Department
    return models.scorecard_agency.findAll({
      include: [
        'report',
        'city',
        'county',
        'arrests',
        'police_accountability',
        'police_violence'
      ]
    }).then((agencies) => {
      if (agencies) {
        const cleanAgencies = {}

        agencies.forEach((agency) => {
          // Skip Agency if No Report Generated
          if (!agency.dataValues.report) {
            return
          }

          const grade = util.getGrade(agency.dataValues.report.dataValues.overall_score)
          const stateDetails = util.getStateAbbrByID(agency.dataValues.state_id)

          if (!stateDetails) {
            return Promise.reject('Invalid `state` parameter')
          }

          /* istanbul ignore else */
          if (stateDetails) {
            /* istanbul ignore else */
            if (!cleanAgencies.hasOwnProperty(stateDetails.abbr)) { // eslint-disable-line no-prototype-builtins
              cleanAgencies[stateDetails.abbr] = {
                average_grade_class: '',
                average_grade_letter: '',
                average_grade_marker: '',
                average_score: 0,
                total_agencies: 0,
                total_overall_score: 0,
                total_population: 0,
                total_people_killed: 0,
                total_arrests: 0,
                total_complaints_reported: 0,
                total_complaints_sustained: 0,
                total_black_people_killed: 0,
                total_black_population: 0,
                total_hispanic_people_killed: 0,
                total_hispanic_population: 0,
                total_white_people_killed: 0,
                total_white_population: 0,
                total_low_level_arrests: 0,
                total_violent_crime_arrests: 0,
                total_arrests_2013: 0,
                total_arrests_2014: 0,
                total_arrests_2015: 0,
                total_arrests_2016: 0,
                total_arrests_2017: 0,
                total_arrests_2018: 0
              }
            }

            /* istanbul ignore else */
            if (!cleanAgencies[stateDetails.abbr].hasOwnProperty(agency.dataValues.type)) { // eslint-disable-line no-prototype-builtins
              cleanAgencies[stateDetails.abbr][agency.dataValues.type] = []
            }

            // Add Agencies to State
            cleanAgencies[stateDetails.abbr][agency.dataValues.type].push({
              agency_name: agency.dataValues.name,
              complete: agency.dataValues.complete,
              district: (agency.dataValues.county) ? `us-${stateDetails.abbr.toLowerCase()}-${agency.dataValues.county.dataValues.fips_county_code}` : null,
              grade_class: grade ? grade.class : null,
              grade_letter: grade ? grade.letter : null,
              grade_marker: grade ? grade.marker : null,
              latitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.latitude) : null,
              longitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.longitude) : null,
              overall_score: agency.dataValues.report.dataValues.overall_score,
              population: agency.dataValues.total_population,
              people_killed: agency.dataValues.report.dataValues.total_people_killed,
              arrests: agency.dataValues.report.dataValues.total_arrests,
              complaints_reported: agency.dataValues.police_accountability ? agency.dataValues.police_accountability.dataValues.civilian_complaints_reported : null,
              complaints_sustained: agency.dataValues.police_accountability ? agency.dataValues.police_accountability.dataValues.civilian_complaints_sustained : null,

              black_population: agency.dataValues.black_population,
              hispanic_population: agency.dataValues.hispanic_population,
              white_population: agency.dataValues.white_population,

              black_people_killed: agency.dataValues.police_violence ? agency.dataValues.police_violence.dataValues.black_people_killed : null,
              hispanic_people_killed: agency.dataValues.police_violence ? agency.dataValues.police_violence.dataValues.hispanic_people_killed : null,
              white_people_killed: agency.dataValues.police_violence ? agency.dataValues.police_violence.dataValues.white_people_killed : null,

              low_level_arrests: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.low_level_arrests : null,
              violent_crime_arrests: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.violent_crime_arrests : null,

              arrests_2013: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2013 : null,
              arrests_2014: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2014 : null,
              arrests_2015: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2015 : null,
              arrests_2016: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2016 : null,
              arrests_2017: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2017 : null,
              arrests_2018: agency.dataValues.arrests ? agency.dataValues.arrests.dataValues.arrests_2018 : null,

              slug: agency.dataValues.slug,
              title: `${agency.dataValues.name}, ${stateDetails.name} ${util.titleCase(agency.dataValues.type, true)}`,
              url_pretty: `/${stateDetails.abbr.toLowerCase()}/${agency.dataValues.type}/${agency.dataValues.slug}`,
              url: `/?state=${stateDetails.abbr.toLowerCase()}&type=${agency.dataValues.type}&location=${agency.dataValues.slug}`
            })
          }
        })

        // Generate Report per State and Prepare for Output
        Object.keys(cleanAgencies).forEach(key => {
          Object.keys(cleanAgencies[key]).forEach(type => {
            const currentCount = parseInt(cleanAgencies[key].total_agencies) || 0
            const currentPopulation = parseInt(cleanAgencies[key].total_population) || 0
            const currentPeopleKilled = parseInt(cleanAgencies[key].total_people_killed) || 0
            const currentArrests = parseInt(cleanAgencies[key].total_arrests) || 0
            const currentOverallScore = parseInt(cleanAgencies[key].total_overall_score) || 0
            const currentComplaintsReported = parseInt(cleanAgencies[key].complaints_reported) || 0
            const currentComplaintsSustained = parseInt(cleanAgencies[key].complaints_sustained) || 0

            const currentBlackPeopleKilled = parseInt(cleanAgencies[key].black_people_killed) || 0
            const currentHispanicPeopleKilled = parseInt(cleanAgencies[key].hispanic_people_killed) || 0
            const currentWhitePeopleKilled = parseInt(cleanAgencies[key].white_people_killed) || 0

            const currentBlackPopulation = parseInt(cleanAgencies[key].black_population) || 0
            const currentHispanicPopulation = parseInt(cleanAgencies[key].hispanic_population) || 0
            const currentWhitePopulation = parseInt(cleanAgencies[key].white_population) || 0

            const currentLowLevelArrests = parseInt(cleanAgencies[key].low_level_arrests) || 0
            const currentViolentCrimeArrests = parseInt(cleanAgencies[key].violent_crime_arrests) || 0

            const currentArrests2013 = parseInt(cleanAgencies[key].arrests_2013) || 0
            const currentArrests2014 = parseInt(cleanAgencies[key].arrests_2014) || 0
            const currentArrests2015 = parseInt(cleanAgencies[key].arrests_2015) || 0
            const currentArrests2016 = parseInt(cleanAgencies[key].arrests_2016) || 0
            const currentArrests2017 = parseInt(cleanAgencies[key].arrests_2017) || 0
            const currentArrests2018 = parseInt(cleanAgencies[key].arrests_2018) || 0

            cleanAgencies[key][type] = _.reverse(_.sortBy(cleanAgencies[key][type], ['population']))
            cleanAgencies[key].total_agencies = currentCount + cleanAgencies[key][type].length
            cleanAgencies[key].total_population = currentPopulation + _.sumBy(cleanAgencies[key][type], 'population')
            cleanAgencies[key].total_people_killed = currentPeopleKilled + _.sumBy(cleanAgencies[key][type], 'people_killed')
            cleanAgencies[key].total_arrests = currentArrests + _.sumBy(cleanAgencies[key][type], 'arrests')
            cleanAgencies[key].total_overall_score = currentOverallScore + _.sumBy(cleanAgencies[key][type], 'overall_score')
            cleanAgencies[key].total_complaints_reported = currentComplaintsReported + _.sumBy(cleanAgencies[key][type], 'complaints_reported')
            cleanAgencies[key].total_complaints_sustained = currentComplaintsSustained + _.sumBy(cleanAgencies[key][type], 'complaints_sustained')

            cleanAgencies[key].total_black_people_killed = currentBlackPeopleKilled + _.sumBy(cleanAgencies[key][type], 'black_people_killed')
            cleanAgencies[key].total_hispanic_people_killed = currentHispanicPeopleKilled + _.sumBy(cleanAgencies[key][type], 'hispanic_people_killed')
            cleanAgencies[key].total_white_people_killed = currentWhitePeopleKilled + _.sumBy(cleanAgencies[key][type], 'white_people_killed')

            cleanAgencies[key].total_black_population = currentBlackPopulation + _.sumBy(cleanAgencies[key][type], 'black_population')
            cleanAgencies[key].total_hispanic_population = currentHispanicPopulation + _.sumBy(cleanAgencies[key][type], 'hispanic_population')
            cleanAgencies[key].total_white_population = currentWhitePopulation + _.sumBy(cleanAgencies[key][type], 'white_population')

            cleanAgencies[key].total_low_level_arrests = currentLowLevelArrests + _.sumBy(cleanAgencies[key][type], 'low_level_arrests')
            cleanAgencies[key].total_violent_crime_arrests = currentViolentCrimeArrests + _.sumBy(cleanAgencies[key][type], 'violent_crime_arrests')

            cleanAgencies[key].total_arrests_2013 = currentArrests2013 + _.sumBy(cleanAgencies[key][type], 'arrests_2013')
            cleanAgencies[key].total_arrests_2014 = currentArrests2014 + _.sumBy(cleanAgencies[key][type], 'arrests_2014')
            cleanAgencies[key].total_arrests_2015 = currentArrests2015 + _.sumBy(cleanAgencies[key][type], 'arrests_2015')
            cleanAgencies[key].total_arrests_2016 = currentArrests2016 + _.sumBy(cleanAgencies[key][type], 'arrests_2016')
            cleanAgencies[key].total_arrests_2017 = currentArrests2017 + _.sumBy(cleanAgencies[key][type], 'arrests_2017')
            cleanAgencies[key].total_arrests_2018 = currentArrests2018 + _.sumBy(cleanAgencies[key][type], 'arrests_2018')
          })

          const averageScore = Math.floor(cleanAgencies[key].total_overall_score / cleanAgencies[key].total_agencies)
          const averageGrade = util.getGrade(averageScore)

          cleanAgencies[key].average_score = averageScore
          cleanAgencies[key].average_grade_class = averageGrade.class
          cleanAgencies[key].average_grade_letter = averageGrade.letter
          cleanAgencies[key].average_grade_marker = averageGrade.marker
        })

        // Return the agencies in order of best score to worse
        return cleanAgencies
      } else {
        return Promise.reject('No location found')
      }
    })
  },

  /**
   * Get Specific US State and Active Scorecards sorted by population
   */
  getState (state) {
    if (!state) {
      return Promise.reject('Missing Required `state` parameter')
    }

    const stateDetails = util.getStateByID(state)

    if (!stateDetails) {
      return Promise.reject('Invalid `state` parameter')
    }

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findAll({
      where: {
        state_id: stateDetails.id
      },
      include: [
        'report',
        'city',
        'county'
      ]
    }).then((agencies) => {
      if (agencies) {
        const cleanAgencies = {
          average_grade_class: '',
          average_grade_letter: '',
          average_grade_marker: '',
          average_score: 0,
          total_agencies: 0,
          total_overall_score: 0,
          total_population: 0
        }

        const defaultKeys = Object.keys(cleanAgencies)

        agencies.forEach((agency) => {
          // Skip Agency if No Report Generated
          if (!agency.dataValues.report) {
            return
          }

          /* istanbul ignore else */
          if (!cleanAgencies.hasOwnProperty(agency.dataValues.type)) { // eslint-disable-line no-prototype-builtins
            cleanAgencies[agency.dataValues.type] = []
          }

          const grade = util.getGrade(agency.dataValues.report.dataValues.overall_score)

          cleanAgencies[agency.dataValues.type].push({
            agency_name: agency.dataValues.name,
            complete: agency.dataValues.complete,
            district: (agency.dataValues.county) ? `us-${state.toLowerCase()}-${agency.dataValues.county.dataValues.fips_county_code}` : null,
            grade_class: grade ? grade.class : null,
            grade_letter: grade ? grade.letter : null,
            grade_marker: grade ? grade.marker : null,
            latitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.latitude) : null,
            longitude: (agency.dataValues.city) ? util.parseFloat(agency.dataValues.city.dataValues.longitude) : null,
            overall_score: agency.dataValues.report.dataValues.overall_score,
            population: agency.dataValues.total_population,
            slug: agency.dataValues.slug,
            title: `${agency.dataValues.name}, ${stateDetails.name} ${util.titleCase(agency.dataValues.type, true)}`,
            url: `/?state=${state.toLowerCase()}&type=${agency.dataValues.type}&location=${agency.dataValues.slug}`,
            url_pretty: `/${state.toLowerCase()}/${agency.dataValues.type}/${agency.dataValues.slug}`
          })
        })

        // Generate Report per State and Prepare for Output
        Object.keys(cleanAgencies).forEach(type => {
          if (defaultKeys.indexOf(type) !== -1) {
            return
          }

          const currentCount = parseInt(cleanAgencies.total_agencies) || 0
          const currentPopulation = parseInt(cleanAgencies.total_population) || 0
          const currentOverallScore = parseInt(cleanAgencies.total_overall_score) || 0

          cleanAgencies[type] = _.reverse(_.sortBy(cleanAgencies[type], ['population']))
          cleanAgencies.total_agencies = currentCount + cleanAgencies[type].length
          cleanAgencies.total_population = currentPopulation + _.sumBy(cleanAgencies[type], 'population')
          cleanAgencies.total_overall_score = currentOverallScore + _.sumBy(cleanAgencies[type], 'overall_score')
        })

        const averageScore = Math.floor(cleanAgencies.total_overall_score / cleanAgencies.total_agencies)
        const averageGrade = util.getGrade(averageScore)

        cleanAgencies.average_score = averageScore
        cleanAgencies.average_grade_class = averageGrade.class
        cleanAgencies.average_grade_letter = averageGrade.letter
        cleanAgencies.average_grade_marker = averageGrade.marker

        // Return the agencies in order of best score to worse
        return cleanAgencies
      } else {
        return Promise.reject(`No location found for ${state}`)
      }
    })
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

    const stateDetails = util.getStateByID(state)

    if (!stateDetails) {
      return Promise.reject('Invalid `state` parameter')
    }

    if (location) {
      // Search for Agency that Matches Location
      return models.scorecard_agency.findOne({
        where: {
          type: type,
          state_id: stateDetails.id,
          slug: location
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
    } else {
      // Search Matching Agencies and pick the Most Populated Location
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
        ],
        limit: 1,
        order: [
          [
            'total_population', 'DESC'
          ]
        ]
      }).then((results) => {
        if (results && results.length === 1) {
          return __buildAgency(results[0])
        } else {
          return Promise.reject(`No location found for ${state} ${type} ${location}`)
        }
      })
    }
  },

  /**
   * Get Report
   * @param {String} state
   * @param {String} type
   * @param {String} location
   */
  getMap (state, type, location) {
    let mapState, mapType, mapLocation

    // Check if we are filtering by state, and state is valid
    if (state && state.length === 2 && state !== 'us') {
      mapState = util.getStateByID(state)

      if (!mapState) {
        return Promise.reject('Invalid `state` parameter')
      }
    } else {
      state = 'us'
    }

    // Check if we are filtering by type, and type is valid
    if (type && ['sheriff', 'police-department'].indexOf(type.toLowerCase()) > -1) {
      mapType = type.toLowerCase()
    } else if (type && ['sheriff', 'police-department'].indexOf(type.toLowerCase()) === -1) {
      return Promise.reject('Invalid `type` parameter')
    }

    // Check if we are filtering by location, and location is valid
    if (location && /[a-z-]+/.test(location)) {
      mapLocation = location
    } else if (type && !/[a-z-]+/.test(location)) {
      return Promise.reject('Invalid `location` parameter')
    }

    // Where Clause
    const where = {}

    // Includes
    const includes = ['report']

    // Add State Filter if set
    if (mapState && mapState.id) {
      where.state_id = mapState.id
    }

    // Filter Department Type
    if (mapType) {
      where.type = mapType

      if (mapType === 'sheriff') {
        includes.push('county')
      } else if (mapType === 'police-department') {
        includes.push('city')
      }
    } else {
      includes.push('county')
      includes.push('city')
    }

    // Filter Department by Location
    if (mapLocation) {
      where.slug = mapLocation
    }

    // Search
    return models.scorecard_agency.findAll({
      where: where,
      include: includes,
      order: [
        [
          'state_id', 'ASC'
        ],
        [
          'slug', 'ASC'
        ]
      ]
    }).then((agencies) => {
      let geoJSON

      if (agencies && agencies.length === 1) {
        geoJSON = __buildGeoJSON(agencies[0])
      } else if (agencies && agencies.length > 1) {
        var id = 'scorecard'
        id += (state) ? `_${util.createSlug(state)}` : ''
        id += (type) ? `_${util.createSlug(type)}` : ''
        id += (location) ? `_${util.createSlug(location)}` : ''

        geoJSON = {
          type: 'FeatureCollection',
          id: id,
          features: []
        }

        agencies.forEach((agency) => {
          geoJSON.features.push(__buildGeoJSON(agency, true))
        })
      }

      return {
        geoJSON: geoJSON,
        lastModified: agencies[0].modified_date
      }
    })
  },

  /**
   * Search
   * @param {String} keyword
   */
  search (keyword) {
    if (!keyword) {
      return Promise.reject('Missing Required `keyword` parameter')
    }

    var keywords = keyword.toLowerCase().split(' ')
    var clause = []

    keywords.forEach((word) => {
      if (word !== 'sheriff' && word !== 'police') {
        clause.push({
          name: {
            [Op.like]: '%' + word + '%'
          }
        })
      }
    })

    if (keywords.indexOf('sheriff') > -1) {
      clause.push({
        type: 'sheriff'
      })
    } else if (keywords.indexOf('police') > -1) {
      clause.push({
        type: 'police-department'
      })
    }

    // Search for Agency that Matches Location
    return models.scorecard_agency.findAll({
      where: {
        [Op.and]: clause
      },
      limit: 5,
      include: [
        'state',
        'report'
      ]
    }).then((result) => {
      if (result) {
        const results = []

        result.forEach((data) => {
          var name = `${data.name}, ${data.state.abbr}`
          var label = name

          keywords.forEach((word) => {
            if (word !== 'sheriff' && word !== 'police') {
              var regEx = new RegExp(word, 'ig')
              var replaceMask = `<span>${word}</span>`

              label = label.replace(regEx, replaceMask)
            }
          })

          if (!data.complete) {
            name = name.concat(' *')
            label = label.concat(' *')
          }

          results.push({
            class: data.report.grade_class,
            complete: data.complete,
            label: label,
            matches: keywords,
            name: name,
            score: data.report.overall_score,
            type: `${data.type === 'sheriff' ? 'Sheriff Department' : 'Police Department'}`,
            url: `/${data.state.abbr.toLowerCase()}/${data.type}/${data.slug}`
          })
        })

        return results
      } else {
        return Promise.reject(`No results found for ${keyword}`)
      }
    })
  }
}
