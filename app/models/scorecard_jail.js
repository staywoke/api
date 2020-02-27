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
      allowNull: true
    },
    hispanic_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    white_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    other_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    avg_daily_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    total_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    unconvicted_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    misdemeanor_jail_population: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    ice_holds: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    other_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    violent_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    drug_ice_transfers: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    jail_deaths_homicide: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    jail_deaths_suicide: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    jail_deaths_other: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    jail_deaths_investigating: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
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
