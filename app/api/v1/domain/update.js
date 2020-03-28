/**
 * @module domain/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const fs = require('fs')
const https = require('https')
const csv = require('csv-parse')

const { Op } = require('sequelize')

const config = require('../../../config')
const models = require('../../../models')
const util = require('./util')

const SCORECARD_PATH = './app/data/scorecard.csv'
const SCORECARD_COLUMNS = [
  'agency_name',
  'location_name',
  'agency_type',
  'state',
  'ori',
  'total_population',
  'white_population',
  'black_population',
  'hispanic_population',
  'asian_pacific_population',
  'other_population',
  'mayor_name',
  'mayor_email',
  'mayor_phone',
  'mayor_contact_url',
  'police_chief_name',
  'police_chief_email',
  'police_chief_phone',
  'police_chief_contact_url',
  'less_lethal_force_2016',
  'less_lethal_force_2017',
  'less_lethal_force_2018',
  'police_shootings_2016',
  'police_shootings_2017',
  'police_shootings_2018',
  'white_people_killed',
  'black_people_killed',
  'hispanic_people_killed',
  'asian_pacific_people_killed',
  'other_people_killed',
  'unarmed_people_killed',
  'vehicle_people_killed',
  'armed_people_killed',
  'fatality_rate',
  'shot_first',
  'people_killed_or_injured_armed_with_gun',
  'people_killed_or_injured_gun_perceived',
  'people_killed_or_injured_unarmed',
  'people_killed_or_injured_vehicle_incident',
  'people_killed_or_injured_black',
  'people_killed_or_injured_white',
  'people_killed_or_injured_hispanic',
  'people_killed_or_injured_asian_pacific',
  'people_killed_or_injured_other',
  'all_deadly_force_incidents',
  'civilian_complaints_reported',
  'civilian_complaints_sustained',
  'use_of_force_complaints_reported',
  'use_of_force_complaints_sustained',
  'discrimination_complaints_reported',
  'discrimination_complaints_sustained',
  'criminal_complaints_reported',
  'criminal_complaints_sustained',
  'complaints_in_detention_reported',
  'complaints_in_detention_sustained',
  'arrests_2013',
  'arrests_2014',
  'arrests_2015',
  'arrests_2016',
  'arrests_2017',
  'arrests_2018',
  'low_level_arrests',
  'violent_crime_arrests',
  'black_arrests',
  'white_arrests',
  'hispanic_arrests',
  'asian_pacific_arrests',
  'other_arrests',
  'black_drug_arrests',
  'hispanic_drug_arrests',
  'white_drug_arrests',
  'other_drug_arrests',
  'nonblack_drug_arrests',
  'white_murders_unsolved',
  'black_murders_unsolved',
  'hispanic_murders_unsolved',
  'white_murders_solved',
  'black_murders_solved',
  'hispanic_murders_solved',
  'homicides_2013_2018',
  'homicides_2013_2018_solved',
  'black_jail_population',
  'hispanic_jail_population',
  'white_jail_population',
  'other_jail_population',
  'avg_daily_jail_population',
  'total_jail_population',
  'unconvicted_jail_population',
  'misdemeanor_jail_population',
  'ice_holds',
  'other_ice_transfers',
  'violent_ice_transfers',
  'drug_ice_transfers',
  'jail_deaths_homicide',
  'jail_deaths_suicide',
  'jail_deaths_other',
  'jail_deaths_investigating',
  'total_budget',
  'police_budget',
  'education_budget',
  'housing_budget',
  'health_budget',
  'disqualifies_complaints',
  'policy_language_disqualifies_complaints',
  'restricts_delays_interrogations',
  'policy_language_restricts_delays_interrogations',
  'gives_officers_unfair_access_to_information',
  'policy_language_gives_officers_unfair_access_to_information',
  'limits_oversight_discipline',
  'policy_language_limits_oversight_discipline',
  'requires_city_pay_for_misconduct',
  'policy_language_requires_city_pay_for_misconduct',
  'erases_misconduct_records',
  'policy_language_erases_misconduct_records',
  'requires_deescalation',
  'policy_language_requires_deescalation',
  'bans_chokeholds_and_strangleholds',
  'policy_language_bans_chokeholds_and_strangleholds',
  'duty_to_intervene',
  'policy_language_duty_to_intervene',
  'requires_warning_before_shooting',
  'policy_language_requires_warning_before_shooting',
  'restricts_shooting_at_moving_vehicles',
  'policy_language_restricts_shooting_at_moving_vehicles',
  'requires_comprehensive_reporting',
  'policy_language_requires_comprehensive_reporting',
  'requires_exhaust_other_means_before_shooting',
  'policy_language_requires_exhaust_other_means_before_shooting',
  'has_use_of_force_continuum',
  'policy_language_has_use_of_force_continuum',
  'policy_manual_link',
  'police_union_contract_link',
  'calc_total_less_lethal_force_estimated',
  'calc_less_lethal_per_10k_arrests',
  'calc_percentile_less_lethal_force',
  'calc_killed_by_police_per_10k_arrests',
  'calc_percentile_killed_by_police',
  'calc_unarmed_killed_by_police_per_10k_arrests',
  'calc_percentile_unarmed_killed_by_police',
  'calc_complaints_sustained',
  'calc_percentile_complaints_sustained',
  'calc_percent_use_of_force_complaints_sustained',
  'calc_percent_discrimination_complaints_sustained',
  'calc_percent_criminal_complaints_sustained',
  'calc_percent_complaints_in_detention_sustained',
  'calc_low_level_arrests_per_1k_population',
  'calc_percentile_low_level_arrests_per_1k_population',
  'calc_percent_murders_solved',
  'calc_jail_incarceration_per_1k_population',
  'calc_percentile_jail_incarceration_per_1k_population',
  'calc_jail_deaths_per_1k_jail_population',
  'calc_percentile_jail_deaths_per_1k_jail_population',
  'calc_black_drug_arrest_disparity',
  'calc_black_deadly_force_disparity_per_arrest',
  'calc_overall_disparity_index',
  'calc_percentile_overall_disparity_index',
  'calc_overall_score',
  'calc_police_violence_score',
  'calc_police_accountability_score',
  'calc_approach_to_policing_score',
  'calc_police_spending_per_resident',
  'calc_percentile_police_spending',
  'change_overall_score',
  'change_police_violence_score',
  'change_police_accountability_score',
  'change_approach_to_policing_score',
  'currently_updating_use_of_force',
  'currently_updating_union_contract',
  'include_in_scorecard'
]

/**
 * Private Update or Insert Functions
 */
