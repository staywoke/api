'use strict'

/**
 * @module models/scorecard_homicide
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardHomicide = sequelize.define('scorecard_homicide', {
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
    white_murders_unsolved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    black_murders_unsolved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    hispanic_murders_unsolved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    white_murders_solved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    black_murders_solved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    hispanic_murders_solved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    homicides_2013_2018: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    homicides_2013_2018_solved: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
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
  ScorecardHomicide.associate = (models) => {
    /**
     * Connect Homicide to Agency
     */
    models.scorecard_homicide.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardHomicide
}
