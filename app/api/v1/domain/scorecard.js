/**
 * @module domain/scorecard
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const { Op } = require('sequelize')

const models = require('../../../models')
const util = require('./util')
const omitColumns = ['id', 'country_id', 'state_id', 'city_id', 'county_id', 'agency_id', 'coordinate', 'created_date', 'modified_date', 'deletedAt']

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

  // Add some dynamic info to the report
  if (typeof results.report !== 'undefined' && typeof results.report.overall_score !== 'undefined') {
    const grade = util.getGrade(results.report.overall_score)
    results.report.grade_letter = grade.letter
    results.report.grade_marker = grade.marker

    // Calculate Total Arrests
    const totalArrests = []

    if (results.arrests.arrests_2013) {
      totalArrests.push(results.arrests.arrests_2013)
    }

    if (results.arrests.arrests_2014) {
      totalArrests.push(results.arrests.arrests_2014)
    }

    if (results.arrests.arrests_2015) {
      totalArrests.push(results.arrests.arrests_2015)
    }

    if (results.arrests.arrests_2016) {
      totalArrests.push(results.arrests.arrests_2016)
    }

    if (results.arrests.arrests_2017) {
      totalArrests.push(results.arrests.arrests_2017)
    }

    if (results.arrests.arrests_2018) {
      totalArrests.push(results.arrests.arrests_2018)
    }

    results.report.total_arrests = Math.floor(_.sum(totalArrests) / totalArrests.length) * totalArrests.length
  }

  // Calculate how many more misdemeanor arrests there were over violent crimes
  if (typeof results.arrests.low_level_arrests !== 'undefined' && typeof results.arrests.violent_crime_arrests !== 'undefined') {
    results.report.times_more_misdemeanor_arrests_than_violent_crime = Math.floor(results.arrests.low_level_arrests / results.arrests.violent_crime_arrests)
  } else {
    results.report.times_more_misdemeanor_arrests_than_violent_crime = 0
  }

  // Calculate Less Lethal Force
  if (typeof results.police_violence.less_lethal_force_2016 !== 'undefined' && typeof results.police_violence.less_lethal_force_2018 !== 'undefined') {
    results.report.less_lethal_force_change = Math.floor(
      (
        results.arrests.less_lethal_force_2018 /
        results.arrests.less_lethal_force_2016
      ) * 100
    ) - 100
  } else {
    results.report.less_lethal_force_change = 0
  }

  // Calculate Police Shooting Incidents
  if (typeof results.police_violence.police_shootings_2016 !== 'undefined' && typeof results.police_violence.police_shootings_2017 !== 'undefined' && typeof results.police_violence.police_shootings_2018 !== 'undefined') {
    results.report.police_shootings_incidents = (
      results.police_violence.police_shootings_2016 +
      results.police_violence.police_shootings_2017 +
      results.police_violence.police_shootings_2018
    )
  } else {
    results.report.police_shootings_incidents = 0
  }

  // Calculate Deadly Force Incidents per Arrest
  if (typeof results.report.total_arrests !== 'undefined' && typeof results.police_violence.all_deadly_force_incidents !== 'undefined') {
    results.report.deadly_force_incidents_per_arrest = util.parseFloat((results.police_violence.all_deadly_force_incidents / results.report.total_arrests).toFixed(6))
    results.report.deadly_force_incidents_per_arrest_per_10k = util.parseFloat(((results.police_violence.all_deadly_force_incidents / results.report.total_arrests) * 10000).toFixed(2))
  } else {
    results.report.deadly_force_incidents_per_arrest = 0
    results.report.deadly_force_incidents_per_arrest_per_10k = 0
  }

  // Calculate Percent Police Shot First
  if (typeof results.police_violence.shot_first !== 'undefined' && typeof results.police_violence.police_shootings_2016 !== 'undefined' && typeof results.police_violence.police_shootings_2017 !== 'undefined' && typeof results.police_violence.police_shootings_2018 !== 'undefined') {
    results.report.percent_shot_first = Math.floor(
      (
        results.police_violence.shot_first / (
          results.police_violence.police_shootings_2016 +
          results.police_violence.police_shootings_2017 +
          results.police_violence.police_shootings_2018
        )
      ) * 100
    )
  } else {
    results.report.percent_shot_first = 0
  }

  // Calculate Percent Police Misperceive the Person to Have Gun
  if (typeof results.police_violence.people_killed_or_injured_armed_with_gun !== 'undefined' && typeof results.police_violence.people_killed_or_injured_gun_perceived !== 'undefined') {
    results.report.percent_police_misperceive_the_person_to_have_gun = 100 - Math.floor((results.police_violence.people_killed_or_injured_armed_with_gun / results.police_violence.people_killed_or_injured_gun_perceived) * 100)
  } else {
    results.report.percent_police_misperceive_the_person_to_have_gun = 0
  }

  // Calculate Percent used against people who were unarmed
  if (typeof results.police_violence.unarmed_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed !== 'undefined') {
    results.report.percent_used_against_people_who_were_unarmed = util.parseFloat(
      (
        results.police_violence.unarmed_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_used_against_people_who_were_unarmed = 0
  }

  // Calculate Percent used against people who were not armed with gun
  if (typeof results.police_violence.armed_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed !== 'undefined') {
    results.report.percent_used_against_people_who_were_not_armed_with_gun = util.parseFloat(
      (
        100 - (
          (
            results.police_violence.armed_people_killed / (
              results.police_violence.asian_pacific_people_killed +
              results.police_violence.white_people_killed +
              results.police_violence.hispanic_people_killed +
              results.police_violence.black_people_killed +
              results.police_violence.other_people_killed
            )
          ) * 100
        )
      ).toFixed(2)
    )
  } else {
    results.report.percent_used_against_people_who_were_not_armed_with_gun = 0
  }

  // Calculate Percentage of Black Arrests
  if (typeof results.arrests.black_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 !== 'undefined' && typeof results.arrests.arrests_2018 !== 'undefined') {
    results.report.percent_black_arrests = util.parseFloat(
      (
        results.arrests.black_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_black_arrests = 0
  }

  // Calculate Percentage of Hispanic Arrests
  if (typeof results.arrests.hispanic_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 !== 'undefined' && typeof results.arrests.arrests_2018 !== 'undefined') {
    results.report.percent_hispanic_arrests = util.parseFloat(
      (
        results.arrests.hispanic_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_hispanic_arrests = 0
  }

  // Calculate Percentage of Asian Pacific Islander Arrests
  if (typeof results.arrests.asian_pacific_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 !== 'undefined' && typeof results.arrests.arrests_2018 !== 'undefined') {
    results.report.percent_asian_pacific_arrests = util.parseFloat(
      (
        results.arrests.asian_pacific_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_asian_pacific_arrests = 0
  }

  // Calculate Percentage of White Arrests
  if (typeof results.arrests.white_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 !== 'undefined' && typeof results.arrests.arrests_2018 !== 'undefined') {
    results.report.percent_white_arrests = util.parseFloat(
      (
        results.arrests.white_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_white_arrests = 0
  }

  // Calculate Percentage of Other Arrests
  if (typeof results.arrests.other_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 !== 'undefined' && typeof results.arrests.arrests_2018 !== 'undefined') {
    results.report.percent_other_arrests = util.parseFloat(
      (
        results.arrests.other_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_other_arrests = 0
  }

  // Calculate Percentage of Black Deadly Force
  if (typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed) {
    results.report.percent_black_deadly_force = util.parseFloat(
      (
        results.police_violence.black_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_black_deadly_force = 0
  }

  // Calculate Percentage of Hispanic Deadly Force
  if (typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed) {
    results.report.percent_hispanic_deadly_force = util.parseFloat(
      (
        results.police_violence.hispanic_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_hispanic_deadly_force = 0
  }

  // Calculate Percentage of Asian Pacific Islander Deadly Force
  if (typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed) {
    results.report.percent_asianpacificislander_deadly_force = util.parseFloat(
      (
        results.police_violence.asian_pacific_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_asianpacificislander_deadly_force = 0
  }

  // Calculate Percentage of White Deadly Force
  if (typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed) {
    results.report.percent_white_deadly_force = util.parseFloat(
      (
        results.police_violence.white_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_white_deadly_force = 0
  }

  // Calculate Percentage of Other Deadly Force
  if (typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.asian_pacific_people_killed !== 'undefined' && typeof results.police_violence.white_people_killed !== 'undefined' && typeof results.police_violence.hispanic_people_killed !== 'undefined' && typeof results.police_violence.black_people_killed !== 'undefined' && typeof results.police_violence.other_people_killed) {
    results.report.percent_other_deadly_force = util.parseFloat(
      (
        results.police_violence.other_people_killed / (
          results.police_violence.asian_pacific_people_killed +
          results.police_violence.white_people_killed +
          results.police_violence.hispanic_people_killed +
          results.police_violence.black_people_killed +
          results.police_violence.other_people_killed
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_other_deadly_force = 0
  }

  // Calculate Percent Misdemeanor Arrests
  if (typeof results.arrests.low_level_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 && typeof results.arrests.arrests_2018) {
    results.report.percent_misdemeanor_arrests = util.parseFloat(
      (
        results.arrests.low_level_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_misdemeanor_arrests = 0
  }

  // Calculate Drug Possession Arrests
  if (typeof results.arrests.black_drug_arrests !== 'undefined' && typeof results.arrests.nonblack_drug_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 && typeof results.arrests.arrests_2018) {
    results.report.percent_drug_possession_arrests = util.parseFloat(
      (
        (
          results.arrests.black_drug_arrests +
          results.arrests.nonblack_drug_arrests
        ) / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_drug_possession_arrests = 0
  }

  // Calculate Violent Crime Arrests
  if (typeof results.arrests.violent_crime_arrests !== 'undefined' && typeof results.arrests.arrests_2013 !== 'undefined' && typeof results.arrests.arrests_2014 !== 'undefined' && typeof results.arrests.arrests_2015 !== 'undefined' && typeof results.arrests.arrests_2016 !== 'undefined' && typeof results.arrests.arrests_2017 && typeof results.arrests.arrests_2018) {
    results.report.percent_violent_crime_arrests = util.parseFloat(
      (
        results.arrests.violent_crime_arrests / (
          results.arrests.arrests_2013 +
          results.arrests.arrests_2014 +
          results.arrests.arrests_2015 +
          results.arrests.arrests_2016 +
          results.arrests.arrests_2017 +
          results.arrests.arrests_2018
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_violent_crime_arrests = 0
  }

  // Calculate Black Murder Unsolved Rate
  if (typeof results.homicide.black_murders_unsolved !== 'undefined' && typeof results.homicide.black_murders_solved !== 'undefined') {
    results.report.black_murder_unsolved_rate = util.parseFloat(
      (
        results.homicide.black_murders_unsolved / (
          results.homicide.black_murders_unsolved +
          results.homicide.black_murders_solved
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.black_murder_unsolved_rate = 0
  }

  // Calculate Hispanic Murder Unsolved Rate
  if (typeof results.homicide.hispanic_murders_unsolved !== 'undefined' && typeof results.homicide.hispanic_murders_solved !== 'undefined') {
    results.report.hispanic_murder_unsolved_rate = util.parseFloat(
      (
        results.homicide.hispanic_murders_unsolved / (
          results.homicide.hispanic_murders_unsolved +
          results.homicide.hispanic_murders_solved
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.hispanic_murder_unsolved_rate = 0
  }

  // Calculate White Murder Unsolved Rate
  if (typeof results.homicide.white_murders_unsolved !== 'undefined' && typeof results.homicide.white_murders_solved !== 'undefined') {
    results.report.white_murder_unsolved_rate = util.parseFloat(
      (
        results.homicide.white_murders_unsolved / (
          results.homicide.white_murders_unsolved +
          results.homicide.white_murders_solved
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.white_murder_unsolved_rate = 0
  }

  // Calculate Percent Police Budget
  if (typeof results.police_funding.police_budget !== 'undefined' && typeof results.police_funding.total_budget !== 'undefined') {
    results.report.percent_police_budget = util.parseFloat(
      (
        (
          results.police_funding.police_budget / results.police_funding.total_budget
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_police_budget = 0
  }

  // Calculate Percent Health Budget
  if (typeof results.police_funding.health_budget !== 'undefined' && typeof results.police_funding.total_budget !== 'undefined') {
    results.report.percent_health_budget = util.parseFloat(
      (
        (
          results.police_funding.health_budget / results.police_funding.total_budget
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_health_budget = 0
  }

  // Calculate Percent Housing Budget
  if (typeof results.police_funding.housing_budget !== 'undefined' && typeof results.police_funding.total_budget !== 'undefined') {
    results.report.percent_housing_budget = util.parseFloat(
      (
        (
          results.police_funding.housing_budget / results.police_funding.total_budget
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_housing_budget = 0
  }

  // Calculate Percent Education Budget
  if (typeof results.police_funding.education_budget !== 'undefined' && typeof results.police_funding.total_budget !== 'undefined') {
    results.report.percent_education_budget = util.parseFloat(
      (
        (
          results.police_funding.education_budget / results.police_funding.total_budget
        ) * 100
      ).toFixed(2)
    )
  } else {
    results.report.percent_education_budget = 0
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
        'report',
        'city',
        'county'
      ]
    }).then((agencies) => {
      if (agencies) {
        const grades = []

        agencies.forEach((agency) => {
          const grade = util.getGrade(agency.report.dataValues.overall_score)
          const slug = util.createSlug(agency.dataValues.name)

          grades.push({
            agency_name: agency.dataValues.name,
            overall_score: agency.report.dataValues.overall_score,
            change_overall_score: agency.report.dataValues.change_overall_score || 0,
            grade_class: grade.class,
            grade_letter: grade.letter,
            slug: slug,
            district: (agency.county) ? `us-${state.toLowerCase()}-${agency.county.dataValues.fips_county_code}` : null,
            latitude: (agency.city) ? util.parseFloat(agency.city.dataValues.latitude) : null,
            longitude: (agency.city) ? util.parseFloat(agency.city.dataValues.longitude) : null,
            title: `${agency.dataValues.name}, ${stateDetails.name} ${util.titleCase(agency.dataValues.type, true)}`,
            url: `/?state=${state.toLowerCase()}&type=${agency.dataValues.type}&location=${slug}`
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
        'report'
      ]
    }).then((agencies) => {
      if (agencies) {
        const cleanAgencies = {}

        agencies.forEach((agency) => {
          const grade = util.getGrade(agency.report.dataValues.overall_score)
          const stateDetails = util.getStateAbbrByID(agency.dataValues.state_id)

          if (stateDetails) {
            // Create State Object
            if (!cleanAgencies.hasOwnProperty(stateDetails.abbr)) { // eslint-disable-line no-prototype-builtins
              cleanAgencies[stateDetails.abbr] = {
                average_grade_class: '',
                average_grade_letter: '',
                average_grade_marker: '',
                average_score: 0,
                total_agencies: 0,
                total_overall_score: 0,
                total_population: 0
              }
            }

            // Create Type Object for State
            if (!cleanAgencies[stateDetails.abbr].hasOwnProperty(agency.dataValues.type)) { // eslint-disable-line no-prototype-builtins
              cleanAgencies[stateDetails.abbr][agency.dataValues.type] = []
            }

            const slug = util.createSlug(agency.dataValues.name)

            // Add Agencies to State
            cleanAgencies[stateDetails.abbr][agency.dataValues.type].push({
              agency_name: agency.dataValues.name,
              grade_class: grade.class,
              grade_letter: grade.letter,
              grade_marker: grade.marker,
              overall_score: agency.report.dataValues.overall_score,
              population: agency.dataValues.total_population,
              slug: slug,
              title: `${agency.dataValues.name}, ${stateDetails.name} ${util.titleCase(agency.dataValues.type, true)}`,
              url: `/?state=${stateDetails.abbr.toLowerCase()}&type=${agency.dataValues.type}&location=${slug}`
            })
          }
        })

        // Generate Report per State and Prepare for Output
        Object.keys(cleanAgencies).forEach(key => {
          Object.keys(cleanAgencies[key]).forEach(type => {
            const currentCount = parseInt(cleanAgencies[key].total_agencies) || 0
            const currentPopulation = parseInt(cleanAgencies[key].total_population) || 0
            const currentOverallScore = parseInt(cleanAgencies[key].total_overall_score) || 0

            cleanAgencies[key][type] = _.reverse(_.sortBy(cleanAgencies[key][type], ['population']))
            cleanAgencies[key].total_agencies = currentCount + cleanAgencies[key][type].length
            cleanAgencies[key].total_population = currentPopulation + _.sumBy(cleanAgencies[key][type], 'population')
            cleanAgencies[key].total_overall_score = currentOverallScore + _.sumBy(cleanAgencies[key][type], 'overall_score')
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

    // Search Counties for Sheriff Department
    return models.scorecard_agency.findAll({
      where: {
        state_id: stateDetails.id
      },
      include: [
        'report'
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
          // Create Type Object for State
          if (!cleanAgencies.hasOwnProperty(agency.dataValues.type)) { // eslint-disable-line no-prototype-builtins
            cleanAgencies[agency.dataValues.type] = []
          }

          const grade = util.getGrade(agency.report.dataValues.overall_score)
          const slug = util.createSlug(agency.dataValues.name)

          cleanAgencies[agency.dataValues.type].push({
            agency_name: agency.dataValues.name,
            grade_class: grade.class,
            grade_letter: grade.letter,
            grade_marker: grade.marker,
            overall_score: agency.report.dataValues.overall_score,
            population: agency.dataValues.total_population,
            slug: slug,
            title: `${agency.dataValues.name}, ${stateDetails.name} ${util.titleCase(agency.dataValues.type, true)}`,
            url: `/?state=${state.toLowerCase()}&type=${agency.dataValues.type}&location=${slug}`
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
