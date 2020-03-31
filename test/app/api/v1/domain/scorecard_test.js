const chai = require('chai')
const sinon = require('sinon')

const { ScorecardDomain } = require('../../../../../app/api/v1/domain')

const models = require('../../../../../app/models')

const assert = chai.assert

const mockPoliceDepartmentGrades = [
  {
    dataValues: {
      id: 2,
      country_id: 1,
      state_id: 6,
      city_id: 1442,
      county_id: null,
      name: 'Los Angeles',
      type: 'police-department',
      ori: 'CA0194200',
      total_population: 3952771,
      white_population: 28.14,
      black_population: 8.36,
      hispanic_population: 48.85,
      asian_pacific_population: 11.95,
      other_population: 2.69,
      mayor_name: 'Eric Garcetti',
      mayor_email: 'mayor.helpdesk@lacity.org',
      mayor_phone: '213-978-1028',
      mayor_contact_url: null,
      police_chief_name: 'Michel Moore',
      police_chief_email: 'contact.lapdonline@gmail.com',
      police_chief_phone: '213-486-0150',
      police_chief_contact_url: null,
      created_date: '2020-03-30T04:35:05.000Z',
      modified_date: '2020-03-30T04:35:05.000Z',
      deletedAt: null,
      report: {
        dataValues: {
          id: 2,
          agency_id: 2,
          approach_to_policing_score: 79,
          black_deadly_force_disparity_per_arrest: 1,
          black_deadly_force_disparity_per_population: 4.54,
          black_drug_arrest_disparity: 3.8,
          black_murder_unsolved_rate: 55.18,
          change_approach_to_policing_score: -2,
          change_overall_score: 0,
          change_police_accountability_score: -3,
          change_police_violence_score: 7,
          complaints_sustained: 5,
          currently_updating_union_contract: false,
          currently_updating_use_of_force: true,
          deadly_force_incidents_per_arrest_per_10k: 4.51,
          deadly_force_incidents_per_arrest: 0.000451,
          grade_class: 'f',
          grade_letter: 'F',
          grade_marker: 'f',
          hispanic_deadly_force_disparity_per_population: 2.08,
          hispanic_murder_unsolved_rate: 47.05,
          jail_deaths_per_1k_jail_population: null,
          jail_incarceration_per_1k_population: null,
          killed_by_police_per_10k_arrests: 6.7,
          less_lethal_force_change: -41,
          less_lethal_per_10k_arrests: 101.3,
          low_level_arrests_per_1k_population: 39.6,
          overall_disparity_index: 2.4,
          overall_score: 41,
          percent_asian_pacific_arrests: 0.46,
          percent_asian_pacific_islander_deadly_force: 1.61,
          percent_black_arrests: 30.75,
          percent_black_deadly_force: 21.77,
          percent_complaints_in_detention_sustained: 5,
          percent_criminal_complaints_sustained: 6,
          percent_discrimination_complaints_sustained: 0,
          percent_drug_possession_arrests: 1.25,
          percent_education_budget: 0,
          percent_health_budget: 0.11,
          percent_hispanic_arrests: 46.21,
          percent_hispanic_deadly_force: 57.26,
          percent_housing_budget: 2.27,
          percent_misdemeanor_arrests: 35.84,
          percent_murders_solved: 79,
          percent_other_arrests: 0.02,
          percent_other_deadly_force: 3.23,
          percent_police_budget: 16.98,
          percent_police_misperceive_the_person_to_have_gun: 21,
          percent_shot_first: 83,
          percent_use_of_force_complaints_sustained: 1,
          percent_used_against_people_who_were_not_armed_with_gun: 16.94,
          percent_used_against_people_who_were_unarmed: 11.29,
          percent_violent_crime_arrests: 15.17,
          percent_white_arrests: 22.57,
          percent_white_deadly_force: 16.13,
          percentile_complaints_sustained: 22,
          percentile_jail_deaths_per_1k_jail_population: null,
          percentile_jail_incarceration_per_1k_population: null,
          percentile_killed_by_police: 5,
          percentile_less_lethal_force: 31,
          percentile_low_level_arrests_per_1k_population: 80,
          percentile_murders_solved: 59,
          percentile_of_murders_solved: null,
          percentile_overall_disparity_index: 55,
          percentile_police_spending: 70,
          percentile_unarmed_killed_by_police: 18,
          police_accountability_score: 15,
          police_shootings_incidents: 118,
          police_spending_per_resident: 399.28,
          police_violence_score: 27,
          times_more_misdemeanor_arrests_than_violent_crime: 2,
          total_arrests: 437250,
          total_jail_deaths_2016_2018: 0,
          total_less_lethal_force_estimated: 1943,
          unarmed_killed_by_police_per_10k_arrests: 0.3,
          white_murder_unsolved_rate: 27.41,
          created_date: '2020-03-30T04:35:09.000Z',
          modified_date: '2020-03-30T04:35:09.000Z',
          deletedAt: null
        }
      },
      city: {
        dataValues: {
          slug: 'los-angeles',
          id: 1442,
          country_id: 1,
          state_id: 6,
          name: 'Los Angeles',
          fips_state_code: '06',
          fips_place_code: '44000',
          latitude: '34.05223420',
          longitude: '-118.24368490',
          coordinate: {
            type: 'Point',
            coordinates: [
              34.0522342,
              -118.2436849
            ]
          },
          created_date: '2020-03-30T04:34:28.000Z',
          modified_date: '2020-03-30T04:34:28.000Z',
          deletedAt: null
        }
      },
      county: null
    }
  }
]

