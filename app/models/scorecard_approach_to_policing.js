'use strict'

/**
 * @module models/scorecard_approach_to_policing
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardApproachToPolicing = sequelize.define('scorecard_approach_to_policing', {
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
    state_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'Foreign Key to geo_states'
    },
    arrests_2013: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    arrests_2014: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    arrests_2015: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    arrests_2016: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    arrests_2017: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    arrests_2018: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    low_level_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    violent_crime_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    black_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    white_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    hispanic_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    asianpacific_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    other_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    black_drug_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    hispanic_drug_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    white_drug_arrests: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    other_drug_arrests: {
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
  ScorecardApproachToPolicing.associate = (models) => {
    /**
     * Connect Approach to Policing to Agency
     */
    models.scorecard_approach_to_policing.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardApproachToPolicing
}
