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
const del = require('del')
const fs = require('fs')
const csv = require('csv-parse')
const sequelize = require('sequelize')
const path = require('path')

const config = require('../../../config')
const models = require('../../../models')
const util = require('./util')

const SCORECARD_PATH = path.resolve('./app/data/scorecard.csv')
const SCORECARD_COLUMNS = [
  'agency_name',
  'location_name',
  'status',
  'complete',
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
  'less_lethal_force_2013',
  'less_lethal_force_2014',
  'less_lethal_force_2015',
  'less_lethal_force_2016',
  'less_lethal_force_2017',
  'less_lethal_force_2018',
  'less_lethal_force_2019',
  'police_shootings_2013',
  'police_shootings_2014',
  'police_shootings_2015',
  'police_shootings_2016',
  'police_shootings_2017',
  'police_shootings_2018',
  'police_shootings_2019',
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
  'years_of_complaints_data',
  'arrests_2013',
  'arrests_2014',
  'arrests_2015',
  'arrests_2016',
  'arrests_2017',
  'arrests_2018',
  'arrests_2019',
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
  'homicides_2013_2019',
  'homicides_2013_2019_solved',
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
  'calc_black_deadly_force_disparity',
  'calc_overall_disparity_index',
  'calc_percentile_overall_disparity_index',
  'calc_overall_score',
  'calc_police_violence_score',
  'calc_police_accountability_score',
  'calc_approach_to_policing_score',
  'calc_police_funding_score',
  'calc_police_spending_per_resident',
  'calc_percentile_police_spending',
  'change_overall_score',
  'change_police_violence_score',
  'change_police_accountability_score',
  'change_approach_to_policing_score',
  'currently_updating_use_of_force',
  'currently_updating_union_contract',
  'total_officers_2013',
  'total_officers_2014',
  'total_officers_2015',
  'total_officers_2016',
  'total_officers_2017',
  'total_officers_2018',
  'total_officers_2019',
  'total_budget_2010',
  'total_budget_2011',
  'total_budget_2012',
  'total_budget_2013',
  'total_budget_2014',
  'total_budget_2015',
  'total_budget_2016',
  'total_budget_2017',
  'total_budget_2018',
  'total_budget_2019',
  'total_budget_2020',
  'fines_forfeitures_2010',
  'fines_forfeitures_2011',
  'fines_forfeitures_2012',
  'fines_forfeitures_2013',
  'fines_forfeitures_2014',
  'fines_forfeitures_2015',
  'fines_forfeitures_2016',
  'fines_forfeitures_2017',
  'fines_forfeitures_2018',
  'fines_forfeitures_2019',
  'education_budget',
  'housing_budget_2010',
  'housing_budget_2011',
  'housing_budget_2012',
  'housing_budget_2013',
  'housing_budget_2014',
  'housing_budget_2015',
  'housing_budget_2016',
  'housing_budget_2017',
  'housing_budget_2018',
  'housing_budget_2019',
  'housing_budget_2020',
  'health_budget_2010',
  'health_budget_2011',
  'health_budget_2012',
  'health_budget_2013',
  'health_budget_2014',
  'health_budget_2015',
  'health_budget_2016',
  'health_budget_2017',
  'health_budget_2018',
  'health_budget_2019',
  'health_budget_2020',
  'police_budget_2010',
  'police_budget_2011',
  'police_budget_2012',
  'police_budget_2013',
  'police_budget_2014',
  'police_budget_2015',
  'police_budget_2016',
  'police_budget_2017',
  'police_budget_2018',
  'police_budget_2019',
  'police_budget_2020',
  'budget_source_link',
  'average_annual_misconduct_settlements',
  'year_misconduct_settlement_data',
  'misconduct_settlement_source',
  'calc_officers_per_10k_population',
  'calc_percentile_officers_per_population',
  'calc_fines_forfeitures_per_resident',
  'calc_percentile_fines_forfeitures_per_resident',
  'calc_police_spending_ratio',
  'calc_percentile_police_spending_ratio',
  'calc_misconduct_settlements_per_10k_population',
  'calc_percentile_misconduct_settlements_per_population',
  'calc_police_shootings_per_arrest',
  'calc_percentile_police_shootings_per_arrest',
  'advocacy_tip',
  'civilian_complaints_source',
  'civilian_complaints_source_link',
  'budget_source_name',
  'comparison_group',
  'completeness',
  'calc_hispanic_drug_arrest_disparity',
  'calc_hispanic_deadly_force_disparity',
  'calc_most_severe_drug_arrest_disparity',
  'calc_percentile_drug_arrest_disparity',
  'calc_most_severe_deadly_force_disparity',
  'misconduct_settlement_source_name',
  'change_police_funding_score',
  'police_shootings_2020',
  'less_lethal_force_2020',
  'native_american_arrests',
  'native_american_population',
  'native_american_people_killed',
  'corrections_budget_2010',
  'corrections_budget_2011',
  'corrections_budget_2012',
  'corrections_budget_2013',
  'corrections_budget_2014',
  'corrections_budget_2015',
  'corrections_budget_2016',
  'corrections_budget_2017',
  'corrections_budget_2018',
  'corrections_budget_2019',
  'corrections_budget_2020',
  'low_level_arrests_2013',
  'low_level_arrests_2014',
  'low_level_arrests_2015',
  'low_level_arrests_2016',
  'low_level_arrests_2017',
  'low_level_arrests_2018',
  'low_level_arrests_2019',
  'percent_officers_white',
  'percent_officers_black',
  'percent_officers_hispanic',
  'percent_officers_asianpacific',
  'percent_officers_native_american',
  'percent_officers_other'
]

/**
 * Calculate Black Deadly Force Disparity Per Population
 * @param {object} row from CSV File
 */
const __calcBlackDeadlyForceDisparityPerPopulation = (row) => {
  const blackPeopleKilled = util.parseInt(row.black_people_killed, true) || 0
  const blackPopulation = util.parseFloat(row.black_population, true) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed, true) || 0
  const whitePopulation = util.parseFloat(row.white_population, true) || 0

  if (blackPeopleKilled >= 0 && blackPopulation > 0 && whitePeopleKilled >= 0 && whitePopulation > 0) {
    return util.parseFloat(((blackPeopleKilled / blackPopulation) / (whitePeopleKilled / whitePopulation)).toFixed(2))
  }

  return 0
}

/**
 * Calculate Native American Deadly Force Disparity Per Population
 * @param {object} row from CSV File
 */
const __calcNativeAmericanDeadlyForceDisparityPerPopulation = (row) => {
  const nativeAmericanPeopleKilled = util.parseInt(row.native_american_people_killed, true) || 0
  const nativeAmericanPopulation = util.parseFloat(row.native_american_population, true) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed, true) || 0
  const whitePopulation = util.parseFloat(row.white_population, true) || 0

  if (nativeAmericanPeopleKilled >= 0 && nativeAmericanPopulation > 0 && whitePeopleKilled >= 0 && whitePopulation > 0) {
    return util.parseFloat(((nativeAmericanPeopleKilled / nativeAmericanPopulation) / (whitePeopleKilled / whitePopulation)).toFixed(2))
  }

  return 0
}

/**
 * Calculate Percent Native American Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentNativeAmericanDeadlyForce = (row) => {
  const nativeAmericanPeopleKilled = util.parseInt(row.native_american_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (nativeAmericanPeopleKilled >= 0 && allPeopleKilled > 0 && nativeAmericanPeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        nativeAmericanPeopleKilled / allPeopleKilled * 100
      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && nativeAmericanPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Black Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcBlackMurderUnsolvedRate = (row) => {
  const blackMurdersSolved = util.parseInt(row.black_murders_solved, true) || 0
  const blackMurdersUnsolved = util.parseInt(row.black_murders_unsolved, true) || 0

  if (blackMurdersUnsolved > 0 || blackMurdersSolved > 0) {
    return util.parseFloat((blackMurdersUnsolved / (blackMurdersUnsolved + blackMurdersSolved) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Deadly Force Incidents per Arrest per 10k
 * @param {object} row from CSV File
 */
const __calcDeadlyForceIncidentsPerArrestPer10k = (row) => {
  const allDeadlyForceIncidents = util.parseInt(row.all_deadly_force_incidents, true) || 0
  const totalArrests = __calcTotalArrests(row)

  if (totalArrests > 0 && allDeadlyForceIncidents >= 0) {
    return util.parseFloat(((allDeadlyForceIncidents / totalArrests) * 10000).toFixed(2))
  }

  return 0
}

/**
 * Calculate Deadly Force Incidents per Arrest
 * @param {object} row from CSV File
 */
const __calcDeadlyForceIncidentsPerArrest = (row) => {
  const allDeadlyForceIncidents = util.parseInt(row.all_deadly_force_incidents, true) || 0
  const totalArrests = __calcTotalArrests(row)

  if (totalArrests > 0 && allDeadlyForceIncidents >= 0) {
    return util.parseFloat((allDeadlyForceIncidents / totalArrests).toFixed(6))
  }

  return 0
}

/**
 * Calculate Hispanic Deadly Force Disparity per Population
 * @param {object} row from CSV File
 */
const __calcHispanicDeadlyForceDisparityPerPopulation = (row) => {
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed, true) || 0
  const hispanicPopulation = util.parseInt(row.hispanic_population, true) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed, true) || 0
  const whitePopulation = util.parseFloat(row.white_population, true) || 0

  if (hispanicPeopleKilled >= 0 && hispanicPopulation > 0 && whitePeopleKilled >= 0 && whitePopulation > 0) {
    return util.parseFloat(((hispanicPeopleKilled / hispanicPopulation) / (whitePeopleKilled / whitePopulation)).toFixed(2))
  }

  return 0
}

/**
 * Calculate Hispanic Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcHispanicMurderUnsolvedRate = (row) => {
  const hispanicMurdersSolved = util.parseInt(row.hispanic_murders_solved, true) || 0
  const hispanicMurdersUnsolved = util.parseInt(row.hispanic_murders_unsolved, true) || 0

  if (hispanicMurdersUnsolved > 0 || hispanicMurdersSolved > 0) {
    return util.parseFloat((hispanicMurdersUnsolved / (hispanicMurdersUnsolved + hispanicMurdersSolved) * 100).toFixed(2))
  }

  return 0
}

/**
 * Calculate Less Lethal Force Change
 * @param {object} row from CSV File
 */