const mockSheriffGrades = [
  {
    dataValues: {
      id: 709,
      country_id: 1,
      state_id: 6,
      city_id: null,
      county_id: 205,
      name: 'Los Angeles',
      type: 'sheriff',
      ori: 'CA0190000',
      total_population: 2868356,
      white_population: 22.99,
      black_population: 8.94,
      hispanic_population: 51.17,
      asian_pacific_population: 14.82,
      other_population: 2.08,
      mayor_name: null,
      mayor_email: null,
      mayor_phone: null,
      mayor_contact_url: null,
      police_chief_name: 'Alex Villanueva',
      police_chief_email: null,
      police_chief_phone: '213-229-3000',
      police_chief_contact_url: null,
      created_date: '2020-03-30T04:35:07.000Z',
      modified_date: '2020-03-30T04:35:07.000Z',
      deletedAt: null,
      report: {
        dataValues: {
          id: 709,
          agency_id: 709,
          approach_to_policing_score: 41,
          black_deadly_force_disparity_per_arrest: 1.5,
          black_deadly_force_disparity_per_population: 3.94,
          black_drug_arrest_disparity: 1.4,
          black_murder_unsolved_rate: 80.26,
          change_approach_to_policing_score: null,
          change_overall_score: null,
          change_police_accountability_score: null,
          change_police_violence_score: null,
          complaints_sustained: 1,
          currently_updating_union_contract: false,
          currently_updating_use_of_force: true,
          deadly_force_incidents_per_arrest_per_10k: 6.85,
          deadly_force_incidents_per_arrest: 0.000685,
          grade_class: 'f',
          grade_letter: 'F',
          grade_marker: 'f',
          hispanic_deadly_force_disparity_per_population: 1.68,
          hispanic_murder_unsolved_rate: 67.37,
          jail_deaths_per_1k_jail_population: 4.1,
          jail_incarceration_per_1k_population: 5.5,
          killed_by_police_per_10k_arrests: 10.3,
          less_lethal_force_change: 0,
          less_lethal_per_10k_arrests: null,
          low_level_arrests_per_1k_population: 23.3,
          overall_disparity_index: 1.5,
          overall_score: 27,
          percent_asian_pacific_arrests: 0.57,
          percent_asian_pacific_islander_deadly_force: 2.06,
          percent_black_arrests: 18.21,
          percent_black_deadly_force: 23.71,
          percent_complaints_in_detention_sustained: 3,
          percent_criminal_complaints_sustained: 33,
          percent_discrimination_complaints_sustained: 1,
          percent_drug_possession_arrests: 2.84,
          percent_education_budget: 0.6,
          percent_health_budget: 16.55,
          percent_hispanic_arrests: 62.78,
          percent_hispanic_deadly_force: 57.73,
          percent_housing_budget: 0,
          percent_misdemeanor_arrests: 32.19,
          percent_murders_solved: 33,
          percent_other_arrests: 0.05,
          percent_other_deadly_force: 1.03,
          percent_police_budget: 13.2,
          percent_police_misperceive_the_person_to_have_gun: 35,
          percent_shot_first: 81,
          percent_use_of_force_complaints_sustained: 2,
          percent_used_against_people_who_were_not_armed_with_gun: 34.02,
          percent_used_against_people_who_were_unarmed: 20.62,
          percent_violent_crime_arrests: 8.85,
          percent_white_arrests: 18.39,
          percent_white_deadly_force: 15.46,
          percentile_complaints_sustained: 18,
          percentile_jail_deaths_per_1k_jail_population: 7,
          percentile_jail_incarceration_per_1k_population: 48,
          percentile_killed_by_police: 5,
          percentile_less_lethal_force: null,
          percentile_low_level_arrests_per_1k_population: 76,
          percentile_murders_solved: 10,
          percentile_of_murders_solved: null,
          percentile_overall_disparity_index: 62,
          percentile_police_spending: 72,
          percentile_unarmed_killed_by_police: 6,
          police_accountability_score: 15,
          police_shootings_incidents: 77,
          police_spending_per_resident: 1128.09,
          police_violence_score: 24,
          times_more_misdemeanor_arrests_than_violent_crime: 3,
          total_arrests: 207408,
          total_jail_deaths_2016_2018: 78,
          total_less_lethal_force_estimated: null,
          unarmed_killed_by_police_per_10k_arrests: 0.8,
          white_murder_unsolved_rate: 40,
          created_date: '2020-03-30T17:28:04.000Z',
          modified_date: '2020-03-30T17:28:04.000Z',
          deletedAt: null
        }
      },
      city: null,
      county: {
        dataValues: {
          slug: 'los-angeles',
          id: 205,
          country_id: 1,
          state_id: 6,
          name: 'Los Angeles',
          fips_state_code: '06',
          fips_county_code: '037',
          created_date: '2020-03-30T04:34:33.000Z',
          modified_date: '2020-03-30T04:34:33.000Z',
          deletedAt: null
        }
      }
    }
  }
]

