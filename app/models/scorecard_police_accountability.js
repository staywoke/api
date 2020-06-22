'use strict'

/**
 * @module models/scorecard_police_accountability
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardPoliceAccountability = sequelize.define('scorecard_police_accountability', {
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
    civilian_complaints_reported: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    civilian_complaints_sustained: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    use_of_force_complaints_reported: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    use_of_force_complaints_sustained: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    discrimination_complaints_reported: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    discrimination_complaints_sustained: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    criminal_complaints_reported: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    criminal_complaints_sustained: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    complaints_in_detention_reported: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    complaints_in_detention_sustained: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    years_of_complaints_data: {
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
  ScorecardPoliceAccountability.associate = (models) => {
    /**
     * Connect Police Accountability to Agency
     */
    models.scorecard_police_accountability.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardPoliceAccountability
}
