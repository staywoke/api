'use strict'

/**
 * @module models/scorecard_report
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardReport = sequelize.define('scorecard_report', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agency_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'Foreign Key to scorecard_agency'
    },
    approach_to_policing_score: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    black_deadly_force_disparity_per_arrest: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    black_deadly_force_disparity_per_population: {
      type: DataTypes.FLOAT(8, 2).UNSIGNED
    },
    black_drug_arrest_disparity: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    black_murder_unsolved_rate: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    change_approach_to_policing_score: {
      type: DataTypes.INTEGER(3)
    },
    change_overall_score: {
      type: DataTypes.INTEGER(3)
    },
    change_police_accountability_score: {
      type: DataTypes.INTEGER(3)
    },
    change_police_violence_score: {
      type: DataTypes.INTEGER(3)
    },
    complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    currently_updating_union_contract: {
      type: DataTypes.BOOLEAN
    },
    currently_updating_use_of_force: {
      type: DataTypes.BOOLEAN
    },
    deadly_force_incidents_per_arrest_per_10k: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    deadly_force_incidents_per_arrest: {
      type: DataTypes.FLOAT(10, 6).UNSIGNED
    },
    grade_class: {
      type: DataTypes.STRING(1)
    },
    grade_letter: {
      type: DataTypes.STRING(2)
    },
    grade_marker: {
      type: DataTypes.STRING(7)
    },
    hispanic_deadly_force_disparity_per_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    hispanic_murder_unsolved_rate: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    jail_deaths_per_1k_jail_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    jail_incarceration_per_1k_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    killed_by_police_per_10k_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    less_lethal_force_change: {
      type: DataTypes.INTEGER(3)
    },
    less_lethal_per_10k_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    low_level_arrests_per_1k_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    overall_disparity_index: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    overall_score: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_asian_pacific_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_asian_pacific_islander_deadly_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_black_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_black_deadly_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_complaints_in_detention_sustained: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_criminal_complaints_sustained: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_discrimination_complaints_sustained: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_drug_possession_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_education_budget: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_health_budget: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_hispanic_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_hispanic_deadly_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_housing_budget: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_misdemeanor_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_murders_solved: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_other_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_other_deadly_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_police_budget: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_police_misperceive_the_person_to_have_gun: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_shot_first: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_use_of_force_complaints_sustained: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_used_against_people_who_were_not_armed_with_gun: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_used_against_people_who_were_unarmed: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_violent_crime_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_white_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percent_white_deadly_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_complaints_sustained: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_jail_deaths_per_1k_jail_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_jail_incarceration_per_1k_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_killed_by_police: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_less_lethal_force: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_low_level_arrests_per_1k_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_murders_solved: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_of_murders_solved: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_overall_disparity_index: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_police_spending: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_unarmed_killed_by_police: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    police_accountability_score: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    police_shootings_incidents: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    police_spending_per_resident: {
      type: DataTypes.FLOAT(7, 2).UNSIGNED
    },
    police_violence_score: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    times_more_misdemeanor_arrests_than_violent_crime: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    total_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    total_jail_deaths_2016_2018: {
      type: DataTypes.INTEGER(5)
    },
    total_less_lethal_force_estimated: {
      type: DataTypes.FLOAT(8, 2).UNSIGNED
    },
    unarmed_killed_by_police_per_10k_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    white_murder_unsolved_rate: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    }
  }, {
    indexes: [
      {
        fields: ['agency_id']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  ScorecardReport.associate = (models) => {
    /**
     * Connect Report to Agency
     */
    models.scorecard_report.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardReport
}