const __upsertScorecardAgency = (scorecard, condition) => {
  return models.scorecard_agency.findOne({
    where: condition
  })
    .then(agency => {
      // update
      if (agency) {
        return agency.update(scorecard.agency)
      }

      // insert
      return models.scorecard_agency.create(scorecard.agency)
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.arrests)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id
        data.state_id = condition.state_id

        __upsertScorecardArrests(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.homicide)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardHomicide(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.jail)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardJail(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.police_accountability)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardPoliceAccountability(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.police_funding)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardPoliceFunding(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.police_violence)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardPoliceViolence(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.policy)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardPolicy(data, where)
      }

      return agency
    })
    .then(agency => {
      if (typeof agency.id !== 'undefined') {
        const data = Object.assign({}, scorecard.report)
        const where = {
          agency_id: agency.id
        }

        data.agency_id = agency.id

        __upsertScorecardReport(data, where)
      }

      return agency
    })
    .catch(err => {
      throw new Error(err)
    })
}

/**
 * Update or Insert Scorecard Arrests
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardArrests = (scorecard, condition) => {
  return models.scorecard_arrests.findOne({
    where: condition
  })
    .then(arrests => {
      // update
      if (arrests) {
        return arrests.update(scorecard)
      }

      // insert
      return models.scorecard_arrests.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardArrests: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Homicides
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardHomicide = (scorecard, condition) => {
  return models.scorecard_homicide.findOne({
    where: condition
  })
    .then(homicide => {
      // update
      if (homicide) {
        return homicide.update(scorecard)
      }

      // insert
      return models.scorecard_homicide.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardHomicide: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Jail
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardJail = (scorecard, condition) => {
  return models.scorecard_jail.findOne({
    where: condition
  })
    .then(jail => {
      // update
      if (jail) {
        return jail.update(scorecard)
      }

      // insert
      return models.scorecard_jail.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardJail: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Police Accountability
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardPoliceAccountability = (scorecard, condition) => {
  return models.scorecard_police_accountability.findOne({
    where: condition
  })
    .then(policeAccountability => {
      // update
      if (policeAccountability) {
        return policeAccountability.update(scorecard)
      }

      // insert
      return models.scorecard_police_accountability.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardPoliceAccountability: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Police Funding
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardPoliceFunding = (scorecard, condition) => {
  return models.scorecard_police_funding.findOne({
    where: condition
  })
    .then(policeFunding => {
      // update
      if (policeFunding) {
        return policeFunding.update(scorecard)
      }

      // insert
      return models.scorecard_police_funding.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardPoliceFunding: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Police Violence
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardPoliceViolence = (scorecard, condition) => {
  return models.scorecard_police_violence.findOne({
    where: condition
  })
    .then(policeViolence => {
      // update
      if (policeViolence) {
        return policeViolence.update(scorecard)
      }

      // insert
      return models.scorecard_police_violence.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardPoliceViolence: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Policy
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardPolicy = (scorecard, condition) => {
  return models.scorecard_policy.findOne({
    where: condition
  })
    .then(policy => {
      // update
      if (policy) {
        return policy.update(scorecard)
      }

      // insert
      return models.scorecard_policy.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardPolicy: ${err.message}`)
    })
}

/**
 * Update or Insert Scorecard Report
 * @param {Object} scorecard
 * @param {Object} condition
 */
