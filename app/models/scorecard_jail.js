'use strict'

/**
 * @module models/scorecard_jail
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardJail = sequelize.define('scorecard_jail', {
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
    black_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    hispanic_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    white_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    other_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    avg_daily_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    total_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    unconvicted_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    misdemeanor_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    ice_holds: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    other_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    violent_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    drug_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    jail_deaths_homicide: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    jail_deaths_suicide: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    jail_deaths_other: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    jail_deaths_investigating: {
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
  ScorecardJail.associate = (models) => {
    /**
     * Connect Jail to Agency
     */
    models.scorecard_jail.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardJail
}