const mockStates = [
  {
    dataValues: {
      id: 1,
      country_id: 1,
      state_id: 35,
      city_id: 11709,
      county_id: null,
      name: 'New York',
      type: 'police-department',
      ori: 'NY0303000',
      total_population: 8566917,
      white_population: 32.1,
      black_population: 22,
      hispanic_population: 16.2,
      asian_pacific_population: 13.9,
      other_population: 15.8,
      mayor_name: 'Bill De Blasio',
      mayor_email: null,
      mayor_phone: '212-788-7585',
      mayor_contact_url: null,
      police_chief_name: null,
      police_chief_email: null,
      police_chief_phone: null,
      police_chief_contact_url: null,
      created_date: '2020-03-30T04:35:05.000Z',
      modified_date: '2020-03-30T04:35:05.000Z',
      deletedAt: null,
      report: {
        dataValues: {
          id: 1,
          agency_id: 1,
          approach_to_policing_score: 66,
          black_deadly_force_disparity_per_arrest: 1.4,
          black_deadly_force_disparity_per_population: 7.78,
          black_drug_arrest_disparity: 2.9,
          black_murder_unsolved_rate: 43.86,
          change_approach_to_policing_score: null,
          change_overall_score: null,
          change_police_accountability_score: null,
          change_police_violence_score: null,
          complaints_sustained: 6,
          currently_updating_union_contract: null,
          currently_updating_use_of_force: null,
          deadly_force_incidents_per_arrest_per_10k: 0,
          deadly_force_incidents_per_arrest: 0,
          grade_class: 'f',
          grade_letter: 'F',
          grade_marker: 'f',
          hispanic_deadly_force_disparity_per_population: 2.23,
          hispanic_murder_unsolved_rate: 28.98,
          jail_deaths_per_1k_jail_population: null,
          jail_incarceration_per_1k_population: null,
          killed_by_police_per_10k_arrests: 0.6,
          less_lethal_force_change: 0,
          less_lethal_per_10k_arrests: 43.2,
          low_level_arrests_per_1k_population: 57.7,
          overall_disparity_index: 2.1,
          overall_score: 49,
          percent_asian_pacific_arrests: 4.66,
          percent_asian_pacific_islander_deadly_force: 0,
          percent_black_arrests: 47.83,
          percent_black_deadly_force: 64,
          percent_complaints_in_detention_sustained: null,
          percent_criminal_complaints_sustained: null,
          percent_discrimination_complaints_sustained: 0,
          percent_drug_possession_arrests: 17.11,
          percent_education_budget: 0,
          percent_health_budget: 0,
          percent_hispanic_arrests: 34.03,
          percent_hispanic_deadly_force: 13.33,
          percent_housing_budget: 0,
          percent_misdemeanor_arrests: 25.09,
          percent_murders_solved: 76,
          percent_other_arrests: 1.32,
          percent_other_deadly_force: 10.67,
          percent_police_budget: 0,
          percent_police_misperceive_the_person_to_have_gun: 0,
          percent_shot_first: 0,
          percent_use_of_force_complaints_sustained: 2,
          percent_used_against_people_who_were_not_armed_with_gun: 24,
          percent_used_against_people_who_were_unarmed: 18.67,
          percent_violent_crime_arrests: 8.13,
          percent_white_arrests: 12.16,
          percent_white_deadly_force: 12,
          percentile_complaints_sustained: 33,
          percentile_jail_deaths_per_1k_jail_population: null,
          percentile_jail_incarceration_per_1k_population: null,
          percentile_killed_by_police: 67,
          percentile_less_lethal_force: 72,
          percentile_low_level_arrests_per_1k_population: 57,
          percentile_murders_solved: 54,
          percentile_of_murders_solved: null,
          percentile_overall_disparity_index: 61,
          percentile_police_spending: null,
          percentile_unarmed_killed_by_police: 28,
          police_accountability_score: 22,
          police_shootings_incidents: 77,
          police_spending_per_resident: null,
          police_violence_score: 57,
          times_more_misdemeanor_arrests_than_violent_crime: 3,
          total_arrests: 1968864,
          total_jail_deaths_2016_2018: 0,
          total_less_lethal_force_estimated: 3663,
          unarmed_killed_by_police_per_10k_arrests: 0.1,
          white_murder_unsolved_rate: 20.71,
          created_date: '2020-03-30T04:35:08.000Z',
          modified_date: '2020-03-30T17:27:57.000Z',
          deletedAt: null
        }
      }
    }
  }
]