const __upsertScorecardReport = (scorecard, condition) => {
  return models.scorecard_report.findOne({
    where: condition
  })
    .then(report => {
      // update
      if (report) {
        return report.update(scorecard)
      }

      // insert
      return models.scorecard_report.create(scorecard)
    })
    .catch(err => {
      throw new Error(`ERROR __upsertScorecardReport: ${err.message}`)
    })
}

/**
 * Domain Update
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput (data) {
    const fields = []

    return _.pick(data._source, fields)
  },

  /**
   * Download Scorecard CSV File from Google Sheets
   */
  downloadScorecard () {
    return new Promise((resolve, reject) => {
      const req = https.get(config.get('documents.scorecard'), (resp) => {
        if (resp.statusCode === 200) {
          const scorecard = fs.createWriteStream(SCORECARD_PATH)
          resp.pipe(scorecard)

          scorecard.on('finish', () => {
            scorecard.close(() => {
              return resolve()
            })
          })
        }
      })

      req.setTimeout(12000, () => {
        req.abort()
        return reject()
      })
    })
  },

  /**
   * Validate Scorecard
   */
  validateScorecard () {
    return new Promise((resolve, reject) => {
      let currentRow = 0

      const scorecard = fs.createReadStream(SCORECARD_PATH)

      scorecard.pipe(csv())
        .on('data', (row) => {
          // Check that first row headers match SCORECARD_COLUMNS
          if (currentRow === 0) {
            if (JSON.stringify(row) !== JSON.stringify(SCORECARD_COLUMNS)) {
              scorecard.destroy()
              return reject('Invalid Scorecard Header')
            }
          } else {
            // Check that each row has the right number of columns
            if (row.length !== SCORECARD_COLUMNS.length) {
              scorecard.destroy()
              return reject('Invalid Scorecard Row')
            }
          }

          currentRow += 1
        })
        .on('end', () => {
          return resolve(currentRow)
        })
        .on('error', (err) => {
          return reject(err)
        })
    })
  },

  importScorecard (rowCount) {
    return new Promise((resolve, reject) => {
      // Setup Stream to Read CSV File
      const scorecard = fs.createReadStream(SCORECARD_PATH)
      const importErrors = []
      const importWarnings = []
      const processed = []

      const checkComplete = () => {
        if (processed.length === (rowCount - 1)) {
          resolve({
            data: processed,
            errors: importErrors,
            warnings: importWarnings
          })
        }
      }

      // Set the encoding to be utf8
      scorecard.setEncoding('UTF8')

      // Loop through each row of CSV
      scorecard.on('error', (err) => {
        importWarnings.push(err)
      }).pipe(
        csv({
          columns: true,
          trim: true,
          skip_empty_lines: true,
          skip_lines_with_error: true
        })
      )
        .on('data', row => {
          // Cleanup CVS Data before handing off to Model
          const cleanData = {
            agency: {
              name: util.titleCase(row.agency_name, true),
              type: util.parseString(row.agency_type),
              ori: util.parseString(row.ori),
              total_population: util.parseInt(row.total_population),
              white_population: util.parseFloat(row.white_population),
              black_population: util.parseFloat(row.black_population),
              hispanic_population: util.parseFloat(row.hispanic_population),
              asian_pacific_population: util.parseFloat(row.asian_pacific_population),
              other_population: util.parseFloat(row.other_population),
              mayor_name: util.parseString(row.mayor_name),
              mayor_email: util.parseEmail(row.mayor_email),
              mayor_phone: util.parsePhone(row.mayor_phone),
              mayor_contact_url: util.parseURL(row.mayor_contact_url),
              police_chief_name: util.parseString(row.police_chief_name),
              police_chief_email: util.parseEmail(row.police_chief_email),
              police_chief_phone: util.parsePhone(row.police_chief_phone),
              police_chief_contact_url: util.parseURL(row.police_chief_contact_url)
            },
            arrests: {
              arrests_2013: util.parseInt(row.arrests_2013),
              arrests_2014: util.parseInt(row.arrests_2014),
              arrests_2015: util.parseInt(row.arrests_2015),
              arrests_2016: util.parseInt(row.arrests_2016),
              arrests_2017: util.parseInt(row.arrests_2017),
              arrests_2018: util.parseInt(row.arrests_2018),
              low_level_arrests: util.parseInt(row.low_level_arrests),
              violent_crime_arrests: util.parseInt(row.violent_crime_arrests),
              black_arrests: util.parseInt(row.black_arrests),
              white_arrests: util.parseInt(row.white_arrests),
              hispanic_arrests: util.parseInt(row.hispanic_arrests),
              asian_pacific_arrests: util.parseInt(row.asian_pacific_arrests),
              other_arrests: util.parseInt(row.other_arrests),
              black_drug_arrests: util.parseInt(row.black_drug_arrests),
              hispanic_drug_arrests: util.parseInt(row.hispanic_drug_arrests),
              white_drug_arrests: util.parseInt(row.white_drug_arrests),
              other_drug_arrests: util.parseInt(row.other_drug_arrests),
              nonblack_drug_arrests: util.parseInt(row.nonblack_drug_arrests)
            },
            homicide: {
              white_murders_unsolved: util.parseInt(row.white_murders_unsolved),
              black_murders_unsolved: util.parseInt(row.black_murders_unsolved),
              hispanic_murders_unsolved: util.parseInt(row.hispanic_murders_unsolved),
              white_murders_solved: util.parseInt(row.white_murders_solved),
              black_murders_solved: util.parseInt(row.black_murders_solved),
              hispanic_murders_solved: util.parseInt(row.hispanic_murders_solved),
              homicides_2013_2018: util.parseInt(row.homicides_2013_2018),
              homicides_2013_2018_solved: util.parseInt(row.homicides_2013_2018_solved)
            },
            jail: {
              black_jail_population: util.parseInt(row.black_jail_population),
              hispanic_jail_population: util.parseInt(row.hispanic_jail_population),
              white_jail_population: util.parseInt(row.white_jail_population),
              other_jail_population: util.parseInt(row.other_jail_population),
              avg_daily_jail_population: util.parseInt(row.avg_daily_jail_population),
              total_jail_population: util.parseInt(row.total_jail_population),
              unconvicted_jail_population: util.parseInt(row.unconvicted_jail_population),
              misdemeanor_jail_population: util.parseInt(row.misdemeanor_jail_population),
              ice_holds: util.parseInt(row.ice_holds),
              other_ice_transfers: util.parseInt(row.other_ice_transfers),
              violent_ice_transfers: util.parseInt(row.violent_ice_transfers),
              drug_ice_transfers: util.parseInt(row.drug_ice_transfers),
              jail_deaths_homicide: util.parseInt(row.jail_deaths_homicide),
              jail_deaths_suicide: util.parseInt(row.jail_deaths_suicide),
              jail_deaths_other: util.parseInt(row.jail_deaths_other),
              jail_deaths_investigating: util.parseInt(row.jail_deaths_investigating)
            },
            police_accountability: {
              civilian_complaints_reported: util.parseInt(row.civilian_complaints_reported),
              civilian_complaints_sustained: util.parseInt(row.civilian_complaints_sustained),
              use_of_force_complaints_reported: util.parseInt(row.use_of_force_complaints_reported),
              use_of_force_complaints_sustained: util.parseInt(row.use_of_force_complaints_sustained),
              discrimination_complaints_reported: util.parseInt(row.discrimination_complaints_reported),
              discrimination_complaints_sustained: util.parseInt(row.discrimination_complaints_sustained),
              criminal_complaints_reported: util.parseInt(row.criminal_complaints_reported),
              criminal_complaints_sustained: util.parseInt(row.criminal_complaints_sustained),
              complaints_in_detention_reported: util.parseInt(row.complaints_in_detention_reported),
              complaints_in_detention_sustained: util.parseInt(row.complaints_in_detention_sustained)
            },
            police_funding: {
              total_budget: util.parseInt(row.total_budget),
              police_budget: util.parseInt(row.police_budget),
              education_budget: util.parseInt(row.education_budget),
              housing_budget: util.parseInt(row.housing_budget),
              health_budget: util.parseInt(row.health_budget)
            },
            police_violence: {
              less_lethal_force_2016: util.parseInt(row.less_lethal_force_2016),
              less_lethal_force_2017: util.parseInt(row.less_lethal_force_2017),
              less_lethal_force_2018: util.parseInt(row.less_lethal_force_2018),
              police_shootings_2016: util.parseInt(row.police_shootings_2016),
              police_shootings_2017: util.parseInt(row.police_shootings_2017),
              police_shootings_2018: util.parseInt(row.police_shootings_2018),
              white_people_killed: util.parseInt(row.white_people_killed),
              black_people_killed: util.parseInt(row.black_people_killed),
              hispanic_people_killed: util.parseInt(row.hispanic_people_killed),
              asian_pacific_people_killed: util.parseInt(row.asian_pacific_people_killed),
              other_people_killed: util.parseInt(row.other_people_killed),
              unarmed_people_killed: util.parseInt(row.unarmed_people_killed),
              vehicle_people_killed: util.parseInt(row.vehicle_people_killed),
              armed_people_killed: util.parseInt(row.armed_people_killed),
              fatality_rate: util.parseInt(row.fatality_rate),
              shot_first: util.parseInt(row.shot_first),
              people_killed_or_injured_armed_with_gun: util.parseInt(row.people_killed_or_injured_armed_with_gun),
              people_killed_or_injured_gun_perceived: util.parseInt(row.people_killed_or_injured_gun_perceived),
              people_killed_or_injured_unarmed: util.parseInt(row.people_killed_or_injured_unarmed),
              people_killed_or_injured_vehicle_incident: util.parseInt(row.people_killed_or_injured_vehicle_incident),
              people_killed_or_injured_black: util.parseInt(row.people_killed_or_injured_black),
              people_killed_or_injured_white: util.parseInt(row.people_killed_or_injured_white),
              people_killed_or_injured_hispanic: util.parseInt(row.people_killed_or_injured_hispanic),
              people_killed_or_injured_asian_pacific: util.parseInt(row.people_killed_or_injured_asian_pacific),
              people_killed_or_injured_other: util.parseInt(row.people_killed_or_injured_other),
              all_deadly_force_incidents: util.parseInt(row.all_deadly_force_incidents)
            },
            policy: {
              disqualifies_complaints: util.parseBoolean(row.disqualifies_complaints),
              policy_language_disqualifies_complaints: util.parseBoolean(row.policy_language_disqualifies_complaints),
              restricts_delays_interrogations: util.parseBoolean(row.restricts_delays_interrogations),
              policy_language_restricts_delays_interrogations: util.parseBoolean(row.policy_language_restricts_delays_interrogations),
              gives_officers_unfair_access_to_information: util.parseBoolean(row.gives_officers_unfair_access_to_information),
              policy_language_gives_officers_unfair_access_to_information: util.parseBoolean(row.policy_language_gives_officers_unfair_access_to_information),
              limits_oversight_discipline: util.parseBoolean(row.limits_oversight_discipline),
              policy_language_limits_oversight_discipline: util.parseBoolean(row.policy_language_limits_oversight_discipline),
              requires_city_pay_for_misconduct: util.parseBoolean(row.requires_city_pay_for_misconduct),
              policy_language_requires_city_pay_for_misconduct: util.parseBoolean(row.policy_language_requires_city_pay_for_misconduct),
              erases_misconduct_records: util.parseBoolean(row.erases_misconduct_records),
              policy_language_erases_misconduct_records: util.parseBoolean(row.policy_language_erases_misconduct_records),
              requires_deescalation: util.parseBoolean(row.requires_deescalation),
              policy_language_requires_deescalation: util.parseBoolean(row.policy_language_requires_deescalation),
              bans_chokeholds_and_strangleholds: util.parseBoolean(row.bans_chokeholds_and_strangleholds),
              policy_language_bans_chokeholds_and_strangleholds: util.parseBoolean(row.policy_language_bans_chokeholds_and_strangleholds),
              duty_to_intervene: util.parseBoolean(row.duty_to_intervene),
              policy_language_duty_to_intervene: util.parseBoolean(row.policy_language_duty_to_intervene),
              requires_warning_before_shooting: util.parseBoolean(row.requires_warning_before_shooting),
              policy_language_requires_warning_before_shooting: util.parseBoolean(row.policy_language_requires_warning_before_shooting),
              restricts_shooting_at_moving_vehicles: util.parseBoolean(row.restricts_shooting_at_moving_vehicles),
              policy_language_restricts_shooting_at_moving_vehicles: util.parseBoolean(row.policy_language_restricts_shooting_at_moving_vehicles),
              requires_comprehensive_reporting: util.parseBoolean(row.requires_comprehensive_reporting),
              policy_language_requires_comprehensive_reporting: util.parseBoolean(row.policy_language_requires_comprehensive_reporting),
              requires_exhaust_other_means_before_shooting: util.parseBoolean(row.requires_exhaust_other_means_before_shooting),
              policy_language_requires_exhaust_other_means_before_shooting: util.parseBoolean(row.policy_language_requires_exhaust_other_means_before_shooting),
              has_use_of_force_continuum: util.parseBoolean(row.has_use_of_force_continuum),
              policy_language_has_use_of_force_continuum: util.parseBoolean(row.policy_language_has_use_of_force_continuum),
              policy_manual_link: util.parseURL(row.policy_manual_link),
              police_union_contract_link: util.parseURL(row.police_union_contract_link)
            },
            report: {
              approach_to_policing_score: util.parseInt(row.calc_approach_to_policing_score),
              black_deadly_force_disparity_per_arrest: util.parseFloat(row.calc_black_deadly_force_disparity_per_arrest),
              black_drug_arrest_disparity: util.parseFloat(row.calc_black_drug_arrest_disparity),
              change_approach_to_policing_score: util.parseInt(row.change_approach_to_policing_score),
              change_overall_score: util.parseInt(row.change_overall_score),
              change_police_accountability_score: util.parseInt(row.change_police_accountability_score),
              change_police_violence_score: util.parseInt(row.change_police_violence_score),
              complaints_sustained: util.parseInt(row.calc_complaints_sustained),
              currently_updating_union_contract: util.parseBoolean(row.currently_updating_union_contract),
              currently_updating_use_of_force: util.parseBoolean(row.currently_updating_use_of_force),
              jail_deaths_per_1k_jail_population: util.parseFloat(row.calc_jail_deaths_per_1k_jail_population),
              jail_incarceration_per_1k_population: util.parseFloat(row.calc_jail_incarceration_per_1k_population),
              killed_by_police_per_10k_arrests: util.parseFloat(row.calc_killed_by_police_per_10k_arrests),
              less_lethal_per_10k_arrests: util.parseFloat(row.calc_less_lethal_per_10k_arrests),
              low_level_arrests_per_1k_population: util.parseFloat(row.calc_low_level_arrests_per_1k_population),
              overall_disparity_index: util.parseFloat(row.calc_overall_disparity_index),
              overall_score: util.parseInt(row.calc_overall_score),
              percent_complaints_in_detention_sustained: util.parseInt(row.calc_percent_complaints_in_detention_sustained),
              percent_criminal_complaints_sustained: util.parseInt(row.calc_percent_criminal_complaints_sustained),
              percent_discrimination_complaints_sustained: util.parseInt(row.calc_percent_discrimination_complaints_sustained),
              percent_murders_solved: util.parseInt(row.calc_percent_murders_solved),
              percent_use_of_force_complaints_sustained: util.parseInt(row.calc_percent_use_of_force_complaints_sustained),
              percentile_complaints_sustained: util.parseInt(row.calc_percentile_complaints_sustained),
              percentile_jail_deaths_per_1k_jail_population: util.parseInt(row.calc_percentile_jail_deaths_per_1k_jail_population),
              percentile_jail_incarceration_per_1k_population: util.parseInt(row.calc_percentile_jail_incarceration_per_1k_population),
              percentile_killed_by_police: util.parseInt(row.calc_percentile_killed_by_police),
              percentile_less_lethal_force: util.parseInt(row.calc_percentile_less_lethal_force),
              percentile_low_level_arrests_per_1k_population: util.parseInt(row.calc_percentile_low_level_arrests_per_1k_population),
              percentile_overall_disparity_index: util.parseFloat(row.calc_percentile_overall_disparity_index),
              percentile_police_spending: util.parseInt(row.calc_percentile_police_spending),
              percentile_unarmed_killed_by_police: util.parseInt(row.calc_percentile_unarmed_killed_by_police),
              police_accountability_score: util.parseInt(row.calc_police_accountability_score),
              police_spending_per_resident: util.parseFloat(row.calc_police_spending_per_resident),
              police_violence_score: util.parseInt(row.calc_police_violence_score),
              total_less_lethal_force_estimated: util.parseFloat(row.calc_total_less_lethal_force_estimated),
              unarmed_killed_by_police_per_10k_arrests: util.parseFloat(row.calc_unarmed_killed_by_police_per_10k_arrests)
            }
          }

          if (row.agency_type === 'sheriff') {
            // Search Counties for Sheriff Department
            models.geo_counties.findOne({
              where: {
                name: {
                  [Op.eq]: util.titleCase(row.location_name)
                }
              },
              include: [{
                model: models.geo_states,
                where: {
                  abbr: row.state
                }
              }]
            }).then((result) => {
              if (result) {
                // Add
                cleanData.agency.country_id = result.country_id
                cleanData.agency.state_id = result.state_id
                cleanData.agency.county_id = result.id

                // Update or Insert Agency
                __upsertScorecardAgency(cleanData, {
                  country_id: cleanData.agency.country_id,
                  state_id: cleanData.agency.state_id,
                  county_id: cleanData.agency.county_id,
                  type: cleanData.agency.type
                }).then(() => {
                  processed.push({
                    success: true,
                    message: 'Imported Successfully',
                    location: `${util.titleCase(row.location_name)}, ${row.state}`
                  })

                  checkComplete()
                }).catch((err) => {
                  importErrors.push(`${util.titleCase(row.location_name)}, ${row.state}: ${err.message}`)

                  processed.push({
                    success: false,
                    message: err.message,
                    location: `${util.titleCase(row.location_name)}, ${row.state}`
                  })

                  checkComplete()
                })
              } else {
                importWarnings.push(`${util.titleCase(row.location_name)}, ${row.state}: Could Not Locate County`)

                processed.push({
                  success: false,
                  message: 'Could Not Locate County',
                  location: `${util.titleCase(row.location_name)}, ${row.state}`
                })

                checkComplete()
              }
            }).catch((err) => {
              importErrors.push(err)

              processed.push({
                success: false,
                message: err.message,
                location: `${util.titleCase(row.location_name)}, ${row.state}`
              })

              checkComplete()
            })
          } else if (row.agency_type === 'police-department') {
            // Search Counties for Sheriff Department
            models.geo_cities.findOne({
              where: {
                name: {
                  [Op.eq]: util.titleCase(row.location_name)
                }
              },
              include: [{
                model: models.geo_states,
                where: {
                  abbr: row.state
                }
              }]
            }).then((result) => {
              if (result) {
                // Add
                cleanData.agency.country_id = result.country_id
                cleanData.agency.state_id = result.state_id
                cleanData.agency.city_id = result.id

                // Update or Insert Agency
                __upsertScorecardAgency(cleanData, {
                  country_id: cleanData.agency.country_id,
                  state_id: cleanData.agency.state_id,
                  city_id: cleanData.agency.city_id,
                  type: cleanData.agency.type
                }).then(() => {
                  processed.push({
                    success: true,
                    message: 'Imported Successfully',
                    location: `${util.titleCase(row.location_name)}, ${row.state}`
                  })

                  checkComplete()
                }).catch((err) => {
                  importErrors.push(`${util.titleCase(row.location_name)}, ${row.state}: ${err.message}`)

                  processed.push({
                    success: false,
                    message: err.message,
                    location: `${util.titleCase(row.location_name)}, ${row.state}`
                  })

                  checkComplete()
                })
              } else {
                importWarnings.push(`${util.titleCase(row.location_name)}, ${row.state}: Could Not Locate City`)

                processed.push({
                  success: false,
                  message: 'Could Not Locate City',
                  location: `${util.titleCase(row.location_name)}, ${row.state}`
                })

                checkComplete()
              }
            }).catch((err) => {
              importErrors.push(err)

              processed.push({
                success: false,
                message: err.message,
                location: `${util.titleCase(row.location_name)}, ${row.state}`
              })

              checkComplete()
            })
          } else {
            processed.push({
              success: false,
              message: `Skipped ${row.agency_type}`,
              location: `${util.titleCase(row.location_name)}, ${row.state}`
            })

            checkComplete()
          }
        })
    })
  }
}
