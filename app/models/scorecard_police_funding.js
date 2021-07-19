'use strict'

/**
 * @module models/scorecard_police_funding
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardPoliceFunding = sequelize.define('scorecard_police_funding', {
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
    total_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    education_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_officers_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    total_budget_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    housing_budget_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    health_budget_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    police_budget_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2010: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2011: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2012: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2013: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2014: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2015: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2016: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2017: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2018: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2019: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2020: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2021: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    corrections_budget_2022: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    budget_source_name: {
      type: DataTypes.TEXT
    },
    budget_source_link: {
      type: DataTypes.TEXT
    },
    comparison_group: {
      type: DataTypes.TEXT
    },
    average_annual_misconduct_settlements: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    year_misconduct_settlement_data: {
      type: DataTypes.TEXT
    },
    misconduct_settlement_source: {
      type: DataTypes.TEXT
    },
    misconduct_settlement_source_name: {
      type: DataTypes.TEXT
    },
    officers_per_10k_population: {
      type: DataTypes.FLOAT(15, 2).UNSIGNED
    },
    percentile_officers_per_population: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    fines_forfeitures_per_resident: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    percentile_fines_forfeitures_per_resident: {
      type: DataTypes.FLOAT(15, 2).UNSIGNED
    },
    police_spending_ratio: {
      type: DataTypes.FLOAT(15, 2).UNSIGNED
    },
    percentile_police_spending_ratio: {
      type: DataTypes.BIGINT(15).UNSIGNED
    },
    misconduct_settlements_per_10k_population: {
      type: DataTypes.FLOAT(15, 2).UNSIGNED
    },
    percentile_misconduct_settlements_per_population: {
      type: DataTypes.BIGINT(15).UNSIGNED
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
  ScorecardPoliceFunding.associate = (models) => {
    /**
     * Connect Police Funding to Agency
     */
    models.scorecard_police_funding.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardPoliceFunding
}