const mockStateAgencies = [
  {
    dataValues: {
      id: 2,
      country_id: 1,
      state_id: 6,
      city_id: 1442,
      county_id: null,
      name: 'Los Angeles',
      type: 'police-department',
      ori: 'CA0194200',
      total_population: 3952771,
      white_population: 28.14,
      black_population: 8.36,
      hispanic_population: 48.85,
      asian_pacific_population: 11.95,
      other_population: 2.69,
      mayor_name: 'Eric Garcetti',
      mayor_email: 'mayor.helpdesk@lacity.org',
      mayor_phone: '213-978-1028',
      mayor_contact_url: null,
      police_chief_name: 'Michel Moore',
      police_chief_email: 'contact.lapdonline@gmail.com',
      police_chief_phone: '213-486-0150',
      police_chief_contact_url: null,
      created_date: '2020-03-30T04:35:05.000Z',
      modified_date: '2020-03-30T04:35:05.000Z',
      deletedAt: null,
      report: {
        dataValues: {
          id: 2,
          agency_id: 2,
          approach_to_policing_score: 79,
          black_deadly_force_disparity_per_arrest: 1,
          black_deadly_force_disparity_per_population: 4.54,
          black_drug_arrest_disparity: 3.8,
          black_murder_unsolved_rate: 55.18,
          change_approach_to_policing_score: -2,
          change_overall_score: 0,
          change_police_accountability_score: -3,
          change_police_violence_score: 7,
          complaints_sustained: 5,
          currently_updating_union_contract: false,
          currently_updating_use_of_force: true,
          deadly_force_incidents_per_arrest_per_10k: 4.51,
          deadly_force_incidents_per_arrest: 0.000451,
          grade_class: 'f',
          grade_letter: 'F',
          grade_marker: 'f',
          hispanic_deadly_force_disparity_per_population: 2.08,
          hispanic_murder_unsolved_rate: 47.05,
          jail_deaths_per_1k_jail_population: null,
          jail_incarceration_per_1k_population: null,
          killed_by_police_per_10k_arrests: 6.7,
          less_lethal_force_change: -41,
          less_lethal_per_10k_arrests: 101.3,
          low_level_arrests_per_1k_population: 39.6,
          overall_disparity_index: 2.4,
          overall_score: 41,
          percent_asian_pacific_arrests: 0.46,
          percent_asian_pacific_islander_deadly_force: 1.61,
          percent_black_arrests: 30.75,
          percent_black_deadly_force: 21.77,
          percent_complaints_in_detention_sustained: 5,
          percent_criminal_complaints_sustained: 6,
          percent_discrimination_complaints_sustained: 0,
          percent_drug_possession_arrests: 1.25,
          percent_education_budget: 0,
          percent_health_budget: 0.11,
          percent_hispanic_arrests: 46.21,
          percent_hispanic_deadly_force: 57.26,
          percent_housing_budget: 2.27,
          percent_misdemeanor_arrests: 35.84,
          percent_murders_solved: 79,
          percent_other_arrests: 0.02,
          percent_other_deadly_force: 3.23,
          percent_police_budget: 16.98,
          percent_police_misperceive_the_person_to_have_gun: 21,
          percent_shot_first: 83,
          percent_use_of_force_complaints_sustained: 1,
          percent_used_against_people_who_were_not_armed_with_gun: 16.94,
          percent_used_against_people_who_were_unarmed: 11.29,
          percent_violent_crime_arrests: 15.17,
          percent_white_arrests: 22.57,
          percent_white_deadly_force: 16.13,
          percentile_complaints_sustained: 22,
          percentile_jail_deaths_per_1k_jail_population: null,
          percentile_jail_incarceration_per_1k_population: null,
          percentile_killed_by_police: 5,
          percentile_less_lethal_force: 31,
          percentile_low_level_arrests_per_1k_population: 80,
          percentile_murders_solved: 59,
          percentile_of_murders_solved: null,
          percentile_overall_disparity_index: 55,
          percentile_police_spending: 70,
          percentile_unarmed_killed_by_police: 18,
          police_accountability_score: 15,
          police_shootings_incidents: 118,
          police_spending_per_resident: 399.28,
          police_violence_score: 27,
          times_more_misdemeanor_arrests_than_violent_crime: 2,
          total_arrests: 437250,
          total_jail_deaths_2016_2018: 0,
          total_less_lethal_force_estimated: 1943,
          unarmed_killed_by_police_per_10k_arrests: 0.3,
          white_murder_unsolved_rate: 27.41,
          created_date: '2020-03-30T04:35:09.000Z',
          modified_date: '2020-03-30T04:35:09.000Z',
          deletedAt: null
        }
      }
    }
  }
]

