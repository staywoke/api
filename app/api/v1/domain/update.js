/**
 * @module domain/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/* istanbul ignore file */

/**
 * @NOTE: This file is only used by administration and senior software developers
 * and is therefor not directly accessible via the API without authentication
 */

const _ = require('lodash')
const fs = require('fs')
const https = require('https')
const csv = require('csv-parse')
const sequelize = require('sequelize')

const config = require('../../../config')
const models = require('../../../models')
const util = require('./util')

const SCORECARD_PATH = './app/data/scorecard.csv'
const SCORECARD_COLUMNS = [
  'agency_name',
  'location_name',
  'agency_type',
  'state',
  'fips_state_code',
  'fips_place_code',
  'fips_county_code',
  'fips_county_sub_code',
  'latitude',
  'longitude',
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
  'calc_percentile_murders_solved',
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
 * Calculate Black Deadly Force Disparity Per Population
 * @param {object} row from CSV File
 */
const __calcBlackDeadlyForceDisparityPerPopulation = (row) => {
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const blackPopulation = util.parseFloat(row.black_population) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0
  const whitePopulation = util.parseFloat(row.white_population) || 0

  if (blackPeopleKilled && blackPopulation && whitePeopleKilled && whitePopulation) {
    return util.parseFloat(((blackPeopleKilled / blackPopulation) / (whitePeopleKilled / whitePopulation)).toFixed(2))
  }

  return 0
}

/**
 * Calculate Black Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcBlackMurderUnsolvedRate = (row) => {
  const blackMurdersSolved = util.parseInt(row.black_murders_solved) || 0
  const blackMurdersUnsolved = util.parseInt(row.black_murders_unsolved) || 0

  if (blackMurdersUnsolved && blackMurdersSolved) {
    return util.parseFloat((blackMurdersUnsolved / (blackMurdersUnsolved + blackMurdersSolved) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Deadly Force Incidents per Arrest per 10k
 * @param {object} row from CSV File
 */
const __calcDeadlyForceIncidentsPerArrestPer10k = (row) => {
  const allDeadlyForceIncidents = util.parseInt(row.all_deadly_force_incidents) || 0
  const totalArrests = __calcTotalArrests(row)

  if (totalArrests && allDeadlyForceIncidents) {
    return util.parseFloat(((allDeadlyForceIncidents / totalArrests) * 10000).toFixed(2))
  }

  return 0
}

/**
 * Calculate Deadly Force Incidents per Arrest
 * @param {object} row from CSV File
 */
const __calcDeadlyForceIncidentsPerArrest = (row) => {
  const allDeadlyForceIncidents = util.parseInt(row.all_deadly_force_incidents) || 0
  const totalArrests = __calcTotalArrests(row)

  if (totalArrests && allDeadlyForceIncidents) {
    return util.parseFloat((allDeadlyForceIncidents / totalArrests).toFixed(6))
  }

  return 0
}

/**
 * Calculate Hispanic Deadly Force Disparity per Population
 * @param {object} row from CSV File
 */
const __calcHispanicDeadlyForceDisparityPerPopulation = (row) => {
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const hispanicPopulation = util.parseInt(row.hispanic_population) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0
  const whitePopulation = util.parseFloat(row.white_population) || 0

  if (hispanicPeopleKilled && hispanicPopulation && whitePeopleKilled && whitePopulation) {
    return util.parseFloat(((hispanicPeopleKilled / hispanicPopulation) / (whitePeopleKilled / whitePopulation)).toFixed(2))
  }

  return 0
}

/**
 * Calculate Hispanic Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcHispanicMurderUnsolvedRate = (row) => {
  const hispanicMurdersSolved = util.parseInt(row.hispanic_murders_solved) || 0
  const hispanicMurdersUnsolved = util.parseInt(row.hispanic_murders_unsolved) || 0

  if (hispanicMurdersUnsolved && hispanicMurdersSolved) {
    return util.parseFloat((hispanicMurdersUnsolved / (hispanicMurdersUnsolved + hispanicMurdersSolved) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Less Lethal Force Change
 * @param {object} row from CSV File
 */
const __calcLessLethalForceChange = (row) => {
  const lessLethalForce2016 = util.parseInt(row.less_lethal_force_2016) || 0
  const lessLethalForce2018 = util.parseInt(row.less_lethal_force_2018) || 0

  if (lessLethalForce2016 && lessLethalForce2018) {
    return Math.floor((lessLethalForce2018 / lessLethalForce2016) * 100) - 100
  }

  return 0
}

/**
 * Calculate Percent Asian Pacific Arrests
 * @param {object} row from CSV File
 */
const __calcPercentAsianPacificArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const asianPacificArrests = util.parseInt(row.asian_pacific_arrests) || 0

  if (asianPacificArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        asianPacificArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (asianPacificArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Asian Pacific Islander Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentAsianPacificIslanderDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (asianPacificPeopleKilled && (blackPeopleKilled || hispanicPeopleKilled || otherPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        asianPacificPeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (asianPacificPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Black Arrests
 * @param {object} row from CSV File
 */
const __calcPercentBlackArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const blackArrests = util.parseInt(row.black_arrests) || 0

  if (blackArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        blackArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (blackArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Black Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentBlackDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (blackPeopleKilled && (asianPacificPeopleKilled || hispanicPeopleKilled || otherPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        blackPeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (blackPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Drug Possession Arrests
 * @param {object} row from CSV File
 */
const __calcPercentDrugPossessionArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const blackDrugArrests = util.parseInt(row.black_drug_arrests) || 0
  const nonBlackDrugArrests = util.parseInt(row.nonblack_drug_arrests) || 0

  if ((blackDrugArrests || nonBlackDrugArrests) && (arrests2013 || arrests2013 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        (
          blackDrugArrests +
          nonBlackDrugArrests
        ) / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (blackDrugArrests || nonBlackDrugArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Education Budget
 * @param {object} row from CSV File
 */
const __calcPercentEducationBudget = (row) => {
  const educationBudget = util.parseInt(row.education_budget) || 0
  const totalBudget = util.parseInt(row.total_budget) || 0

  if (educationBudget && totalBudget) {
    return util.parseFloat(((educationBudget / totalBudget) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Percent Health Budget
 * @param {object} row from CSV File
 */
const __calcPercentHealthBudget = (row) => {
  const healthBudget = util.parseInt(row.health_budget) || 0
  const totalBudget = util.parseInt(row.total_budget) || 0

  if (healthBudget && totalBudget) {
    return util.parseFloat(((healthBudget / totalBudget) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Percent Hispanic Arrests
 * @param {object} row from CSV File
 */
const __calcPercentHispanicArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const hispanicArrests = util.parseInt(row.hispanic_arrests) || 0

  if (hispanicArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        hispanicArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (hispanicArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Hispanic Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentHispanicDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (hispanicPeopleKilled && (asianPacificPeopleKilled || blackPeopleKilled || otherPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        hispanicPeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (hispanicPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Housing Budget
 * @param {object} row from CSV File
 */
const __calcPercentHousingBudget = (row) => {
  const housingBudget = util.parseInt(row.housing_budget) || 0
  const totalBudget = util.parseInt(row.total_budget) || 0

  if (housingBudget && totalBudget) {
    return util.parseFloat(((housingBudget / totalBudget) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Percent Misdemeanor Arrests
 * @param {object} row from CSV File
 */
const __calcPercentMisdemeanorArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const lowLevelArrests = util.parseInt(row.low_level_arrests) || 0

  if (lowLevelArrests && (arrests2013 || arrests2013 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        lowLevelArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (lowLevelArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Other Arrests
 * @param {object} row from CSV File
 */
const __calcPercentOtherArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const otherArrests = util.parseInt(row.other_arrests) || 0

  if (otherArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        otherArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (otherArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Other Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentOtherDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (otherPeopleKilled && (asianPacificPeopleKilled || blackPeopleKilled || hispanicPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        otherPeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (otherPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Police Budget
 * @param {object} row from CSV File
 */
const __calcPercentPoliceBudget = (row) => {
  const policeBudget = util.parseInt(row.police_budget) || 0
  const totalBudget = util.parseInt(row.total_budget) || 0

  if (policeBudget && totalBudget) {
    return util.parseFloat(((policeBudget / totalBudget) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Percent Police Misperceive the Person to Have Gun
 * @param {object} row from CSV File
 */
const __calcPercentPoliceMisperceiveThePersonToHaveGun = (row) => {
  const peopleKilledOrInjuredArmedWithGun = util.parseInt(row.people_killed_or_injured_armed_with_gun) || 0
  const peopleKilledOrInjuredGunPerceived = util.parseInt(row.people_killed_or_injured_gun_perceived) || 0

  if (peopleKilledOrInjuredArmedWithGun > 0 && peopleKilledOrInjuredGunPerceived > 0) {
    const measure = (100 - Math.floor((peopleKilledOrInjuredArmedWithGun / peopleKilledOrInjuredGunPerceived) * 100))
    return (measure > 0) ? measure : 0
  }

  return 0
}

/**
 * Calculate Percent Shot First
 * @param {object} row from CSV File
 */
const __calcPercentShotFirst = (row) => {
  const shotFirst = util.parseInt(row.shot_first) || 0
  const policeShootings2016 = util.parseInt(row.police_shootings_2016) || 0
  const policeShootings2017 = util.parseInt(row.police_shootings_2017) || 0
  const policeShootings2018 = util.parseInt(row.police_shootings_2018) || 0

  if (shotFirst && (policeShootings2016 || policeShootings2017 || policeShootings2018)) {
    return Math.floor(
      (
        shotFirst / (
          policeShootings2016 +
          policeShootings2017 +
          policeShootings2018
        )
      ) * 100
    )
  } else if (shotFirst) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Used Against People Who Were Not Armed with Gun
 * @param {object} row from CSV File
 */
const __calcPercentUsedAgainstPeopleWhoWereNotArmedWithGun = (row) => {
  const armedPeopleKilled = util.parseInt(row.armed_people_killed) || 0
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (armedPeopleKilled && (asianPacificPeopleKilled || blackPeopleKilled || hispanicPeopleKilled || otherPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        100 - (
          (
            armedPeopleKilled / (
              asianPacificPeopleKilled +
              blackPeopleKilled +
              hispanicPeopleKilled +
              otherPeopleKilled +
              whitePeopleKilled
            )
          ) * 100
        )
      ).toFixed(2)
    )
  } else if (armedPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Used Against People Who Were Unarmed
 * @param {object} row from CSV File
 */
const __calcPercentUsedAgainstPeopleWhoWereUnarmed = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const unarmedPeopleKilled = util.parseInt(row.unarmed_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (unarmedPeopleKilled && (asianPacificPeopleKilled || blackPeopleKilled || hispanicPeopleKilled || otherPeopleKilled || whitePeopleKilled)) {
    return util.parseFloat(
      (
        unarmedPeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (unarmedPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Violent Crime Arrests
 * @param {object} row from CSV File
 */
const __calcPercentViolentCrimeArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const violentCrimeArrests = util.parseInt(row.violent_crime_arrests) || 0

  if (violentCrimeArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        violentCrimeArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (violentCrimeArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent White Arrests
 * @param {object} row from CSV File
 */
const __calcPercentWhiteArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0
  const whiteArrests = util.parseInt(row.white_arrests) || 0

  if (whiteArrests && (arrests2013 || arrests2014 || arrests2015 || arrests2016 || arrests2017 || arrests2018)) {
    return util.parseFloat(
      (
        whiteArrests / (
          arrests2013 +
          arrests2014 +
          arrests2015 +
          arrests2016 +
          arrests2017 +
          arrests2018
        ) * 100
      ).toFixed(2)
    )
  } else if (whiteArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent White Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentWhiteDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  if (whitePeopleKilled && (asianPacificPeopleKilled || blackPeopleKilled || hispanicPeopleKilled || otherPeopleKilled)) {
    return util.parseFloat(
      (
        whitePeopleKilled / (
          asianPacificPeopleKilled +
          blackPeopleKilled +
          hispanicPeopleKilled +
          otherPeopleKilled +
          whitePeopleKilled
        ) * 100
      ).toFixed(2)
    )
  } else if (whitePeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Police Shootings Incidents
 * @param {object} row from CSV File
 */
const __calcPoliceShootingsIncidents = (row) => {
  const policeShootings2016 = util.parseInt(row.police_shootings_2016) || 0
  const policeShootings2017 = util.parseInt(row.police_shootings_2017) || 0
  const policeShootings2018 = util.parseInt(row.police_shootings_2018) || 0

  return (policeShootings2016 + policeShootings2017 + policeShootings2018)
}

/**
 * Calculate Times More Misdemeanor Arrests than Violent Crime
 * @param {object} row from CSV File
 */
const __calcTimesMoreMisdemeanorArrestsThanViolentCrime = (row) => {
  const lowLevelArrests = util.parseInt(row.low_level_arrests) || 0
  const violentCrimeArrests = util.parseInt(row.violent_crime_arrests) || 0

  if (lowLevelArrests && violentCrimeArrests) {
    return Math.floor(lowLevelArrests / violentCrimeArrests)
  }

  return 0
}

/**
 * Calculate Total Arrests
 * @param {object} row from CSV File
 */
const __calcTotalArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013) || 0
  const arrests2014 = util.parseInt(row.arrests_2014) || 0
  const arrests2015 = util.parseInt(row.arrests_2015) || 0
  const arrests2016 = util.parseInt(row.arrests_2016) || 0
  const arrests2017 = util.parseInt(row.arrests_2017) || 0
  const arrests2018 = util.parseInt(row.arrests_2018) || 0

  const totalArrests = []

  if (arrests2013) {
    totalArrests.push(arrests2013)
  }

  if (arrests2014) {
    totalArrests.push(arrests2014)
  }

  if (arrests2015) {
    totalArrests.push(arrests2015)
  }

  if (arrests2016) {
    totalArrests.push(arrests2016)
  }

  if (arrests2017) {
    totalArrests.push(arrests2017)
  }

  if (arrests2018) {
    totalArrests.push(arrests2018)
  }

  return (totalArrests.length) ? Math.floor(_.sum(totalArrests) / totalArrests.length) * totalArrests.length : 0
}

/**
 * Calculate Total Jail Deaths 2016 - 2018
 * @param {object} row from CSV File
 */
const __calcTotalJailDeaths20162018 = (row) => {
  const jailDeathsHomicide = util.parseInt(row.jail_deaths_homicide) || 0
  const jailDeathsInvestigating = util.parseInt(row.jail_deaths_investigating) || 0
  const jailDeathsOther = util.parseInt(row.jail_deaths_other) || 0
  const jailDeathsSuicide = util.parseInt(row.jail_deaths_suicide) || 0

  return (jailDeathsHomicide + jailDeathsInvestigating + jailDeathsOther + jailDeathsSuicide)
}

/**
 * Calculate Total People Killed
 * @param {object} row from CSV File
 */
const __calcTotalPeopleKilled = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed) || 0

  return (asianPacificPeopleKilled + blackPeopleKilled + hispanicPeopleKilled + otherPeopleKilled + whitePeopleKilled)
}

/**
 * Calculate White Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcWhiteMurderUnsolvedRate = (row) => {
  const whiteMurdersSolved = util.parseInt(row.white_murders_solved) || 0
  const whiteMurdersUnsolved = util.parseInt(row.white_murders_unsolved) || 0

  if (whiteMurdersUnsolved && whiteMurdersSolved) {
    return util.parseFloat((whiteMurdersUnsolved / (whiteMurdersUnsolved + whiteMurdersSolved) * 100).toFixed(2))
  }

  return 0
}

/**
 * Update or Insert Scorecard Agency
 * @param {Object} scorecard
 * @param {Object} condition
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

        return __upsertScorecardArrests(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardHomicide(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardJail(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardPoliceAccountability(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardPoliceFunding(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardPoliceViolence(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardPolicy(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
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

        return __upsertScorecardReport(data, where).then(() => {
          return agency
        }).catch((err) => {
          throw new Error(err)
        })
      }

      return agency
    })
    .catch(err => {
      throw new Error(`${err} - ${JSON.stringify(scorecard.agency)}`)
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
      throw new Error(`__upsertScorecardArrests: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardHomicide: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardJail: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardPoliceAccountability: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardPoliceFunding: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardPoliceViolence: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardPolicy: ${err.message} ${JSON.stringify(scorecard)}`)
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
      throw new Error(`__upsertScorecardReport: ${err.message} ${JSON.stringify(scorecard)}`)
    })
}

/**
 * Update or Insert County
 * @param {Object} row
 * @param {Object} condition
 */
const __upsertCounty = (row) => {
  const state = util.getStateByID(row.state)
  const data = {
    country_id: 1,
    state_id: state.id,
    name: util.titleCase(row.location_name),
    fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
    fips_county_code: util.leftPad(row.fips_county_code, 3, '0')
  }

  return models.geo_counties.findOne({
    where: {
      fips_state_code: data.fips_state_code,
      fips_county_code: data.fips_county_code
    }
  })
    .then(county => {
      // update
      if (county) {
        return county.update(data)
      }

      // insert
      return models.geo_counties.create(data)
    })
    .catch(err => {
      throw new Error(`__upsertCounty: ${err.message} ${JSON.stringify(data)}`)
    })
}

/**
 * Update or Insert City
 * @param {Object} row
 * @param {Object} condition
 */
const __upsertCity = (row) => {
  const state = util.getStateByID(row.state)
  const data = {
    country_id: 1,
    state_id: state.id,
    name: util.titleCase(row.location_name),
    fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
    fips_place_code: util.leftPad(row.fips_place_code, 5, '0'),
    latitude: row.latitude,
    longitude: row.longitude,
    coordinate: sequelize.fn('ST_GeomFromText', `POINT(${row.latitude} ${row.longitude})`)
  }

  return models.geo_cities.findOne({
    where: {
      fips_state_code: data.fips_state_code,
      fips_place_code: data.fips_place_code
    }
  })
    .then(city => {
      // update
      if (city) {
        return city.update(data)
      }

      // insert
      return models.geo_cities.create(data)
    })
    .catch(err => {
      throw new Error(`__upsertCity: ${err.message} ${JSON.stringify(data)}`)
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
          // Get Report Card Grade
          const grade = util.getGrade(util.parseInt(row.calc_overall_score))

          // Cleanup CVS Data before handing off to Model
          const cleanData = {
            agency: {
              asian_pacific_population: util.parseFloat(row.asian_pacific_population),
              black_population: util.parseFloat(row.black_population),
              hispanic_population: util.parseFloat(row.hispanic_population),
              mayor_contact_url: util.parseURL(row.mayor_contact_url),
              mayor_email: util.parseEmail(row.mayor_email),
              mayor_name: util.parseString(row.mayor_name),
              mayor_phone: util.parsePhone(row.mayor_phone),
              name: util.titleCase(row.agency_name, true),
              ori: util.parseString(row.ori),
              other_population: util.parseFloat(row.other_population),
              police_chief_contact_url: util.parseURL(row.police_chief_contact_url),
              police_chief_email: util.parseEmail(row.police_chief_email),
              police_chief_name: util.parseString(row.police_chief_name),
              police_chief_phone: util.parsePhone(row.police_chief_phone),
              slug: util.createSlug(row.agency_name),
              total_population: util.parseInt(row.total_population),
              type: util.parseString(row.agency_type),
              white_population: util.parseFloat(row.white_population)
            },
            arrests: {
              arrests_2013: util.parseInt(row.arrests_2013),
              arrests_2014: util.parseInt(row.arrests_2014),
              arrests_2015: util.parseInt(row.arrests_2015),
              arrests_2016: util.parseInt(row.arrests_2016),
              arrests_2017: util.parseInt(row.arrests_2017),
              arrests_2018: util.parseInt(row.arrests_2018),
              asian_pacific_arrests: util.parseInt(row.asian_pacific_arrests),
              black_arrests: util.parseInt(row.black_arrests),
              black_drug_arrests: util.parseInt(row.black_drug_arrests),
              hispanic_arrests: util.parseInt(row.hispanic_arrests),
              hispanic_drug_arrests: util.parseInt(row.hispanic_drug_arrests),
              low_level_arrests: util.parseInt(row.low_level_arrests),
              non_black_drug_arrests: util.parseInt(row.nonblack_drug_arrests),
              other_arrests: util.parseInt(row.other_arrests),
              other_drug_arrests: util.parseInt(row.other_drug_arrests),
              violent_crime_arrests: util.parseInt(row.violent_crime_arrests),
              white_arrests: util.parseInt(row.white_arrests),
              white_drug_arrests: util.parseInt(row.white_drug_arrests)
            },
            homicide: {
              black_murders_solved: util.parseInt(row.black_murders_solved),
              black_murders_unsolved: util.parseInt(row.black_murders_unsolved),
              hispanic_murders_solved: util.parseInt(row.hispanic_murders_solved),
              hispanic_murders_unsolved: util.parseInt(row.hispanic_murders_unsolved),
              homicides_2013_2018_solved: util.parseInt(row.homicides_2013_2018_solved),
              homicides_2013_2018: util.parseInt(row.homicides_2013_2018),
              white_murders_solved: util.parseInt(row.white_murders_solved),
              white_murders_unsolved: util.parseInt(row.white_murders_unsolved)
            },
            jail: {
              avg_daily_jail_population: util.parseInt(row.avg_daily_jail_population),
              black_jail_population: util.parseInt(row.black_jail_population),
              drug_ice_transfers: util.parseInt(row.drug_ice_transfers),
              hispanic_jail_population: util.parseInt(row.hispanic_jail_population),
              ice_holds: util.parseInt(row.ice_holds),
              jail_deaths_homicide: util.parseInt(row.jail_deaths_homicide),
              jail_deaths_investigating: util.parseInt(row.jail_deaths_investigating),
              jail_deaths_other: util.parseInt(row.jail_deaths_other),
              jail_deaths_suicide: util.parseInt(row.jail_deaths_suicide),
              misdemeanor_jail_population: util.parseInt(row.misdemeanor_jail_population),
              other_ice_transfers: util.parseInt(row.other_ice_transfers),
              other_jail_population: util.parseInt(row.other_jail_population),
              total_jail_population: util.parseInt(row.total_jail_population),
              unconvicted_jail_population: util.parseInt(row.unconvicted_jail_population),
              violent_ice_transfers: util.parseInt(row.violent_ice_transfers),
              white_jail_population: util.parseInt(row.white_jail_population)
            },
            police_accountability: {
              civilian_complaints_reported: util.parseInt(row.civilian_complaints_reported),
              civilian_complaints_sustained: util.parseInt(row.civilian_complaints_sustained),
              complaints_in_detention_reported: util.parseInt(row.complaints_in_detention_reported),
              complaints_in_detention_sustained: util.parseInt(row.complaints_in_detention_sustained),
              criminal_complaints_reported: util.parseInt(row.criminal_complaints_reported),
              criminal_complaints_sustained: util.parseInt(row.criminal_complaints_sustained),
              discrimination_complaints_reported: util.parseInt(row.discrimination_complaints_reported),
              discrimination_complaints_sustained: util.parseInt(row.discrimination_complaints_sustained),
              use_of_force_complaints_reported: util.parseInt(row.use_of_force_complaints_reported),
              use_of_force_complaints_sustained: util.parseInt(row.use_of_force_complaints_sustained)
            },
            police_funding: {
              education_budget: util.parseInt(row.education_budget),
              health_budget: util.parseInt(row.health_budget),
              housing_budget: util.parseInt(row.housing_budget),
              police_budget: util.parseInt(row.police_budget),
              total_budget: util.parseInt(row.total_budget)
            },
            police_violence: {
              all_deadly_force_incidents: util.parseInt(row.all_deadly_force_incidents),
              armed_people_killed: util.parseInt(row.armed_people_killed),
              asian_pacific_people_killed: util.parseInt(row.asian_pacific_people_killed),
              black_people_killed: util.parseInt(row.black_people_killed),
              fatality_rate: util.parseInt(row.fatality_rate),
              hispanic_people_killed: util.parseInt(row.hispanic_people_killed),
              less_lethal_force_2016: util.parseInt(row.less_lethal_force_2016),
              less_lethal_force_2017: util.parseInt(row.less_lethal_force_2017),
              less_lethal_force_2018: util.parseInt(row.less_lethal_force_2018),
              other_people_killed: util.parseInt(row.other_people_killed),
              people_killed_or_injured_armed_with_gun: util.parseInt(row.people_killed_or_injured_armed_with_gun),
              people_killed_or_injured_asian_pacific: util.parseInt(row.people_killed_or_injured_asian_pacific),
              people_killed_or_injured_black: util.parseInt(row.people_killed_or_injured_black),
              people_killed_or_injured_gun_perceived: util.parseInt(row.people_killed_or_injured_gun_perceived),
              people_killed_or_injured_hispanic: util.parseInt(row.people_killed_or_injured_hispanic),
              people_killed_or_injured_other: util.parseInt(row.people_killed_or_injured_other, true),
              people_killed_or_injured_unarmed: util.parseInt(row.people_killed_or_injured_unarmed),
              people_killed_or_injured_vehicle_incident: util.parseInt(row.people_killed_or_injured_vehicle_incident),
              people_killed_or_injured_white: util.parseInt(row.people_killed_or_injured_white),
              police_shootings_2016: util.parseInt(row.police_shootings_2016),
              police_shootings_2017: util.parseInt(row.police_shootings_2017),
              police_shootings_2018: util.parseInt(row.police_shootings_2018),
              shot_first: util.parseInt(row.shot_first),
              unarmed_people_killed: util.parseInt(row.unarmed_people_killed),
              vehicle_people_killed: util.parseInt(row.vehicle_people_killed),
              white_people_killed: util.parseInt(row.white_people_killed)
            },
            policy: {
              bans_chokeholds_and_strangleholds: util.parseBoolean(row.bans_chokeholds_and_strangleholds),
              disqualifies_complaints: util.parseBoolean(row.disqualifies_complaints),
              duty_to_intervene: util.parseBoolean(row.duty_to_intervene),
              erases_misconduct_records: util.parseBoolean(row.erases_misconduct_records),
              gives_officers_unfair_access_to_information: util.parseBoolean(row.gives_officers_unfair_access_to_information),
              has_use_of_force_continuum: util.parseBoolean(row.has_use_of_force_continuum),
              limits_oversight_discipline: util.parseBoolean(row.limits_oversight_discipline),
              police_union_contract_link: util.parseURL(row.police_union_contract_link),
              policy_language_bans_chokeholds_and_strangleholds: util.parseString(row.policy_language_bans_chokeholds_and_strangleholds),
              policy_language_disqualifies_complaints: util.parseString(row.policy_language_disqualifies_complaints),
              policy_language_duty_to_intervene: util.parseString(row.policy_language_duty_to_intervene),
              policy_language_erases_misconduct_records: util.parseString(row.policy_language_erases_misconduct_records),
              policy_language_gives_officers_unfair_access_to_information: util.parseString(row.policy_language_gives_officers_unfair_access_to_information),
              policy_language_has_use_of_force_continuum: util.parseString(row.policy_language_has_use_of_force_continuum),
              policy_language_limits_oversight_discipline: util.parseString(row.policy_language_limits_oversight_discipline),
              policy_language_requires_city_pay_for_misconduct: util.parseString(row.policy_language_requires_city_pay_for_misconduct),
              policy_language_requires_comprehensive_reporting: util.parseString(row.policy_language_requires_comprehensive_reporting),
              policy_language_requires_deescalation: util.parseString(row.policy_language_requires_deescalation),
              policy_language_requires_exhaust_other_means_before_shooting: util.parseString(row.policy_language_requires_exhaust_other_means_before_shooting),
              policy_language_requires_warning_before_shooting: util.parseString(row.policy_language_requires_warning_before_shooting),
              policy_language_restricts_delays_interrogations: util.parseString(row.policy_language_restricts_delays_interrogations),
              policy_language_restricts_shooting_at_moving_vehicles: util.parseString(row.policy_language_restricts_shooting_at_moving_vehicles),
              policy_manual_link: util.parseURL(row.policy_manual_link),
              requires_city_pay_for_misconduct: util.parseBoolean(row.requires_city_pay_for_misconduct),
              requires_comprehensive_reporting: util.parseBoolean(row.requires_comprehensive_reporting),
              requires_deescalation: util.parseBoolean(row.requires_deescalation),
              requires_exhaust_other_means_before_shooting: util.parseBoolean(row.requires_exhaust_other_means_before_shooting),
              requires_warning_before_shooting: util.parseBoolean(row.requires_warning_before_shooting),
              restricts_delays_interrogations: util.parseBoolean(row.restricts_delays_interrogations),
              restricts_shooting_at_moving_vehicles: util.parseBoolean(row.restricts_shooting_at_moving_vehicles)
            },
            report: {
              approach_to_policing_score: util.parseInt(row.calc_approach_to_policing_score),
              black_deadly_force_disparity_per_arrest: util.parseFloat(row.calc_black_deadly_force_disparity_per_arrest),
              black_deadly_force_disparity_per_population: __calcBlackDeadlyForceDisparityPerPopulation(row),
              black_drug_arrest_disparity: util.parseFloat(row.calc_black_drug_arrest_disparity),
              black_murder_unsolved_rate: __calcBlackMurderUnsolvedRate(row),
              change_approach_to_policing_score: util.parseInt(row.change_approach_to_policing_score),
              change_overall_score: util.parseInt(row.change_overall_score),
              change_police_accountability_score: util.parseInt(row.change_police_accountability_score),
              change_police_violence_score: util.parseInt(row.change_police_violence_score),
              complaints_sustained: util.parseInt(row.calc_complaints_sustained),
              currently_updating_union_contract: util.parseBoolean(row.currently_updating_union_contract),
              currently_updating_use_of_force: util.parseBoolean(row.currently_updating_use_of_force),
              deadly_force_incidents_per_arrest_per_10k: __calcDeadlyForceIncidentsPerArrestPer10k(row),
              deadly_force_incidents_per_arrest: __calcDeadlyForceIncidentsPerArrest(row),
              grade_class: grade.class,
              grade_letter: grade.letter,
              grade_marker: grade.marker,
              hispanic_deadly_force_disparity_per_population: __calcHispanicDeadlyForceDisparityPerPopulation(row),
              hispanic_murder_unsolved_rate: __calcHispanicMurderUnsolvedRate(row),
              jail_deaths_per_1k_jail_population: util.parseFloat(row.calc_jail_deaths_per_1k_jail_population),
              jail_incarceration_per_1k_population: util.parseFloat(row.calc_jail_incarceration_per_1k_population),
              killed_by_police_per_10k_arrests: util.parseFloat(row.calc_killed_by_police_per_10k_arrests),
              less_lethal_force_change: __calcLessLethalForceChange(row),
              less_lethal_per_10k_arrests: util.parseFloat(row.calc_less_lethal_per_10k_arrests),
              low_level_arrests_per_1k_population: util.parseFloat(row.calc_low_level_arrests_per_1k_population),
              overall_disparity_index: util.parseFloat(row.calc_overall_disparity_index),
              overall_score: util.parseInt(row.calc_overall_score),
              percent_asian_pacific_arrests: __calcPercentAsianPacificArrests(row),
              percent_asian_pacific_islander_deadly_force: __calcPercentAsianPacificIslanderDeadlyForce(row),
              percent_black_arrests: __calcPercentBlackArrests(row),
              percent_black_deadly_force: __calcPercentBlackDeadlyForce(row),
              percent_complaints_in_detention_sustained: util.parseInt(row.calc_percent_complaints_in_detention_sustained),
              percent_criminal_complaints_sustained: util.parseInt(row.calc_percent_criminal_complaints_sustained),
              percent_discrimination_complaints_sustained: util.parseInt(row.calc_percent_discrimination_complaints_sustained),
              percent_drug_possession_arrests: __calcPercentDrugPossessionArrests(row),
              percent_education_budget: __calcPercentEducationBudget(row),
              percent_health_budget: __calcPercentHealthBudget(row),
              percent_hispanic_arrests: __calcPercentHispanicArrests(row),
              percent_hispanic_deadly_force: __calcPercentHispanicDeadlyForce(row),
              percent_housing_budget: __calcPercentHousingBudget(row),
              percent_misdemeanor_arrests: __calcPercentMisdemeanorArrests(row),
              percent_murders_solved: util.parseInt(row.calc_percent_murders_solved),
              percent_other_arrests: __calcPercentOtherArrests(row),
              percent_other_deadly_force: __calcPercentOtherDeadlyForce(row),
              percent_police_budget: __calcPercentPoliceBudget(row),
              percent_police_misperceive_the_person_to_have_gun: __calcPercentPoliceMisperceiveThePersonToHaveGun(row),
              percent_shot_first: __calcPercentShotFirst(row),
              percent_use_of_force_complaints_sustained: util.parseInt(row.calc_percent_use_of_force_complaints_sustained),
              percent_used_against_people_who_were_not_armed_with_gun: __calcPercentUsedAgainstPeopleWhoWereNotArmedWithGun(row),
              percent_used_against_people_who_were_unarmed: __calcPercentUsedAgainstPeopleWhoWereUnarmed(row),
              percent_violent_crime_arrests: __calcPercentViolentCrimeArrests(row),
              percent_white_arrests: __calcPercentWhiteArrests(row),
              percent_white_deadly_force: __calcPercentWhiteDeadlyForce(row),
              percentile_complaints_sustained: util.parseInt(row.calc_percentile_complaints_sustained),
              percentile_jail_deaths_per_1k_jail_population: util.parseInt(row.calc_percentile_jail_deaths_per_1k_jail_population),
              percentile_jail_incarceration_per_1k_population: util.parseInt(row.calc_percentile_jail_incarceration_per_1k_population),
              percentile_killed_by_police: util.parseInt(row.calc_percentile_killed_by_police),
              percentile_less_lethal_force: util.parseInt(row.calc_percentile_less_lethal_force),
              percentile_low_level_arrests_per_1k_population: util.parseInt(row.calc_percentile_low_level_arrests_per_1k_population),
              percentile_murders_solved: util.parseInt(row.calc_percentile_murders_solved),
              percentile_overall_disparity_index: util.parseFloat(row.calc_percentile_overall_disparity_index),
              percentile_police_spending: util.parseInt(row.calc_percentile_police_spending),
              percentile_unarmed_killed_by_police: util.parseInt(row.calc_percentile_unarmed_killed_by_police),
              police_accountability_score: util.parseInt(row.calc_police_accountability_score),
              police_shootings_incidents: __calcPoliceShootingsIncidents(row),
              police_spending_per_resident: util.parseFloat(row.calc_police_spending_per_resident),
              police_violence_score: util.parseInt(row.calc_police_violence_score),
              times_more_misdemeanor_arrests_than_violent_crime: __calcTimesMoreMisdemeanorArrestsThanViolentCrime(row),
              total_arrests: __calcTotalArrests(row),
              total_jail_deaths_2016_2018: __calcTotalJailDeaths20162018(row),
              total_less_lethal_force_estimated: util.parseFloat(row.calc_total_less_lethal_force_estimated),
              total_people_killed: __calcTotalPeopleKilled(row),
              unarmed_killed_by_police_per_10k_arrests: util.parseFloat(row.calc_unarmed_killed_by_police_per_10k_arrests),
              white_murder_unsolved_rate: __calcWhiteMurderUnsolvedRate(row)
            }
          }

          const importSheriffData = (row, result, cleanData) => {
            // Add
            cleanData.agency.country_id = result.country_id
            cleanData.agency.state_id = result.state_id
            cleanData.agency.county_id = result.id

            // Update or Insert Agency
            __upsertScorecardAgency(cleanData, {
              ori: row.ori,
              state_id: result.state_id
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
                stack: err.stack,
                location: `${util.titleCase(row.location_name)}, ${row.state}`
              })

              checkComplete()
            })
          }

          const importPoliceData = (row, result, cleanData) => {
            // Add
            cleanData.agency.country_id = result.country_id
            cleanData.agency.state_id = result.state_id
            cleanData.agency.city_id = result.id

            // Update or Insert Agency
            __upsertScorecardAgency(cleanData, {
              ori: row.ori,
              state_id: result.state_id
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
                stack: err.stack,
                location: `${util.titleCase(row.location_name)}, ${row.state}`
              })

              checkComplete()
            })
          }

          const importWarning = (row, type) => {
            importWarnings.push(`${util.titleCase(row.location_name)}, ${row.state}: Could Not Locate ${type}`)

            processed.push({
              success: false,
              message: `Could Not Locate ${type}`,
              location: `${util.titleCase(row.location_name)}, ${row.state}`
            })

            checkComplete()
          }

          const importError = (err, row) => {
            importErrors.push(err)

            processed.push({
              success: false,
              message: err.message,
              stack: err.stack,
              location: `${util.titleCase(row.location_name)}, ${row.state}`
            })

            checkComplete()
          }

          const importSkipped = (row) => {
            processed.push({
              success: false,
              message: `Skipped ${row.agency_type}`,
              location: `${util.titleCase(row.location_name)}, ${row.state}`
            })

            checkComplete()
          }

          if (row.agency_type === 'sheriff') {
            // Search Counties for Sheriff Department
            models.geo_counties.findOne({
              where: {
                fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
                fips_county_code: util.leftPad(row.fips_county_code, 3, '0')
              }
            }).then((result) => {
              if (result) {
                importSheriffData(row, result, cleanData)
              } else {
                return __upsertCounty(row).then((county) => {
                  importSheriffData(row, county, cleanData)
                }).catch(() => {
                  importWarning(row, row.agency_type)
                })
              }
            }).catch((err) => {
              importError(err, row)
            })
          } else if (row.agency_type === 'police-department') {
            // Search Counties for Police Department
            models.geo_cities.findOne({
              where: {
                fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
                fips_place_code: util.leftPad(row.fips_place_code, 5, '0')
              }
            }).then((result) => {
              if (result) {
                importPoliceData(row, result, cleanData)
              } else {
                return __upsertCity(row).then((city) => {
                  importPoliceData(row, city, cleanData)
                }).catch(() => {
                  importWarning(row, row.agency_type)
                })
              }
            }).catch((err) => {
              importError(err, row)
            })
          } else {
            importSkipped(row)
          }
        })
    })
  }
}
