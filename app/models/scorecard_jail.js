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
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    hispanic_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    white_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    other_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    avg_daily_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    total_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    unconvicted_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    misdemeanor_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    ice_holds: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    other_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    violent_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    drug_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    jail_deaths_homicide: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    jail_deaths_suicide: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    jail_deaths_other: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    jail_deaths_investigating: {
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