const mockReport = {
  dataValues: {
    arrests: {
      id: 2,
      agency_id: 2,
      state_id: 6,
      arrests_2013: 90436,
      arrests_2014: 83187,
      arrests_2015: 71732,
      arrests_2016: 68768,
      arrests_2017: 64440,
      arrests_2018: 58688,
      low_level_arrests: 156724,
      violent_crime_arrests: 66334,
      black_arrests: 134445,
      white_arrests: 98684,
      hispanic_arrests: 202049,
      asian_pacific_arrests: 1996,
      other_arrests: 78,
      black_drug_arrests: 1412,
      hispanic_drug_arrests: 2265,
      white_drug_arrests: 1467,
      other_drug_arrests: 293,
      non_black_drug_arrests: 4037,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    asian_pacific_population: 11.95,
    black_population: 8.36,
    city: {
      slug: 'los-angeles',
      id: 1442,
      country_id: 1,
      state_id: 6,
      name: 'Los Angeles',
      fips_state_code: '06',
      fips_place_code: '44000',
      latitude: '34.05223420',
      longitude: '-118.24368490',
      coordinate: {
        type: 'Point',
        coordinates: [
          34.0522342,
          -118.2436849
        ]
      },
      created_date: '2020-03-30T04:34:28.000Z',
      modified_date: '2020-03-30T04:34:28.000Z',
      deletedAt: null
    },
    city_id: 1442,
    country: {
      slug: 'united-states',
      id: 1,
      name: 'United States',
      abbr2: 'US',
      abbr3: 'USA',
      fips_code: 'US',
      created_date: '2020-03-30T04:34:27.000Z',
      modified_date: '2020-03-30T04:34:27.000Z',
      deletedAt: null
    },
    country_id: 1,
    county: {
      dataValues: {
        slug: 'los-angeles',
        id: 205,
        country_id: 1,
        state_id: 6,
        name: 'Los Angeles',
        fips_state_code: '06',
        fips_county_code: '037',
        created_date: '2020-03-30T04:34:33.000Z',
        modified_date: '2020-03-30T04:34:33.000Z',
        deletedAt: null
      }
    },
    county_id: null,
    created_date: '2020-03-30T04:35:05.000Z',
    deletedAt: null,
    hispanic_population: 48.85,
    homicide: {
      id: 2,
      agency_id: 2,
      white_murders_unsolved: 37,
      black_murders_unsolved: 314,
      hispanic_murders_unsolved: 327,
      white_murders_solved: 98,
      black_murders_solved: 255,
      hispanic_murders_solved: 368,
      homicides_2013_2018: 1625,
      homicides_2013_2018_solved: 1280,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    id: 2,
    jail: {
      id: 2,
      agency_id: 2,
      black_jail_population: null,
      hispanic_jail_population: null,
      white_jail_population: null,
      other_jail_population: null,
      avg_daily_jail_population: null,
      total_jail_population: null,
      unconvicted_jail_population: null,
      misdemeanor_jail_population: null,
      ice_holds: null,
      other_ice_transfers: 4,
      violent_ice_transfers: null,
      drug_ice_transfers: null,
      jail_deaths_homicide: null,
      jail_deaths_suicide: null,
      jail_deaths_other: null,
      jail_deaths_investigating: null,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    mayor_contact_url: null,
    mayor_email: 'mayor.helpdesk@lacity.org',
    mayor_name: 'Eric Garcetti',
    mayor_phone: '213-978-1028',
    modified_date: '2020-03-30T04:35:05.000Z',
    name: 'Los Angeles',
    ori: 'CA0194200',
    other_population: 2.69,
    police_accountability: {
      id: 2,
      agency_id: 2,
      civilian_complaints_reported: 7596,
      civilian_complaints_sustained: 343,
      use_of_force_complaints_reported: 2339,
      use_of_force_complaints_sustained: 18,
      discrimination_complaints_reported: 1425,
      discrimination_complaints_sustained: 0,
      criminal_complaints_reported: 1434,
      criminal_complaints_sustained: 87,
      complaints_in_detention_reported: 707,
      complaints_in_detention_sustained: 33,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    police_chief_contact_url: null,
    police_chief_email: 'contact.lapdonline@gmail.com',
    police_chief_name: 'Michel Moore',
    police_chief_phone: '213-486-0150',
    police_funding: {
      id: 2,
      agency_id: 2,
      total_budget: 9292125739,
      police_budget: 1578265278,
      education_budget: null,
      housing_budget: 211015311,
      health_budget: 9902393,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    police_violence: {
      id: 2,
      agency_id: 2,
      less_lethal_force_2016: 751,
      less_lethal_force_2017: 743,
      less_lethal_force_2018: 449,
      police_shootings_2016: 40,
      police_shootings_2017: 45,
      police_shootings_2018: 33,
      white_people_killed: 20,
      black_people_killed: 27,
      hispanic_people_killed: 71,
      asian_pacific_people_killed: 2,
      other_people_killed: 4,
      unarmed_people_killed: 14,
      vehicle_people_killed: 0,
      armed_people_killed: 103,
      fatality_rate: 33,
      shot_first: 98,
      people_killed_or_injured_armed_with_gun: 51,
      people_killed_or_injured_gun_perceived: 64,
      people_killed_or_injured_unarmed: 70,
      people_killed_or_injured_vehicle_incident: 1,
      people_killed_or_injured_black: 46,
      people_killed_or_injured_white: 27,
      people_killed_or_injured_hispanic: 85,
      people_killed_or_injured_asian_pacific: 4,
      people_killed_or_injured_other: 4,
      all_deadly_force_incidents: 197,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    policy: {
      id: 2,
      agency_id: 2,
      disqualifies_complaints: true,
      policy_language_disqualifies_complaints: null,
      restricts_delays_interrogations: true,
      policy_language_restricts_delays_interrogations: null,
      gives_officers_unfair_access_to_information: true,
      policy_language_gives_officers_unfair_access_to_information: null,
      limits_oversight_discipline: true,
      policy_language_limits_oversight_discipline: null,
      requires_city_pay_for_misconduct: true,
      policy_language_requires_city_pay_for_misconduct: null,
      erases_misconduct_records: false,
      policy_language_erases_misconduct_records: null,
      requires_deescalation: true,
      policy_language_requires_deescalation: null,
      bans_chokeholds_and_strangleholds: true,
      policy_language_bans_chokeholds_and_strangleholds: null,
      duty_to_intervene: true,
      policy_language_duty_to_intervene: null,
      requires_warning_before_shooting: false,
      policy_language_requires_warning_before_shooting: null,
      restricts_shooting_at_moving_vehicles: true,
      policy_language_restricts_shooting_at_moving_vehicles: null,
      requires_comprehensive_reporting: false,
      policy_language_requires_comprehensive_reporting: null,
      requires_exhaust_other_means_before_shooting: false,
      policy_language_requires_exhaust_other_means_before_shooting: null,
      has_use_of_force_continuum: true,
      policy_language_has_use_of_force_continuum: null,
      policy_manual_link: 'https://drive.google.com/open?id=1toU6JZyZZeGpYZwoN4SDZC3AYlnjPOuE',
      police_union_contract_link: 'http://cao.lacity.org/MOUs/',
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    report: {
      id: 2,
      agency_id: 2,
      approach_to_policing_score: 79,
      black_deadly_force_disparity_per_arrest: 1,
      black_deadly_force_disparity_per_population: 4.54,
      black_drug_arrest_disparity: 3.8,
      black_murder_unsolved_rate: 55.18,
      change_approach_to_policing_score: -2,
      change_overall_score: 0,
      change_police_accountability_score: -3,
      change_police_violence_score: 7,
      complaints_sustained: 5,
      currently_updating_union_contract: false,
      currently_updating_use_of_force: true,
      deadly_force_incidents_per_arrest_per_10k: 4.51,
      deadly_force_incidents_per_arrest: 0.000451,
      grade_class: 'f',
      grade_letter: 'F',
      grade_marker: 'f',
      hispanic_deadly_force_disparity_per_population: 2.08,
      hispanic_murder_unsolved_rate: 47.05,
      jail_deaths_per_1k_jail_population: null,
      jail_incarceration_per_1k_population: null,
      killed_by_police_per_10k_arrests: 6.7,
      less_lethal_force_change: -41,
      less_lethal_per_10k_arrests: 101.3,
      low_level_arrests_per_1k_population: 39.6,
      overall_disparity_index: 2.4,
      overall_score: 41,
      percent_asian_pacific_arrests: 0.46,
      percent_asian_pacific_islander_deadly_force: 1.61,
      percent_black_arrests: 30.75,
      percent_black_deadly_force: 21.77,
      percent_complaints_in_detention_sustained: 5,
      percent_criminal_complaints_sustained: 6,
      percent_discrimination_complaints_sustained: 0,
      percent_drug_possession_arrests: 1.25,
      percent_education_budget: 0,
      percent_health_budget: 0.11,
      percent_hispanic_arrests: 46.21,
      percent_hispanic_deadly_force: 57.26,
      percent_housing_budget: 2.27,
      percent_misdemeanor_arrests: 35.84,
      percent_murders_solved: 79,
      percent_other_arrests: 0.02,
      percent_other_deadly_force: 3.23,
      percent_police_budget: 16.98,
      percent_police_misperceive_the_person_to_have_gun: 21,
      percent_shot_first: 83,
      percent_use_of_force_complaints_sustained: 1,
      percent_used_against_people_who_were_not_armed_with_gun: 16.94,
      percent_used_against_people_who_were_unarmed: 11.29,
      percent_violent_crime_arrests: 15.17,
      percent_white_arrests: 22.57,
      percent_white_deadly_force: 16.13,
      percentile_complaints_sustained: 22,
      percentile_jail_deaths_per_1k_jail_population: null,
      percentile_jail_incarceration_per_1k_population: null,
      percentile_killed_by_police: 5,
      percentile_less_lethal_force: 31,
      percentile_low_level_arrests_per_1k_population: 80,
      percentile_murders_solved: 59,
      percentile_of_murders_solved: null,
      percentile_overall_disparity_index: 55,
      percentile_police_spending: 70,
      percentile_unarmed_killed_by_police: 18,
      police_accountability_score: 15,
      police_shootings_incidents: 118,
      police_spending_per_resident: 399.28,
      police_violence_score: 27,
      times_more_misdemeanor_arrests_than_violent_crime: 2,
      total_arrests: 437250,
      total_jail_deaths_2016_2018: 0,
      total_less_lethal_force_estimated: 1943,
      unarmed_killed_by_police_per_10k_arrests: 0.3,
      white_murder_unsolved_rate: 27.41,
      created_date: '2020-03-30T04:35:09.000Z',
      modified_date: '2020-03-30T04:35:09.000Z',
      deletedAt: null
    },
    state: {
      slug: 'california',
      id: 6,
      country_id: 1,
      type: 'state',
      name: 'California',
      abbr: 'CA',
      code: 'US-CA',
      fips_code: '06',
      created_date: '2020-03-30T04:34:28.000Z',
      modified_date: '2020-03-30T04:34:28.000Z',
      deletedAt: null
    },
    state_id: 6,
    total_population: 3952771,
    type: 'police-department',
    white_population: 28.14
  }
}

describe('Domain Scorecard', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('getGrades should be defined', () => {
    assert.isDefined(ScorecardDomain.getGrades)
  })

  it('getStates should be defined', () => {
    assert.isDefined(ScorecardDomain.getStates)
  })

  it('getState should be defined', () => {
    assert.isDefined(ScorecardDomain.getState)
  })

  it('getReport should be defined', () => {
    assert.isDefined(ScorecardDomain.getReport)
  })

  describe('getGrades', () => {
    beforeEach(() => {
      this.scorecardAgencyStub = this.sandbox.stub(models.scorecard_agency, 'findAll')
    })

    it('should fail with missing state', (done) => {
      ScorecardDomain.getGrades(null, 'police-department')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `state` parameter')
          done()
        })
    })

    it('should fail with missing type', (done) => {
      ScorecardDomain.getGrades('ca', null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `type` parameter')
          done()
        })
    })

    it('should return police-department grades', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockPoliceDepartmentGrades))

      ScorecardDomain.getGrades('ca', 'police-department')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
        .catch((error) => {
          console.log(error)
          done()
        })
    })

    it('should return sheriff grades', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockSheriffGrades))

      ScorecardDomain.getGrades('ca', 'sheriff')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
        .catch((error) => {
          console.log(error)
          done()
        })
    })

    it('should fail with no results', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(null))

      ScorecardDomain.getGrades('ca', 'sheriff')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No location found for ca sheriff')
          done()
        })
    })

    it('should return empty result with missing agency report', (done) => {
      const mockSheriffGradesError = Object.assign(mockSheriffGrades, [])
      delete mockSheriffGradesError[0].dataValues.report

      this.scorecardAgencyStub.returns(Promise.resolve(mockSheriffGradesError))

      ScorecardDomain.getGrades('ca', 'sheriff')
        .then((results) => {
          assert.isDefined(results)
          assert.isTrue(JSON.stringify(results) === '[]')
          done()
        })
    })
  })

  describe('getStates', () => {
    beforeEach(() => {
      this.scorecardAgencyStub = this.sandbox.stub(models.scorecard_agency, 'findAll')
    })

    it('should return states', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockStates))

      ScorecardDomain.getStates()
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should return empty result with missing agency report', (done) => {
      const mockStatesError = Object.assign(mockStates, [])
      delete mockStatesError[0].dataValues.report

      this.scorecardAgencyStub.returns(Promise.resolve(mockStatesError))

      ScorecardDomain.getStates()
        .then((results) => {
          assert.isDefined(results)
          assert.isTrue(JSON.stringify(results) === '{}')
          done()
        })
    })

    it('should fail with no results', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(null))

      ScorecardDomain.getStates()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No location found')
          done()
        })
    })
  })

  describe('getState', () => {
    beforeEach(() => {
      this.scorecardAgencyStub = this.sandbox.stub(models.scorecard_agency, 'findAll')
    })

    it('should fail with missing state', (done) => {
      ScorecardDomain.getState(null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `state` parameter')
          done()
        })
    })

    it('should return state', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockStateAgencies))

      ScorecardDomain.getState('ca')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should fail if agency missing report', (done) => {
      const mockStateError = Object.assign(mockStateAgencies, [])
      delete mockStateError[0].dataValues.report

      this.scorecardAgencyStub.returns(Promise.resolve(mockStateError))

      ScorecardDomain.getState('ca')
        .catch((error) => {
          assert.isDefined(error)
          done()
        })
    })

    it('should fail with no results', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(null))

      ScorecardDomain.getState('ca')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No location found for ca')
          done()
        })
    })
  })

  describe('getReport', () => {
    beforeEach(() => {
      this.scorecardAgencyStub = this.sandbox.stub(models.scorecard_agency, 'findOne')
    })

    it('should fail with missing state', (done) => {
      ScorecardDomain.getReport(null, 'police-department', 'los-angeles')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `state` parameter')
          done()
        })
    })

    it('should fail with missing type', (done) => {
      ScorecardDomain.getReport('ca', null, 'los-angeles')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `type` parameter')
          done()
        })
    })

    it('should fail with missing location', (done) => {
      ScorecardDomain.getReport('ca', 'police-department', null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Missing Required `location` parameter')
          done()
        })
    })

    it('should return report', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockReport))

      ScorecardDomain.getReport('ca', 'police-department', 'los-angeles')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should return report even if missing data', (done) => {
      const mockReportMissingData = Object.assign(mockReport, {})
      delete mockReportMissingData.dataValues.arrests
      delete mockReportMissingData.dataValues.homicide
      delete mockReportMissingData.dataValues.jail
      delete mockReportMissingData.dataValues.police_accountability
      delete mockReportMissingData.dataValues.police_funding
      delete mockReportMissingData.dataValues.police_violence
      delete mockReportMissingData.dataValues.policy
      delete mockReportMissingData.dataValues.report
      delete mockReportMissingData.dataValues.country
      delete mockReportMissingData.dataValues.state
      delete mockReportMissingData.dataValues.city
      delete mockReportMissingData.dataValues.county

      this.scorecardAgencyStub.returns(Promise.resolve(mockReportMissingData))

      ScorecardDomain.getReport('ca', 'police-department', 'los-angeles')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should correct saint locations', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(mockReport))

      ScorecardDomain.getReport('mo', 'police-department', 'st-louis')
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should fail if no report', (done) => {
      this.scorecardAgencyStub.returns(Promise.resolve(null))

      ScorecardDomain.getReport('ca', 'police-department', 'los-angeles')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No location found for ca police-department los-angeles')
          done()
        })
    })
  })
})
