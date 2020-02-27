'use strict'

/**
 * @module models/scorecard_police_violence
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardPoliceViolence = sequelize.define('scorecard_police_violence', {
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
    less_lethal_force_2016: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    less_lethal_force_2017: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    less_lethal_force_2018: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    police_shootings_2016: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    police_shootings_2017: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    police_shootings_2018: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    white_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    black_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    hispanic_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    asianpacific_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    other_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    unarmed_people_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    vehicle_people_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    armed_people_killed: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    fatality_rate: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    shot_first: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_armed_with_gun: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_gun_perceived: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_unarmed: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_vehicle_incident: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_black: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_white: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_asianpacific: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    people_killed_or_injured_other: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    all_deadly_force_incidents: {
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
  ScorecardPoliceViolence.associate = (models) => {
    /**
     * Connect Police Violence to Agency
     */
    models.scorecard_police_violence.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardPoliceViolence
}
