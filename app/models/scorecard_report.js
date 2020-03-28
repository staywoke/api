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
    police_spending_per_resident: {
      type: DataTypes.FLOAT(7, 2).UNSIGNED
    },
    percentile_police_spending: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    change_overall_score: {
      type: DataTypes.INTEGER(3)
    },
    change_police_violence_score: {
      type: DataTypes.INTEGER(3)
    },
    change_police_accountability_score: {
      type: DataTypes.INTEGER(3)
    },
    change_approach_to_policing_score: {
      type: DataTypes.INTEGER(3)
    },
    currently_updating_use_of_force: {
      type: DataTypes.BOOLEAN
    },
    currently_updating_union_contract: {
      type: DataTypes.BOOLEAN
    },
    black_drug_arrest_disparity: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
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
    less_lethal_per_10k_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    low_level_arrests_per_1k_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    overall_score: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percent_complaints_in_detention_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percent_criminal_complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percent_discrimination_complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percent_murders_solved: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percent_use_of_force_complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_complaints_sustained: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_jail_deaths_per_1k_jail_population: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_jail_incarceration_per_1k_population: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_killed_by_police: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_less_lethal_force: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_low_level_arrests_per_1k_population: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    percentile_unarmed_killed_by_police: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    police_accountability_score: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    police_violence_score: {
      type: DataTypes.INTEGER(3).UNSIGNED
    },
    total_less_lethal_force_estimated: {
      type: DataTypes.FLOAT(8, 2).UNSIGNED
    },
    unarmed_killed_by_police_per_10k_arrests: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    black_deadly_force_disparity_per_arrest: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    overall_disparity_index: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    percentile_overall_disparity_index: {
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