const __calcLessLethalForceChange = (row) => {
  const lessLethalForce2016 = util.parseInt(row.less_lethal_force_2016, true) || 0
  const lessLethalForce2018 = util.parseInt(row.less_lethal_force_2018, true) || 0

  if (lessLethalForce2016 > 0 && lessLethalForce2018 >= 0) {
    return Math.floor((lessLethalForce2018 / lessLethalForce2016) * 100) - 100
  }

  return 0
}

/**
 * Calculate Percent Asian Pacific Arrests
 * @param {object} row from CSV File
 */
const __calcPercentAsianPacificArrests = (row) => {
  const asianPacificArrests = util.parseInt(row.asian_pacific_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((asianPacificArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent Asian Pacific Islander Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentAsianPacificIslanderDeadlyForce = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (asianPacificPeopleKilled >= 0 && allPeopleKilled > 0 && asianPacificPeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        asianPacificPeopleKilled / allPeopleKilled * 100
      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && asianPacificPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Black Arrests
 * @param {object} row from CSV File
 */
const __calcPercentBlackArrests = (row) => {
  const blackArrests = util.parseInt(row.black_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((blackArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent Native American Arrests
 * @param {object} row from CSV File
 */
const __calcPercentNativeAmericanArrests = (row) => {
  const nativeAmericanArrests = util.parseInt(row.native_american_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((nativeAmericanArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent Black Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentBlackDeadlyForce = (row) => {
  const blackPeopleKilled = util.parseInt(row.black_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (blackPeopleKilled >= 0 && allPeopleKilled > 0 && blackPeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        blackPeopleKilled / allPeopleKilled * 100

      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && blackPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Drug Possession Arrests
 * @param {object} row from CSV File
 */
const __calcPercentDrugPossessionArrests = (row) => {
  const allArrests = __calcTotalArrests(row)
  const blackDrugArrests = util.parseInt(row.black_drug_arrests, true) || 0
  const nonBlackDrugArrests = util.parseInt(row.nonblack_drug_arrests, true) || 0

  if ((blackDrugArrests > 0 || nonBlackDrugArrests > 0) && allArrests > 0) {
    return util.parseFloat(
      (
        (
          blackDrugArrests +
          nonBlackDrugArrests
        ) / allArrests * 100
      ).toFixed(2)
    )
  } else if (blackDrugArrests > 0 || nonBlackDrugArrests > 0) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Education Budget
 * @param {object} row from CSV File
 */
const __calcPercentEducationBudget = (row) => {
  try {
    if (!row || !row.education_budget || !row.total_budget) {
      return 0
    }

    const educationBudget = util.parseInt(row.education_budget, true) || 0
    const totalBudget = util.parseInt(row.total_budget, true) || 0

    if (educationBudget >= 0 && totalBudget > 0) {
      return util.parseFloat(((educationBudget / totalBudget) * 100).toFixed(2), true, true)
    }

    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Calculate Percent Health Budget
 * @param {object} row from CSV File
 */
const __calcPercentHealthBudget = (row) => {
  try {
    if (!row || !row.health_budget || !row.total_budget) {
      return 0
    }

    const healthBudget = util.parseInt(row.health_budget, true) || 0
    const totalBudget = util.parseInt(row.total_budget, true) || 0

    if (healthBudget >= 0 && totalBudget > 0) {
      return util.parseFloat(((healthBudget / totalBudget) * 100).toFixed(2), true, true)
    }

    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Calculate Percent Corrections Budget
 * @param {object} row from CSV File
 */
const __calcPercentCorrectionsBudget = (row) => {
  try {
    if (!row || !row.corrections_budget || !row.total_budget) {
      return 0
    }

    const correctionsBudget = util.parseInt(row.corrections_budget, true) || 0
    const totalBudget = util.parseInt(row.total_budget, true) || 0

    if (correctionsBudget >= 0 && totalBudget > 0) {
      return util.parseFloat(((correctionsBudget / totalBudget) * 100).toFixed(2), false, true)
    }

    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Calculate Percent Hispanic Arrests
 * @param {object} row from CSV File
 */
const __calcPercentHispanicArrests = (row) => {
  const hispanicArrests = util.parseInt(row.hispanic_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((hispanicArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent Hispanic Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentHispanicDeadlyForce = (row) => {
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (hispanicPeopleKilled >= 0 && allPeopleKilled > 0 && hispanicPeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        hispanicPeopleKilled / allPeopleKilled * 100

      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && hispanicPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Housing Budget
 * @param {object} row from CSV File
 */
const __calcPercentHousingBudget = (row) => {
  try {
    if (!row || !row.housing_budget || !row.total_budget) {
      return 0
    }

    const housingBudget = util.parseInt(row.housing_budget, true) || 0
    const totalBudget = util.parseInt(row.total_budget, true) || 0

    if (housingBudget >= 0 && totalBudget > 0) {
      return util.parseFloat(((housingBudget / totalBudget) * 100).toFixed(2), true, true)
    }

    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Calculate Percent Misdemeanor Arrests
 * @param {object} row from CSV File
 */
const __calcPercentMisdemeanorArrests = (row) => {
  const allArrests = __calcTotalArrests(row)
  const lowLevelArrests = util.parseInt(row.low_level_arrests, true) || 0

  if (lowLevelArrests >= 0 && allArrests > 0) {
    return util.parseFloat(
      (
        lowLevelArrests / allArrests * 100
      ).toFixed(2)
    )
  } else if (lowLevelArrests === allArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Other Arrests
 * @param {object} row from CSV File
 */
const __calcPercentOtherArrests = (row) => {
  const otherArrests = util.parseInt(row.other_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((otherArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent Other Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentOtherDeadlyForce = (row) => {
  const otherPeopleKilled = util.parseInt(row.other_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (otherPeopleKilled >= 0 && allPeopleKilled > 0 && otherPeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        otherPeopleKilled / allPeopleKilled * 100

      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && otherPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Police Budget
 * @param {object} row from CSV File
 */
const __calcPercentPoliceBudget = (row) => {
  try {
    if (!row || !row.police_budget || !row.total_budget) {
      return 0
    }

    const policeBudget = util.parseInt(row.police_budget, true) || 0
    const totalBudget = util.parseInt(row.total_budget, true) || 0

    if (policeBudget >= 0 && totalBudget > 0) {
      return util.parseFloat(((policeBudget / totalBudget) * 100).toFixed(2))
    }

    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Calculate Percent Police Misperceive the Person to Have Gun
 * @param {object} row from CSV File
 */
const __calcPercentPoliceMisperceiveThePersonToHaveGun = (row) => {
  const peopleKilledOrInjuredArmedWithGun = util.parseInt(row.people_killed_or_injured_armed_with_gun, true) || 0
  const peopleKilledOrInjuredGunPerceived = util.parseInt(row.people_killed_or_injured_gun_perceived, true) || 0

  if (peopleKilledOrInjuredArmedWithGun >= 0 && peopleKilledOrInjuredGunPerceived > 0) {
    const measure = (100 - Math.ceil((peopleKilledOrInjuredArmedWithGun / peopleKilledOrInjuredGunPerceived) * 100))
    return (measure > 0) ? measure : 0
  }

  return 0
}

/**
 * Calculate Percent Shot First
 * @param {object} row from CSV File
 */
const __calcPercentShotFirst = (row) => {
  const shotFirst = util.parseInt(row.shot_first, true) || 0
  const allShootings = __calcPoliceShootingsIncidents(row)

  if (shotFirst >= 0 && allShootings > 0) {
    return Math.floor(
      (
        shotFirst / allShootings
      ) * 100
    )
  } else if (shotFirst === allShootings) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Used Against People Who Were Not Armed with Gun
 * @param {object} row from CSV File
 */
const __calcPercentUsedAgainstPeopleWhoWereNotArmedWithGun = (row) => {
  const armedPeopleKilled = util.parseInt(row.armed_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (armedPeopleKilled >= 0 && allPeopleKilled > 0) {
    return util.parseFloat(
      (
        100 - (
          (
            armedPeopleKilled / allPeopleKilled
          ) * 100
        )
      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && armedPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Used Against People Who Were Unarmed
 * @param {object} row from CSV File
 */
const __calcPercentUsedAgainstPeopleWhoWereUnarmed = (row) => {
  const unarmedPeopleKilled = util.parseInt(row.unarmed_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (unarmedPeopleKilled >= 0 && allPeopleKilled > 0) {
    return util.parseFloat(
      (
        unarmedPeopleKilled / allPeopleKilled * 100
      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && unarmedPeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent Violent Crime Arrests
 * @param {object} row from CSV File
 */
const __calcPercentViolentCrimeArrests = (row) => {
  const allArrests = __calcTotalArrests(row)
  const violentCrimeArrests = util.parseInt(row.violent_crime_arrests, true) || 0

  if (violentCrimeArrests >= 0 && allArrests > 0) {
    return util.parseFloat(
      (
        violentCrimeArrests / allArrests * 100
      ).toFixed(2)
    )
  } else if (violentCrimeArrests === allArrests) {
    return 100
  }

  return 0
}

/**
 * Calculate Percent White Arrests
 * @param {object} row from CSV File
 */
const __calcPercentWhiteArrests = (row) => {
  const whiteArrests = util.parseInt(row.white_arrests, true) || 0
  const allArrests = __calcTotalArrests(row)

  return allArrests === 0 ? null : util.parseFloat((whiteArrests / allArrests) * 100, true).toFixed(2)
}

/**
 * Calculate Percent White Deadly Force
 * @param {object} row from CSV File
 */
const __calcPercentWhiteDeadlyForce = (row) => {
  const whitePeopleKilled = util.parseInt(row.white_people_killed, true) || 0
  const allPeopleKilled = __calcTotalPeopleKilled(row)

  if (whitePeopleKilled >= 0 && allPeopleKilled > 0 && whitePeopleKilled < allPeopleKilled) {
    return util.parseFloat(
      (
        whitePeopleKilled / allPeopleKilled * 100

      ).toFixed(2)
    )
  } else if (allPeopleKilled > 0 && whitePeopleKilled === allPeopleKilled) {
    return 100
  }

  return 0
}

/**
 * Calculate Police Shootings Incidents
 * @param {object} row from CSV File
 */
const __calcPoliceShootingsIncidents = (row) => {
  const policeShootings2013 = util.parseInt(row.police_shootings_2013, true) || 0
  const policeShootings2014 = util.parseInt(row.police_shootings_2014, true) || 0
  const policeShootings2015 = util.parseInt(row.police_shootings_2015, true) || 0
  const policeShootings2016 = util.parseInt(row.police_shootings_2016, true) || 0
  const policeShootings2017 = util.parseInt(row.police_shootings_2017, true) || 0
  const policeShootings2018 = util.parseInt(row.police_shootings_2018, true) || 0
  const policeShootings2019 = util.parseInt(row.police_shootings_2019, true) || 0
  const policeShootings2020 = util.parseInt(row.police_shootings_2020, true) || 0
  const policeShootings2021 = util.parseInt(row.police_shootings_2021, true) || 0
  const policeShootings2022 = util.parseInt(row.police_shootings_2022, true) || 0

  return (
    policeShootings2013 +
    policeShootings2014 +
    policeShootings2015 +
    policeShootings2016 +
    policeShootings2017 +
    policeShootings2018 +
    policeShootings2019 +
    policeShootings2020 +
    policeShootings2021 +
    policeShootings2022
  )
}

/**
 * Calculate Times More Misdemeanor Arrests than Violent Crime
 * @param {object} row from CSV File
 */
const __calcTimesMoreMisdemeanorArrestsThanViolentCrime = (row) => {
  const lowLevelArrests = util.parseInt(row.low_level_arrests, true) || 0
  const violentCrimeArrests = util.parseInt(row.violent_crime_arrests, true) || 0

  if (lowLevelArrests >= 0 && violentCrimeArrests > 0) {
    return Math.floor(lowLevelArrests / violentCrimeArrests)
  }

  return 0
}

/**
 * Calculate Total Arrests
 * @param {object} row from CSV File
 */
const __calcTotalArrests = (row) => {
  const arrests2013 = util.parseInt(row.arrests_2013, true) || 0
  const arrests2014 = util.parseInt(row.arrests_2014, true) || 0
  const arrests2015 = util.parseInt(row.arrests_2015, true) || 0
  const arrests2016 = util.parseInt(row.arrests_2016, true) || 0
  const arrests2017 = util.parseInt(row.arrests_2017, true) || 0
  const arrests2018 = util.parseInt(row.arrests_2018, true) || 0
  const arrests2019 = util.parseInt(row.arrests_2019, true) || 0
  const arrests2020 = util.parseInt(row.arrests_2020, true) || 0
  const arrests2021 = util.parseInt(row.arrests_2021, true) || 0
  const arrests2022 = util.parseInt(row.arrests_2022, true) || 0

  return (
    arrests2013 +
    arrests2014 +
    arrests2015 +
    arrests2016 +
    arrests2017 +
    arrests2018 +
    arrests2019 +
    arrests2020 +
    arrests2021 +
    arrests2022
  )
}

/**
 * Calculate Total Low Level Arrests
 * @param {object} row from CSV File
 */
const __calcTotalLowLevelArrests = (row) => {
  const arrests2013 = util.parseInt(row.low_level_arrests_2013, true) || 0
  const arrests2014 = util.parseInt(row.low_level_arrests_2014, true) || 0
  const arrests2015 = util.parseInt(row.low_level_arrests_2015, true) || 0
  const arrests2016 = util.parseInt(row.low_level_arrests_2016, true) || 0
  const arrests2017 = util.parseInt(row.low_level_arrests_2017, true) || 0
  const arrests2018 = util.parseInt(row.low_level_arrests_2018, true) || 0
  const arrests2019 = util.parseInt(row.low_level_arrests_2019, true) || 0
  const arrests2020 = util.parseInt(row.low_level_arrests_2020, true) || 0
  const arrests2021 = util.parseInt(row.low_level_arrests_2021, true) || 0
  const arrests2022 = util.parseInt(row.low_level_arrests_2022, true) || 0

  return (
    arrests2013 +
    arrests2014 +
    arrests2015 +
    arrests2016 +
    arrests2017 +
    arrests2018 +
    arrests2019 +
    arrests2020 +
    arrests2021 +
    arrests2022
  )
}

/**
 * Calculate Total Jail Deaths 2016 - 2018
 * @param {object} row from CSV File
 */
const __calcTotalJailDeaths20162018 = (row) => {
  const jailDeathsHomicide = util.parseInt(row.jail_deaths_homicide, true) || 0
  const jailDeathsInvestigating = util.parseInt(row.jail_deaths_investigating, true) || 0
  const jailDeathsOther = util.parseInt(row.jail_deaths_other, true) || 0
  const jailDeathsSuicide = util.parseInt(row.jail_deaths_suicide, true) || 0

  return (jailDeathsHomicide + jailDeathsInvestigating + jailDeathsOther + jailDeathsSuicide)
}

/**
 * Calculate Total People Killed
 * @param {object} row from CSV File
 */
const __calcTotalPeopleKilled = (row) => {
  const asianPacificPeopleKilled = util.parseInt(row.asian_pacific_people_killed, true) || 0
  const blackPeopleKilled = util.parseInt(row.black_people_killed, true) || 0
  const hispanicPeopleKilled = util.parseInt(row.hispanic_people_killed, true) || 0
  const otherPeopleKilled = util.parseInt(row.other_people_killed, true) || 0
  const whitePeopleKilled = util.parseInt(row.white_people_killed, true) || 0
  const nativeAmericanPeopleKilled = util.parseInt(row.native_american_people_killed, true) || 0

  return (asianPacificPeopleKilled + blackPeopleKilled + hispanicPeopleKilled + otherPeopleKilled + whitePeopleKilled + nativeAmericanPeopleKilled)
}

/**
 * Calculate White Murder Unsolved Rate
 * @param {object} row from CSV File
 */
const __calcWhiteMurderUnsolvedRate = (row) => {
  const whiteMurdersSolved = util.parseInt(row.white_murders_solved, true) || 0
  const whiteMurdersUnsolved = util.parseInt(row.white_murders_unsolved, true) || 0

  if (whiteMurdersUnsolved > 0 || whiteMurdersSolved > 0) {
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
        return agency.update(scorecard.agency).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_agency.create(scorecard.agency).catch(err => {
        throw new Error(err)
      })
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
        return arrests.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_arrests.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return homicide.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_homicide.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return jail.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_jail.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return policeAccountability.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_police_accountability.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return policeFunding.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_police_funding.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return policeViolence.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_police_violence.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return policy.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_policy.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return report.update(scorecard).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.scorecard_report.create(scorecard).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return county.update(data).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.geo_counties.create(data).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
        return city.update(data).catch(err => {
          throw new Error(err)
        })
      }

      // insert
      return models.geo_cities.create(data).catch(err => {
        throw new Error(err)
      })
    })
    .catch(err => {
      throw new Error(err)
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
      const sourceFile = config.get('documents.scorecard')

      // Check that Source File Exists
      if (fs.existsSync(sourceFile)) {
        try {
          // Check that file has Read Access
          fs.accessSync(sourceFile, fs.constants.R_OK)
        } catch (err) {
          return reject(`File does not have Read Access: ${sourceFile}`)
        }

        // Delete Current File
        del.sync(['./app/data/*.csv'])

        try {
          // Copy Over Source File
          fs.copyFileSync(sourceFile, SCORECARD_PATH)
        } catch (err) {
          return reject(`Unable to copy Source File: ${sourceFile} => ${SCORECARD_PATH}`)
        }

        return resolve()
      } else {
        return reject(`File does not exist: ${sourceFile}`)
      }
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
              return reject('CSV Columns Altered. Unable to Complete Import.')
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

  async importScorecard (rowCount, cleanImport) {
    return new Promise((resolve) => {
      const scorecard = fs.createReadStream(SCORECARD_PATH)
      const importErrors = []
      const importWarnings = []
      const oriList = []

      let processed = 0

      const checkComplete = () => {
        if (processed === (rowCount - 1)) {
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
        .on('data', async row => {
          // Check if we are not doing a Clean Import, and skip rows that are `current`
          if (!cleanImport && row.status.toLowerCase() === 'current') {
            processed += 1

            return checkComplete()
          }

          // Prevent Imports where population is zero
          if (!row.total_population || row.total_population === '0' || row.total_population === 0 || util.parseInt(row.total_population, false, true) === 0) {
            processed += 1
            importWarnings.push(`Invalid 'ori' ${row.ori} - 'total_population' cannot be zero`)

            return checkComplete()
          }

          // Check that we have a unique ORI
          if (oriList.indexOf(row.ori) === -1) {
            oriList.push(row.ori)
          } else {
            processed += 1
            importWarnings.push(`Invalid 'ori' ${row.ori} - Duplicate ORI Entries`)

            return checkComplete()
          }

          // Set Defaults
          row.corrections_budget = null
          row.health_budget = null
          row.housing_budget = null
          row.police_budget = null
          row.total_budget = null

          // Update Corrections Budget for Latest Year we have data for
          if (row.police_budget_2010 && row.police_budget_2010.length > 0 && row.corrections_budget_2010 && row.corrections_budget_2010.length > 0 && row.total_budget_2010 && row.total_budget_2010.length > 0) {
            row.corrections_budget = row.corrections_budget_2010
          }
          if (row.police_budget_2011 && row.police_budget_2011.length > 0 && row.corrections_budget_2011 && row.corrections_budget_2011.length > 0 && row.total_budget_2011 && row.total_budget_2011.length > 0) {
            row.corrections_budget = row.corrections_budget_2011
          }
          if (row.police_budget_2012 && row.police_budget_2012.length > 0 && row.corrections_budget_2012 && row.corrections_budget_2012.length > 0 && row.total_budget_2012 && row.total_budget_2012.length > 0) {
            row.corrections_budget = row.corrections_budget_2012
          }
          if (row.police_budget_2013 && row.police_budget_2013.length > 0 && row.corrections_budget_2013 && row.corrections_budget_2013.length > 0 && row.total_budget_2013 && row.total_budget_2013.length > 0) {
            row.corrections_budget = row.corrections_budget_2013
          }
          if (row.police_budget_2014 && row.police_budget_2014.length > 0 && row.corrections_budget_2014 && row.corrections_budget_2014.length > 0 && row.total_budget_2014 && row.total_budget_2014.length > 0) {
            row.corrections_budget = row.corrections_budget_2014
          }
          if (row.police_budget_2015 && row.police_budget_2015.length > 0 && row.corrections_budget_2015 && row.corrections_budget_2015.length > 0 && row.total_budget_2015 && row.total_budget_2015.length > 0) {
            row.corrections_budget = row.corrections_budget_2015
          }
          if (row.police_budget_2016 && row.police_budget_2016.length > 0 && row.corrections_budget_2016 && row.corrections_budget_2016.length > 0 && row.total_budget_2016 && row.total_budget_2016.length > 0) {
            row.corrections_budget = row.corrections_budget_2016
          }
          if (row.police_budget_2017 && row.police_budget_2017.length > 0 && row.corrections_budget_2017 && row.corrections_budget_2017.length > 0 && row.total_budget_2017 && row.total_budget_2017.length > 0) {
            row.corrections_budget = row.corrections_budget_2017
          }
          if (row.police_budget_2018 && row.police_budget_2018.length > 0 && row.corrections_budget_2018 && row.corrections_budget_2018.length > 0 && row.total_budget_2018 && row.total_budget_2018.length > 0) {
            row.corrections_budget = row.corrections_budget_2018
          }
          if (row.police_budget_2019 && row.police_budget_2019.length > 0 && row.corrections_budget_2019 && row.corrections_budget_2019.length > 0 && row.total_budget_2019 && row.total_budget_2019.length > 0) {
            row.corrections_budget = row.corrections_budget_2019
          }
          if (row.police_budget_2020 && row.police_budget_2020.length > 0 && row.corrections_budget_2020 && row.corrections_budget_2020.length > 0 && row.total_budget_2020 && row.total_budget_2020.length > 0) {
            row.corrections_budget = row.corrections_budget_2020
          }
          if (row.police_budget_2021 && row.police_budget_2021.length > 0 && row.corrections_budget_2021 && row.corrections_budget_2021.length > 0 && row.total_budget_2021 && row.total_budget_2021.length > 0) {
            row.corrections_budget = row.corrections_budget_2021
          }
          if (row.police_budget_2022 && row.police_budget_2022.length > 0 && row.corrections_budget_2022 && row.corrections_budget_2022.length > 0 && row.total_budget_2022 && row.total_budget_2022.length > 0) {
            row.corrections_budget = row.corrections_budget_2022
          }

          // Update Health Budget for Latest Year we have data for
          if (row.police_budget_2010 && row.police_budget_2010.length > 0 && row.health_budget_2010 && row.health_budget_2010.length > 0 && row.total_budget_2010 && row.total_budget_2010.length > 0) {
            row.health_budget = row.health_budget_2010
          }
          if (row.police_budget_2011 && row.police_budget_2011.length > 0 && row.health_budget_2011 && row.health_budget_2011.length > 0 && row.total_budget_2011 && row.total_budget_2011.length > 0) {
            row.health_budget = row.health_budget_2011
          }
          if (row.police_budget_2012 && row.police_budget_2012.length > 0 && row.health_budget_2012 && row.health_budget_2012.length > 0 && row.total_budget_2012 && row.total_budget_2012.length > 0) {
            row.health_budget = row.health_budget_2012
          }
          if (row.police_budget_2013 && row.police_budget_2013.length > 0 && row.health_budget_2013 && row.health_budget_2013.length > 0 && row.total_budget_2013 && row.total_budget_2013.length > 0) {
            row.health_budget = row.health_budget_2013
          }
          if (row.police_budget_2014 && row.police_budget_2014.length > 0 && row.health_budget_2014 && row.health_budget_2014.length > 0 && row.total_budget_2014 && row.total_budget_2014.length > 0) {
            row.health_budget = row.health_budget_2014
          }
          if (row.police_budget_2015 && row.police_budget_2015.length > 0 && row.health_budget_2015 && row.health_budget_2015.length > 0 && row.total_budget_2015 && row.total_budget_2015.length > 0) {
            row.health_budget = row.health_budget_2015
          }
          if (row.police_budget_2016 && row.police_budget_2016.length > 0 && row.health_budget_2016 && row.health_budget_2016.length > 0 && row.total_budget_2016 && row.total_budget_2016.length > 0) {
            row.health_budget = row.health_budget_2016
          }
          if (row.police_budget_2017 && row.police_budget_2017.length > 0 && row.health_budget_2017 && row.health_budget_2017.length > 0 && row.total_budget_2017 && row.total_budget_2017.length > 0) {
            row.health_budget = row.health_budget_2017
          }
          if (row.police_budget_2018 && row.police_budget_2018.length > 0 && row.health_budget_2018 && row.health_budget_2018.length > 0 && row.total_budget_2018 && row.total_budget_2018.length > 0) {
            row.health_budget = row.health_budget_2018
          }
          if (row.police_budget_2019 && row.police_budget_2019.length > 0 && row.health_budget_2019 && row.health_budget_2019.length > 0 && row.total_budget_2019 && row.total_budget_2019.length > 0) {
            row.health_budget = row.health_budget_2019
          }
          if (row.police_budget_2020 && row.police_budget_2020.length > 0 && row.health_budget_2020 && row.health_budget_2020.length > 0 && row.total_budget_2020 && row.total_budget_2020.length > 0) {
            row.health_budget = row.health_budget_2020
          }
          if (row.police_budget_2021 && row.police_budget_2021.length > 0 && row.health_budget_2021 && row.health_budget_2021.length > 0 && row.total_budget_2021 && row.total_budget_2021.length > 0) {
            row.health_budget = row.health_budget_2021
          }
          if (row.police_budget_2022 && row.police_budget_2022.length > 0 && row.health_budget_2022 && row.health_budget_2022.length > 0 && row.total_budget_2022 && row.total_budget_2022.length > 0) {
            row.health_budget = row.health_budget_2022
          }

          // Update Housing Budget for Latest Year we have data for
          if (row.police_budget_2010 && row.police_budget_2010.length > 0 && row.housing_budget_2010 && row.housing_budget_2010.length > 0 && row.total_budget_2010 && row.total_budget_2010.length > 0) {
            row.housing_budget = row.housing_budget_2010
          }
          if (row.police_budget_2011 && row.police_budget_2011.length > 0 && row.housing_budget_2011 && row.housing_budget_2011.length > 0 && row.total_budget_2011 && row.total_budget_2011.length > 0) {
            row.housing_budget = row.housing_budget_2011
          }
          if (row.police_budget_2012 && row.police_budget_2012.length > 0 && row.housing_budget_2012 && row.housing_budget_2012.length > 0 && row.total_budget_2012 && row.total_budget_2012.length > 0) {
            row.housing_budget = row.housing_budget_2012
          }
          if (row.police_budget_2013 && row.police_budget_2013.length > 0 && row.housing_budget_2013 && row.housing_budget_2013.length > 0 && row.total_budget_2013 && row.total_budget_2013.length > 0) {
            row.housing_budget = row.housing_budget_2013
          }
          if (row.police_budget_2014 && row.police_budget_2014.length > 0 && row.housing_budget_2014 && row.housing_budget_2014.length > 0 && row.total_budget_2014 && row.total_budget_2014.length > 0) {
            row.housing_budget = row.housing_budget_2014
          }
          if (row.police_budget_2015 && row.police_budget_2015.length > 0 && row.housing_budget_2015 && row.housing_budget_2015.length > 0 && row.total_budget_2015 && row.total_budget_2015.length > 0) {
            row.housing_budget = row.housing_budget_2015
          }
          if (row.police_budget_2016 && row.police_budget_2016.length > 0 && row.housing_budget_2016 && row.housing_budget_2016.length > 0 && row.total_budget_2016 && row.total_budget_2016.length > 0) {
            row.housing_budget = row.housing_budget_2016
          }
          if (row.police_budget_2017 && row.police_budget_2017.length > 0 && row.housing_budget_2017 && row.housing_budget_2017.length > 0 && row.total_budget_2017 && row.total_budget_2017.length > 0) {
            row.housing_budget = row.housing_budget_2017
          }
          if (row.police_budget_2018 && row.police_budget_2018.length > 0 && row.housing_budget_2018 && row.housing_budget_2018.length > 0 && row.total_budget_2018 && row.total_budget_2018.length > 0) {
            row.housing_budget = row.housing_budget_2018
          }
          if (row.police_budget_2019 && row.police_budget_2019.length > 0 && row.housing_budget_2019 && row.housing_budget_2019.length > 0 && row.total_budget_2019 && row.total_budget_2019.length > 0) {
            row.housing_budget = row.housing_budget_2019
          }
          if (row.police_budget_2020 && row.police_budget_2020.length > 0 && row.housing_budget_2020 && row.housing_budget_2020.length > 0 && row.total_budget_2020 && row.total_budget_2020.length > 0) {
            row.housing_budget = row.housing_budget_2020
          }
          if (row.police_budget_2021 && row.police_budget_2021.length > 0 && row.housing_budget_2021 && row.housing_budget_2021.length > 0 && row.total_budget_2021 && row.total_budget_2021.length > 0) {
            row.housing_budget = row.housing_budget_2021
          }
          if (row.police_budget_2022 && row.police_budget_2022.length > 0 && row.housing_budget_2022 && row.housing_budget_2022.length > 0 && row.total_budget_2022 && row.total_budget_2022.length > 0) {
            row.housing_budget = row.housing_budget_2022
          }

          // Update Police Budget for Latest Year we have data for
          if (row.police_budget_2010 && row.police_budget_2010.length > 0 && row.total_budget_2010 && row.total_budget_2010.length > 0) {
            row.police_budget = row.police_budget_2010
            row.total_budget = row.total_budget_2010
          }
          if (row.police_budget_2011 && row.police_budget_2011.length > 0 && row.total_budget_2011 && row.total_budget_2011.length > 0) {
            row.police_budget = row.police_budget_2011
            row.total_budget = row.total_budget_2011
          }
          if (row.police_budget_2012 && row.police_budget_2012.length > 0 && row.total_budget_2012 && row.total_budget_2012.length > 0) {
            row.police_budget = row.police_budget_2012
            row.total_budget = row.total_budget_2012
          }
          if (row.police_budget_2013 && row.police_budget_2013.length > 0 && row.total_budget_2013 && row.total_budget_2013.length > 0) {
            row.police_budget = row.police_budget_2013
            row.total_budget = row.total_budget_2013
          }
          if (row.police_budget_2014 && row.police_budget_2014.length > 0 && row.total_budget_2014 && row.total_budget_2014.length > 0) {
            row.police_budget = row.police_budget_2014
            row.total_budget = row.total_budget_2014
          }
          if (row.police_budget_2015 && row.police_budget_2015.length > 0 && row.total_budget_2015 && row.total_budget_2015.length > 0) {
            row.police_budget = row.police_budget_2015
            row.total_budget = row.total_budget_2015
          }
          if (row.police_budget_2016 && row.police_budget_2016.length > 0 && row.total_budget_2016 && row.total_budget_2016.length > 0) {
            row.police_budget = row.police_budget_2016
            row.total_budget = row.total_budget_2016
          }
          if (row.police_budget_2017 && row.police_budget_2017.length > 0 && row.total_budget_2017 && row.total_budget_2017.length > 0) {
            row.police_budget = row.police_budget_2017
            row.total_budget = row.total_budget_2017
          }
          if (row.police_budget_2018 && row.police_budget_2018.length > 0 && row.total_budget_2018 && row.total_budget_2018.length > 0) {
            row.police_budget = row.police_budget_2018
            row.total_budget = row.total_budget_2018
          }
          if (row.police_budget_2019 && row.police_budget_2019.length > 0 && row.total_budget_2019 && row.total_budget_2019.length > 0) {
            row.police_budget = row.police_budget_2019
            row.total_budget = row.total_budget_2019
          }
          if (row.police_budget_2020 && row.police_budget_2020.length > 0 && row.total_budget_2020 && row.total_budget_2020.length > 0) {
            row.police_budget = row.police_budget_2020
            row.total_budget = row.total_budget_2020
          }
          if (row.police_budget_2021 && row.police_budget_2021.length > 0 && row.total_budget_2021 && row.total_budget_2021.length > 0) {
            row.police_budget = row.police_budget_2021
            row.total_budget = row.total_budget_2021
          }
          if (row.police_budget_2022 && row.police_budget_2022.length > 0 && row.total_budget_2022 && row.total_budget_2022.length > 0) {
            row.police_budget = row.police_budget_2022
            row.total_budget = row.total_budget_2022
          }

          const importSheriffData = async (row, result, cleanData) => {
            // Add
            cleanData.agency.country_id = result.country_id
            cleanData.agency.state_id = result.state_id
            cleanData.agency.county_id = result.id

            // Update or Insert Agency
            await __upsertScorecardAgency(cleanData, {
              ori: row.ori,
              state_id: result.state_id
            }).then(() => {
              processed += 1

              checkComplete()
            }).catch((err) => {
              let column = ''
              const message = err.message

              if (message.indexOf('SequelizeDatabaseError') > -1) {
                const regex = /'[a-z_]+'/g
                const found = message.match(regex)

                message.replace('Error: Error: Error: SequelizeDatabaseError:', '')

                if (found) {
                  const col = found[0].replace(/'/g, '')
                  column = `${col} = ${row[col]} - `
                }
              }
              importErrors.push(`${util.titleCase(row.location_name)}, ${row.state}: ${column}${message}`)
              processed += 1

              checkComplete()
            })
          }

          const importPoliceData = async (row, result, cleanData) => {
            // Add
            cleanData.agency.country_id = result.country_id
            cleanData.agency.state_id = result.state_id
            cleanData.agency.city_id = result.id

            // Update or Insert Agency
            __upsertScorecardAgency(cleanData, {
              ori: row.ori,
              state_id: result.state_id
            }).then(() => {
              processed += 1

              checkComplete()
            }).catch((err) => {
              let column = ''
              const message = err.message

              if (message.indexOf('SequelizeDatabaseError') > -1) {
                const regex = /'[a-z_]+'/g
                const found = message.match(regex)

                message.replace('Error: Error: Error: SequelizeDatabaseError:', '')

                if (found) {
                  const col = found[0].replace(/'/g, '')
                  column = `${col} = ${row[col]} - `
                }
              }
              importErrors.push(`${util.titleCase(row.location_name)}, ${row.state}: ${column}${message}`)
              processed += 1

              checkComplete()
            })
          }

          const importWarning = (row, type) => {
            importWarnings.push(`${util.titleCase(row.location_name)}, ${row.state}: Could Not Locate ${type}`)
            processed += 1

            checkComplete()
          }

          const importError = (err, row) => {
            importErrors.push(err)
            processed += 1

            checkComplete()
          }

          const importSkipped = (row) => {
            processed += 1

            checkComplete()
          }

          const importMissingScore = (row) => {
            processed += 1
            importErrors.push(`Invalid ${row.agency_type} 'calc_overall_score' is empty`)

            checkComplete()
          }

          // Get Report Card Grade
          const grade = util.getGrade(util.parseInt(row.calc_overall_score))

          if (!grade || typeof grade.class === 'undefined') {
            return importMissingScore(row)
          }

          const blackDeadlyForceDisparityPerPopulation = __calcBlackDeadlyForceDisparityPerPopulation(row)
          const blackMurderUnsolvedRate = __calcBlackMurderUnsolvedRate(row)
          const percentPoliceBudget = __calcPercentPoliceBudget(row)
          const deadlyForceIncidentsPerArrestPer10k = __calcDeadlyForceIncidentsPerArrestPer10k(row)
          const deadlyForceIncidentsPerArrest = __calcDeadlyForceIncidentsPerArrest(row)
          const hispanicDeadlyForceDisparityPerPopulation = __calcHispanicDeadlyForceDisparityPerPopulation(row)
          const hispanicMurderUnsolvedRate = __calcHispanicMurderUnsolvedRate(row)
          const lessLethalForceChange = __calcLessLethalForceChange(row)
          const nativeAmericanDeadlyForceDisparityPerPopulation = __calcNativeAmericanDeadlyForceDisparityPerPopulation(row)
          const percentAsianPacificArrests = __calcPercentAsianPacificArrests(row)
          const percentAsianPacificIslanderDeadlyForce = __calcPercentAsianPacificIslanderDeadlyForce(row)
          const percentBlackArrests = __calcPercentBlackArrests(row)
          const percentBlackDeadlyForce = __calcPercentBlackDeadlyForce(row)
          const percentCorrectionsBudget = __calcPercentCorrectionsBudget(row)
          const percentDrugPossessionArrests = __calcPercentDrugPossessionArrests(row)
          const percentEducationBudget = __calcPercentEducationBudget(row)
          const percentHealthBudget = __calcPercentHealthBudget(row)
          const percentHispanicArrests = __calcPercentHispanicArrests(row)
          const percentHispanicDeadlyForce = __calcPercentHispanicDeadlyForce(row)
          const percentHousingBudget = __calcPercentHousingBudget(row)
          const percentMisdemeanorArrests = __calcPercentMisdemeanorArrests(row)
          const percentNativeAmericanArrests = __calcPercentNativeAmericanArrests(row)
          const percentNativeAmericanDeadlyForce = __calcPercentNativeAmericanDeadlyForce(row)
          const percentOtherArrests = __calcPercentOtherArrests(row)
          const percentOtherDeadlyForce = __calcPercentOtherDeadlyForce(row)
          const percentPoliceMisperceiveThePersonToHaveGun = __calcPercentPoliceMisperceiveThePersonToHaveGun(row)
          const percentShotFirst = __calcPercentShotFirst(row)
          const percentUsedAgainstPeopleWhoWereNotArmedWithGun = __calcPercentUsedAgainstPeopleWhoWereNotArmedWithGun(row)
          const percentUsedAgainstPeopleWhoWereUnarmed = __calcPercentUsedAgainstPeopleWhoWereUnarmed(row)
          const percentViolentCrimeArrests = __calcPercentViolentCrimeArrests(row)
          const percentWhiteArrests = __calcPercentWhiteArrests(row)
          const percentWhiteDeadlyForce = __calcPercentWhiteDeadlyForce(row)
          const policeShootingsIncidents = __calcPoliceShootingsIncidents(row)
          const timesMoreMisdemeanorArrestsThanViolentCrime = __calcTimesMoreMisdemeanorArrestsThanViolentCrime(row)
          const totalArrests = __calcTotalArrests(row)
          const totalLowLevelArrests = __calcTotalLowLevelArrests(row)
          const totalJailDeaths20162018 = __calcTotalJailDeaths20162018(row)
          const totalPeopleKilled = __calcTotalPeopleKilled(row)
          const whiteMurderUnsolvedRate = __calcWhiteMurderUnsolvedRate(row)

          // Cleanup CVS Data before handing off to Model
          const cleanData = {
            agency: {
              advocacy_tip: util.parseString(row.advocacy_tip),
              asian_pacific_population: util.parseFloat(row.asian_pacific_population, false, true),
              black_population: util.parseFloat(row.black_population, false, true),
              complete: util.parseBoolean(row.complete),
              completeness: util.parseInt(row.complete, false, true),
              hispanic_population: util.parseFloat(row.hispanic_population, false, true),
              mayor_contact_url: util.parseURL(row.mayor_contact_url),
              mayor_email: util.parseEmail(row.mayor_email),
              mayor_name: util.parseString(row.mayor_name),
              mayor_phone: util.parsePhone(row.mayor_phone),
              name: util.titleCase(row.agency_name, true),
              native_american_population: util.parseFloat(row.native_american_population, false, true),
              ori: util.parseString(row.ori),
              other_population: util.parseFloat(row.other_population, false, true),
              police_chief_contact_url: util.parseURL(row.police_chief_contact_url),
              police_chief_email: util.parseEmail(row.police_chief_email),
              police_chief_name: util.parseString(row.police_chief_name),
              police_chief_phone: util.parsePhone(row.police_chief_phone),
              slug: util.createSlug(row.agency_name),
              total_population: util.parseInt(row.total_population, false, true),
              type: util.parseString(row.agency_type),
              white_population: util.parseFloat(row.white_population, false, true)
            },
            arrests: {
              arrests_2013: util.parseInt(row.arrests_2013, false, true),
              arrests_2014: util.parseInt(row.arrests_2014, false, true),
              arrests_2015: util.parseInt(row.arrests_2015, false, true),
              arrests_2016: util.parseInt(row.arrests_2016, false, true),
              arrests_2017: util.parseInt(row.arrests_2017, false, true),
              arrests_2018: util.parseInt(row.arrests_2018, false, true),
              arrests_2019: util.parseInt(row.arrests_2019, false, true),
              arrests_2020: util.parseInt(row.arrests_2020, false, true),
              arrests_2021: util.parseInt(row.arrests_2021, false, true),
              arrests_2022: util.parseInt(row.arrests_2022, false, true),
              asian_pacific_arrests: util.parseInt(row.asian_pacific_arrests, false, true),
              black_arrests: util.parseInt(row.black_arrests, false, true),
              black_drug_arrests: util.parseInt(row.black_drug_arrests, false, true),
              hispanic_arrests: util.parseInt(row.hispanic_arrests, false, true),
              hispanic_drug_arrests: util.parseInt(row.hispanic_drug_arrests, false, true),
              low_level_arrests: util.parseInt(row.low_level_arrests, false, true),
              low_level_arrests_2013: util.parseFloat(row.low_level_arrests_2013, false, true),
              low_level_arrests_2014: util.parseFloat(row.low_level_arrests_2014, false, true),
              low_level_arrests_2015: util.parseFloat(row.low_level_arrests_2015, false, true),
              low_level_arrests_2016: util.parseFloat(row.low_level_arrests_2016, false, true),
              low_level_arrests_2017: util.parseFloat(row.low_level_arrests_2017, false, true),
              low_level_arrests_2018: util.parseFloat(row.low_level_arrests_2018, false, true),
              low_level_arrests_2019: util.parseFloat(row.low_level_arrests_2019, false, true),
              low_level_arrests_2020: util.parseFloat(row.low_level_arrests_2020, false, true),
              low_level_arrests_2021: util.parseFloat(row.low_level_arrests_2021, false, true),
              low_level_arrests_2022: util.parseFloat(row.low_level_arrests_2022, false, true),
              native_american_arrests: util.parseInt(row.native_american_arrests, false, true),
              non_black_drug_arrests: util.parseInt(row.nonblack_drug_arrests, false, true),
              other_arrests: util.parseInt(row.other_arrests, false, true),
              other_drug_arrests: util.parseInt(row.other_drug_arrests, false, true),
              violent_crime_arrests: util.parseInt(row.violent_crime_arrests, false, true),
              white_arrests: util.parseInt(row.white_arrests, false, true),
              white_drug_arrests: util.parseInt(row.white_drug_arrests, false, true)
            },
            homicide: {
              black_murders_solved: util.parseInt(row.black_murders_solved, false, true),
              black_murders_unsolved: util.parseInt(row.black_murders_unsolved, false, true),
              hispanic_murders_solved: util.parseInt(row.hispanic_murders_solved, false, true),
              hispanic_murders_unsolved: util.parseInt(row.hispanic_murders_unsolved, false, true),
              homicides_2013_2019_solved: util.parseInt(row.homicides_2013_2019_solved, false, true),
              homicides_2013_2019: util.parseInt(row.homicides_2013_2019, false, true),
              white_murders_solved: util.parseInt(row.white_murders_solved, false, true),
              white_murders_unsolved: util.parseInt(row.white_murders_unsolved, false, true)
            },
            jail: {
              avg_daily_jail_population: util.parseInt(row.avg_daily_jail_population, false, true),
              black_jail_population: util.parseInt(row.black_jail_population, false, true),
              drug_ice_transfers: util.parseInt(row.drug_ice_transfers, false, true),
              hispanic_jail_population: util.parseInt(row.hispanic_jail_population, false, true),
              ice_holds: util.parseInt(row.ice_holds, false, true),
              jail_deaths_homicide: util.parseInt(row.jail_deaths_homicide, false, true),
              jail_deaths_investigating: util.parseInt(row.jail_deaths_investigating, false, true),
              jail_deaths_other: util.parseInt(row.jail_deaths_other, false, true),
              jail_deaths_suicide: util.parseInt(row.jail_deaths_suicide, false, true),
              misdemeanor_jail_population: util.parseInt(row.misdemeanor_jail_population, false, true),
              other_ice_transfers: util.parseInt(row.other_ice_transfers, false, true),
              other_jail_population: util.parseInt(row.other_jail_population, false, true),
              total_jail_population: util.parseInt(row.total_jail_population, false, true),
              unconvicted_jail_population: util.parseInt(row.unconvicted_jail_population, false, true),
              violent_ice_transfers: util.parseInt(row.violent_ice_transfers, false, true),
              white_jail_population: util.parseInt(row.white_jail_population, false, true)
            },
            police_accountability: {
              civilian_complaints_reported: util.parseInt(row.civilian_complaints_reported, false, true),
              civilian_complaints_source_link: util.parseURL(row.civilian_complaints_source_link),
              civilian_complaints_source: util.parseString(row.civilian_complaints_source),
              civilian_complaints_sustained: util.parseInt(row.civilian_complaints_sustained, false, true),
              complaints_in_detention_reported: util.parseInt(row.complaints_in_detention_reported, false, true),
              complaints_in_detention_sustained: util.parseInt(row.complaints_in_detention_sustained, false, true),
              criminal_complaints_reported: util.parseInt(row.criminal_complaints_reported, false, true),
              criminal_complaints_sustained: util.parseInt(row.criminal_complaints_sustained, false, true),
              discrimination_complaints_reported: util.parseInt(row.discrimination_complaints_reported, false, true),
              discrimination_complaints_sustained: util.parseInt(row.discrimination_complaints_sustained, false, true),
              use_of_force_complaints_reported: util.parseInt(row.use_of_force_complaints_reported, false, true),
              use_of_force_complaints_sustained: util.parseInt(row.use_of_force_complaints_sustained, false, true),
              years_of_complaints_data: util.parseString(row.years_of_complaints_data)
            },
            police_funding: {
              average_annual_misconduct_settlements: util.parseInt(row.average_annual_misconduct_settlements, false, true),
              budget_source_link: util.parseURL(row.budget_source_link),
              budget_source_name: util.parseString(row.budget_source_name),
              comparison_group: util.parseString(row.comparison_group),
              corrections_budget: util.parseInt(row.corrections_budget, false, true),
              corrections_budget_2010: util.parseInt(row.corrections_budget_2010, false, true),
              corrections_budget_2011: util.parseInt(row.corrections_budget_2011, false, true),
              corrections_budget_2012: util.parseInt(row.corrections_budget_2012, false, true),
              corrections_budget_2013: util.parseInt(row.corrections_budget_2013, false, true),
              corrections_budget_2014: util.parseInt(row.corrections_budget_2014, false, true),
              corrections_budget_2015: util.parseInt(row.corrections_budget_2015, false, true),
              corrections_budget_2016: util.parseInt(row.corrections_budget_2016, false, true),
              corrections_budget_2017: util.parseInt(row.corrections_budget_2017, false, true),
              corrections_budget_2018: util.parseInt(row.corrections_budget_2018, false, true),
              corrections_budget_2019: util.parseInt(row.corrections_budget_2019, false, true),
              corrections_budget_2020: util.parseInt(row.corrections_budget_2020, false, true),
              corrections_budget_2021: util.parseInt(row.corrections_budget_2021, false, true),
              corrections_budget_2022: util.parseInt(row.corrections_budget_2022, false, true),
              education_budget: util.parseInt(row.education_budget, false, true),
              fines_forfeitures_2010: util.parseInt(row.fines_forfeitures_2010, false, true),
              fines_forfeitures_2011: util.parseInt(row.fines_forfeitures_2011, false, true),
              fines_forfeitures_2012: util.parseInt(row.fines_forfeitures_2012, false, true),
              fines_forfeitures_2013: util.parseInt(row.fines_forfeitures_2013, false, true),
              fines_forfeitures_2014: util.parseInt(row.fines_forfeitures_2014, false, true),
              fines_forfeitures_2015: util.parseInt(row.fines_forfeitures_2015, false, true),
              fines_forfeitures_2016: util.parseInt(row.fines_forfeitures_2016, false, true),
              fines_forfeitures_2017: util.parseInt(row.fines_forfeitures_2017, false, true),
              fines_forfeitures_2018: util.parseInt(row.fines_forfeitures_2018, false, true),
              fines_forfeitures_2019: util.parseInt(row.fines_forfeitures_2019, false, true),
              fines_forfeitures_2020: util.parseInt(row.fines_forfeitures_2020, false, true),
              fines_forfeitures_2021: util.parseInt(row.fines_forfeitures_2021, false, true),
              fines_forfeitures_2022: util.parseInt(row.fines_forfeitures_2022, false, true),
              fines_forfeitures_per_resident: util.parseFloat(row.calc_fines_forfeitures_per_resident, false, true),
              health_budget_2010: util.parseInt(row.health_budget_2010, false, true),
              health_budget_2011: util.parseInt(row.health_budget_2011, false, true),
              health_budget_2012: util.parseInt(row.health_budget_2012, false, true),
              health_budget_2013: util.parseInt(row.health_budget_2013, false, true),
              health_budget_2014: util.parseInt(row.health_budget_2014, false, true),
              health_budget_2015: util.parseInt(row.health_budget_2015, false, true),
              health_budget_2016: util.parseInt(row.health_budget_2016, false, true),
              health_budget_2017: util.parseInt(row.health_budget_2017, false, true),
              health_budget_2018: util.parseInt(row.health_budget_2018, false, true),
              health_budget_2019: util.parseInt(row.health_budget_2019, false, true),
              health_budget_2020: util.parseInt(row.health_budget_2020, false, true),
              health_budget_2021: util.parseInt(row.health_budget_2021, false, true),
              health_budget_2022: util.parseInt(row.health_budget_2022, false, true),
              health_budget: util.parseInt(row.health_budget, false, true),
              housing_budget_2010: util.parseInt(row.housing_budget_2010, false, true),
              housing_budget_2011: util.parseInt(row.housing_budget_2011, false, true),
              housing_budget_2012: util.parseInt(row.housing_budget_2012, false, true),
              housing_budget_2013: util.parseInt(row.housing_budget_2013, false, true),
              housing_budget_2014: util.parseInt(row.housing_budget_2014, false, true),
              housing_budget_2015: util.parseInt(row.housing_budget_2015, false, true),
              housing_budget_2016: util.parseInt(row.housing_budget_2016, false, true),
              housing_budget_2017: util.parseInt(row.housing_budget_2017, false, true),
              housing_budget_2018: util.parseInt(row.housing_budget_2018, false, true),
              housing_budget_2019: util.parseInt(row.housing_budget_2019, false, true),
              housing_budget_2020: util.parseInt(row.housing_budget_2020, false, true),
              housing_budget_2021: util.parseInt(row.housing_budget_2021, false, true),
              housing_budget_2022: util.parseInt(row.housing_budget_2022, false, true),
              housing_budget: util.parseInt(row.housing_budget, false, true),
              misconduct_settlement_source_name: util.parseString(row.misconduct_settlement_source_name),
              misconduct_settlement_source: util.parseURL(row.misconduct_settlement_source),
              misconduct_settlements_per_10k_population: util.parseFloat(row.calc_misconduct_settlements_per_10k_population, false, true),
              officers_per_10k_population: util.parseFloat(row.calc_officers_per_10k_population, false, true),
              percentile_fines_forfeitures_per_resident: util.parseFloat(row.calc_percentile_fines_forfeitures_per_resident, false, true),
              percentile_misconduct_settlements_per_population: util.parseInt(row.calc_percentile_misconduct_settlements_per_population, false, true),
              percentile_officers_per_population: util.parseInt(row.calc_percentile_officers_per_population, false, true),
              percentile_police_spending_ratio: util.parseInt(row.calc_percentile_police_spending_ratio, false, true),
              police_budget_2010: util.parseInt(row.police_budget_2010, false, true),
              police_budget_2011: util.parseInt(row.police_budget_2011, false, true),
              police_budget_2012: util.parseInt(row.police_budget_2012, false, true),
              police_budget_2013: util.parseInt(row.police_budget_2013, false, true),
              police_budget_2014: util.parseInt(row.police_budget_2014, false, true),
              police_budget_2015: util.parseInt(row.police_budget_2015, false, true),
              police_budget_2016: util.parseInt(row.police_budget_2016, false, true),
              police_budget_2017: util.parseInt(row.police_budget_2017, false, true),
              police_budget_2018: util.parseInt(row.police_budget_2018, false, true),
              police_budget_2019: util.parseInt(row.police_budget_2019, false, true),
              police_budget_2020: util.parseInt(row.police_budget_2020, false, true),
              police_budget_2021: util.parseInt(row.police_budget_2021, false, true),
              police_budget_2022: util.parseInt(row.police_budget_2022, false, true),
              police_budget: util.parseInt(row.police_budget, false, true),
              police_spending_ratio: util.parseFloat(row.calc_police_spending_ratio, false, true),
              total_budget_2010: util.parseInt(row.total_budget_2010, false, true),
              total_budget_2011: util.parseInt(row.total_budget_2011, false, true),
              total_budget_2012: util.parseInt(row.total_budget_2012, false, true),
              total_budget_2013: util.parseInt(row.total_budget_2013, false, true),
              total_budget_2014: util.parseInt(row.total_budget_2014, false, true),
              total_budget_2015: util.parseInt(row.total_budget_2015, false, true),
              total_budget_2016: util.parseInt(row.total_budget_2016, false, true),
              total_budget_2017: util.parseInt(row.total_budget_2017, false, true),
              total_budget_2018: util.parseInt(row.total_budget_2018, false, true),
              total_budget_2019: util.parseInt(row.total_budget_2019, false, true),
              total_budget_2020: util.parseInt(row.total_budget_2020, false, true),
              total_budget_2021: util.parseInt(row.total_budget_2021, false, true),
              total_budget_2022: util.parseInt(row.total_budget_2022, false, true),
              total_budget: util.parseInt(row.total_budget, false, true),
              total_officers_2013: util.parseInt(row.total_officers_2013, false, true),
              total_officers_2014: util.parseInt(row.total_officers_2014, false, true),
              total_officers_2015: util.parseInt(row.total_officers_2015, false, true),
              total_officers_2016: util.parseInt(row.total_officers_2016, false, true),
              total_officers_2017: util.parseInt(row.total_officers_2017, false, true),
              total_officers_2018: util.parseInt(row.total_officers_2018, false, true),
              total_officers_2019: util.parseInt(row.total_officers_2019, false, true),
              total_officers_2020: util.parseInt(row.total_officers_2020, false, true),
              total_officers_2021: util.parseInt(row.total_officers_2021, false, true),
              total_officers_2022: util.parseInt(row.total_officers_2022, false, true),
              year_misconduct_settlement_data: util.parseString(row.year_misconduct_settlement_data)
            },
            police_violence: {
              all_deadly_force_incidents: util.parseInt(row.all_deadly_force_incidents, false, true),
              armed_people_killed: util.parseInt(row.armed_people_killed, false, true),
              asian_pacific_people_killed: util.parseInt(row.asian_pacific_people_killed, false, true),
              black_people_killed: util.parseInt(row.black_people_killed, false, true),
              fatality_rate: util.parseInt(row.fatality_rate, false, true),
              hispanic_people_killed: util.parseInt(row.hispanic_people_killed, false, true),
              less_lethal_force_2013: util.parseInt(row.less_lethal_force_2013, false, true),
              less_lethal_force_2014: util.parseInt(row.less_lethal_force_2014, false, true),
              less_lethal_force_2015: util.parseInt(row.less_lethal_force_2015, false, true),
              less_lethal_force_2016: util.parseInt(row.less_lethal_force_2016, false, true),
              less_lethal_force_2017: util.parseInt(row.less_lethal_force_2017, false, true),
              less_lethal_force_2018: util.parseInt(row.less_lethal_force_2018, false, true),
              less_lethal_force_2019: util.parseInt(row.less_lethal_force_2019, false, true),
              less_lethal_force_2020: util.parseInt(row.less_lethal_force_2020, false, true),
              less_lethal_force_2021: util.parseInt(row.less_lethal_force_2021, false, true),
              less_lethal_force_2022: util.parseInt(row.less_lethal_force_2022, false, true),
              native_american_people_killed: util.parseInt(row.native_american_people_killed, false, true),
              other_people_killed: util.parseInt(row.other_people_killed, false, true),
              people_killed_or_injured_armed_with_gun: util.parseInt(row.people_killed_or_injured_armed_with_gun, false, true),
              people_killed_or_injured_asian_pacific: util.parseInt(row.people_killed_or_injured_asian_pacific, false, true),
              people_killed_or_injured_black: util.parseInt(row.people_killed_or_injured_black, false, true),
              people_killed_or_injured_gun_perceived: util.parseInt(row.people_killed_or_injured_gun_perceived, false, true),
              people_killed_or_injured_hispanic: util.parseInt(row.people_killed_or_injured_hispanic, false, true),
              people_killed_or_injured_other: util.parseInt(row.people_killed_or_injured_other, true, true),
              people_killed_or_injured_unarmed: util.parseInt(row.people_killed_or_injured_unarmed, false, true),
              people_killed_or_injured_vehicle_incident: util.parseInt(row.people_killed_or_injured_vehicle_incident, false, true),
              people_killed_or_injured_white: util.parseInt(row.people_killed_or_injured_white, false, true),
              percentile_police_shootings_per_arrest: util.parseInt(row.calc_percentile_police_shootings_per_arrest, false, true),
              police_shootings_2013: util.parseInt(row.police_shootings_2013, false, true),
              police_shootings_2014: util.parseInt(row.police_shootings_2014, false, true),
              police_shootings_2015: util.parseInt(row.police_shootings_2015, false, true),
              police_shootings_2016: util.parseInt(row.police_shootings_2016, false, true),
              police_shootings_2017: util.parseInt(row.police_shootings_2017, false, true),
              police_shootings_2018: util.parseInt(row.police_shootings_2018, false, true),
              police_shootings_2019: util.parseInt(row.police_shootings_2019, false, true),
              police_shootings_2020: util.parseInt(row.police_shootings_2020, false, true),
              police_shootings_2021: util.parseInt(row.police_shootings_2021, false, true),
              police_shootings_2022: util.parseInt(row.police_shootings_2022, false, true),
              police_shootings_per_arrest: util.parseFloat(row.calc_police_shootings_per_arrest, false, true),
              shot_first: util.parseInt(row.shot_first, false, true),
              unarmed_people_killed: util.parseInt(row.unarmed_people_killed, false, true),
              vehicle_people_killed: util.parseInt(row.vehicle_people_killed, false, true),
              white_people_killed: util.parseInt(row.white_people_killed, false, true)
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
              approach_to_policing_score: util.parseInt(row.calc_approach_to_policing_score, false, true),
              black_deadly_force_disparity_per_population: blackDeadlyForceDisparityPerPopulation ? blackDeadlyForceDisparityPerPopulation : null,
              black_deadly_force_disparity: util.parseFloat(row.calc_black_deadly_force_disparity, false, true),
              black_drug_arrest_disparity: util.parseFloat(row.calc_black_drug_arrest_disparity, false, true),
              black_murder_unsolved_rate: blackMurderUnsolvedRate ? blackMurderUnsolvedRate : null,
              change_approach_to_policing_score: util.parseInt(row.change_approach_to_policing_score, false, true),
              change_overall_score: util.parseInt(row.change_overall_score, false, false),
              change_police_accountability_score: util.parseInt(row.change_police_accountability_score, false, true),
              change_police_funding_score: util.parseInt(row.change_police_funding_score, false, true),
              change_police_violence_score: util.parseInt(row.change_police_violence_score, false, true),
              complaints_sustained: util.parseInt(row.calc_complaints_sustained, false, true),
              currently_updating_union_contract: util.parseBoolean(row.currently_updating_union_contract),
              currently_updating_use_of_force: util.parseBoolean(row.currently_updating_use_of_force),
              deadly_force_incidents_per_arrest_per_10k: deadlyForceIncidentsPerArrestPer10k ? deadlyForceIncidentsPerArrestPer10k : null,
              deadly_force_incidents_per_arrest: deadlyForceIncidentsPerArrest ? deadlyForceIncidentsPerArrest : null,
              grade_class: grade.class,
              grade_letter: grade.letter,
              grade_marker: grade.marker,
              hispanic_deadly_force_disparity_per_population: hispanicDeadlyForceDisparityPerPopulation ? hispanicDeadlyForceDisparityPerPopulation : null,
              hispanic_deadly_force_disparity: util.parseFloat(row.calc_hispanic_deadly_force_disparity, false, true),
              hispanic_drug_arrest_disparity: util.parseFloat(row.calc_hispanic_drug_arrest_disparity, false, true),
              hispanic_murder_unsolved_rate: hispanicMurderUnsolvedRate ? hispanicMurderUnsolvedRate : null,
              jail_deaths_per_1k_jail_population: util.parseFloat(row.calc_jail_deaths_per_1k_jail_population, false, true),
              jail_incarceration_per_1k_population: util.parseFloat(row.calc_jail_incarceration_per_1k_population, false, true),
              killed_by_police_per_10k_arrests: util.parseFloat(row.calc_killed_by_police_per_10k_arrests, false, true),
              less_lethal_force_change: lessLethalForceChange ? lessLethalForceChange : null,
              less_lethal_per_10k_arrests: util.parseFloat(row.calc_less_lethal_per_10k_arrests, false, true),
              low_level_arrests_per_1k_population: util.parseFloat(row.calc_low_level_arrests_per_1k_population, false, true),
              most_severe_deadly_force_disparity: util.parseFloat(row.calc_most_severe_deadly_force_disparity, false, true),
              most_severe_drug_arrest_disparity: util.parseFloat(row.calc_most_severe_drug_arrest_disparity, false, true),
              native_american_deadly_force_disparity_per_population: nativeAmericanDeadlyForceDisparityPerPopulation ? nativeAmericanDeadlyForceDisparityPerPopulation : null,
              overall_disparity_index: util.parseFloat(row.calc_overall_disparity_index, false, true),
              overall_score: util.parseInt(row.calc_overall_score, false, true),
              percent_asian_pacific_arrests: percentAsianPacificArrests ? percentAsianPacificArrests : null,
              percent_asian_pacific_islander_deadly_force: percentAsianPacificIslanderDeadlyForce ? percentAsianPacificIslanderDeadlyForce : null,
              percent_black_arrests: percentBlackArrests ? percentBlackArrests : null,
              percent_black_deadly_force: percentBlackDeadlyForce ? percentBlackDeadlyForce : null,
              percent_complaints_in_detention_sustained: util.parseInt(row.calc_percent_complaints_in_detention_sustained, false, true),
              percent_corrections_budget: percentCorrectionsBudget ? percentCorrectionsBudget : null,
              percent_criminal_complaints_sustained: util.parseInt(row.calc_percent_criminal_complaints_sustained, false, true),
              percent_discrimination_complaints_sustained: util.parseInt(row.calc_percent_discrimination_complaints_sustained, false, true),
              percent_drug_possession_arrests: percentDrugPossessionArrests ? percentDrugPossessionArrests : null,
              percent_education_budget: percentEducationBudget ? percentEducationBudget : null,
              percent_health_budget: percentHealthBudget ? percentHealthBudget : null,
              percent_hispanic_arrests: percentHispanicArrests ? percentHispanicArrests : null,
              percent_hispanic_deadly_force: percentHispanicDeadlyForce ? percentHispanicDeadlyForce : null,
              percent_housing_budget: percentHousingBudget ? percentHousingBudget : null,
              percent_misdemeanor_arrests: percentMisdemeanorArrests ? percentMisdemeanorArrests : null,
              percent_murders_solved: util.parseInt(row.calc_percent_murders_solved, false, true),
              percent_native_american_arrests: percentNativeAmericanArrests ? percentNativeAmericanArrests : null,
              percent_native_american_deadly_force: percentNativeAmericanDeadlyForce ? percentNativeAmericanDeadlyForce : null,
              percent_officers_asian_pacific: util.parseInt(row.percent_officers_asianpacific, false, true),
              percent_officers_black: util.parseInt(row.percent_officers_black, false, true),
              percent_officers_hispanic: util.parseInt(row.percent_officers_hispanic, false, true),
              percent_officers_native_american: util.parseInt(row.percent_officers_native_american, false, true),
              percent_officers_other: util.parseInt(row.percent_officers_other, false, true),
              percent_officers_white: util.parseInt(row.percent_officers_white, false, true),
              percent_other_arrests: percentOtherArrests ? percentOtherArrests : null,
              percent_other_deadly_force: percentOtherDeadlyForce ? percentOtherDeadlyForce : null,
              percent_police_budget: percentPoliceBudget ? percentPoliceBudget : null,
              percent_police_misperceive_the_person_to_have_gun: percentPoliceMisperceiveThePersonToHaveGun ? percentPoliceMisperceiveThePersonToHaveGun : null,
              percent_shot_first: percentShotFirst ? percentShotFirst : null,
              percent_use_of_force_complaints_sustained: util.parseInt(row.calc_percent_use_of_force_complaints_sustained, false, true),
              percent_used_against_people_who_were_not_armed_with_gun: percentUsedAgainstPeopleWhoWereNotArmedWithGun ? percentUsedAgainstPeopleWhoWereNotArmedWithGun : null,
              percent_used_against_people_who_were_unarmed: percentUsedAgainstPeopleWhoWereUnarmed ? percentUsedAgainstPeopleWhoWereUnarmed : null,
              percent_violent_crime_arrests: percentViolentCrimeArrests ? percentViolentCrimeArrests : null,
              percent_white_arrests: percentWhiteArrests ? percentWhiteArrests : null,
              percent_white_deadly_force: percentWhiteDeadlyForce ? percentWhiteDeadlyForce : null,
              percentile_complaints_sustained: util.parseInt(row.calc_percentile_complaints_sustained, false, true),
              percentile_drug_arrest_disparity: util.parseFloat(row.calc_percentile_drug_arrest_disparity, false, true),
              percentile_jail_deaths_per_1k_jail_population: util.parseInt(row.calc_percentile_jail_deaths_per_1k_jail_population, false, true),
              percentile_jail_incarceration_per_1k_population: util.parseInt(row.calc_percentile_jail_incarceration_per_1k_population, false, true),
              percentile_killed_by_police: util.parseInt(row.calc_percentile_killed_by_police, false, true),
              percentile_less_lethal_force: util.parseInt(row.calc_percentile_less_lethal_force, false, true),
              percentile_low_level_arrests_per_1k_population: util.parseInt(row.calc_percentile_low_level_arrests_per_1k_population, false, true),
              percentile_murders_solved: util.parseInt(row.calc_percentile_murders_solved, false, true),
              percentile_overall_disparity_index: util.parseFloat(row.calc_percentile_overall_disparity_index, false, true),
              percentile_police_spending: util.parseInt(row.calc_percentile_police_spending, false, true),
              percentile_unarmed_killed_by_police: util.parseInt(row.calc_percentile_unarmed_killed_by_police, false, true),
              police_accountability_score: util.parseInt(row.calc_police_accountability_score, false, true),
              police_funding_score: util.parseInt(row.calc_police_funding_score, false, true),
              police_shootings_incidents: policeShootingsIncidents ? policeShootingsIncidents : null,
              police_spending_per_resident: util.parseFloat(row.calc_police_spending_per_resident, false, true),
              police_violence_score: util.parseInt(row.calc_police_violence_score, false, true),
              times_more_misdemeanor_arrests_than_violent_crime: timesMoreMisdemeanorArrestsThanViolentCrime ? timesMoreMisdemeanorArrestsThanViolentCrime : null,
              total_arrests: totalArrests ? totalArrests : null,
              total_low_level_arrests: totalLowLevelArrests ? totalLowLevelArrests : null,
              total_jail_deaths_2016_2018: totalJailDeaths20162018 ? totalJailDeaths20162018 : null,
              total_less_lethal_force_estimated: util.parseFloat(row.calc_total_less_lethal_force_estimated, false, true),
              total_people_killed: totalPeopleKilled ? totalPeopleKilled : null,
              unarmed_killed_by_police_per_10k_arrests: util.parseFloat(row.calc_unarmed_killed_by_police_per_10k_arrests, false, true),
              white_murder_unsolved_rate: whiteMurderUnsolvedRate ? whiteMurderUnsolvedRate : null
            }
          }

          if (row.agency_type === 'sheriff') {
            // Search Counties for Sheriff Department
            await models.geo_counties.findOne({
              where: {
                fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
                fips_county_code: util.leftPad(row.fips_county_code, 3, '0')
              }
            }).then((result) => {
              if (result) {
                importSheriffData(row, result, cleanData)
              } else {
                __upsertCounty(row).then((county) => {
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
            await models.geo_cities.findOne({
              where: {
                fips_state_code: util.leftPad(row.fips_state_code, 2, '0'),
                fips_place_code: util.leftPad(row.fips_place_code, 5, '0')
              }
            }).then((result) => {
              if (result) {
                importPoliceData(row, result, cleanData)
              } else {
                __upsertCity(row).then((city) => {
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
