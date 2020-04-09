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
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    housing_budget: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    health_budget: {
      type: DataTypes.INTEGER(10).UNSIGNED
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
