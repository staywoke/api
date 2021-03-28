'use strict'

/**
 * @module models/scorecard_policy
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardPolicy = sequelize.define('scorecard_policy', {
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
    bans_chokeholds_and_strangleholds: {
      type: DataTypes.BOOLEAN
    },
    disqualifies_complaints: {
      type: DataTypes.BOOLEAN
    },
    duty_to_intervene: {
      type: DataTypes.BOOLEAN
    },
    erases_misconduct_records: {
      type: DataTypes.BOOLEAN
    },
    gives_officers_unfair_access_to_information: {
      type: DataTypes.BOOLEAN
    },
    has_use_of_force_continuum: {
      type: DataTypes.BOOLEAN
    },
    limits_oversight_discipline: {
      type: DataTypes.BOOLEAN
    },
    police_union_contract_link: {
      type: DataTypes.TEXT
    },
    policy_language_bans_chokeholds_and_strangleholds: {
      type: DataTypes.TEXT
    },
    policy_language_disqualifies_complaints: {
      type: DataTypes.TEXT
    },
    policy_language_duty_to_intervene: {
      type: DataTypes.TEXT
    },
    policy_language_erases_misconduct_records: {
      type: DataTypes.TEXT
    },
    policy_language_gives_officers_unfair_access_to_information: {
      type: DataTypes.TEXT
    },
    policy_language_has_use_of_force_continuum: {
      type: DataTypes.TEXT
    },
    policy_language_limits_oversight_discipline: {
      type: DataTypes.TEXT
    },
    policy_language_requires_city_pay_for_misconduct: {
      type: DataTypes.TEXT
    },
    policy_language_requires_comprehensive_reporting: {
      type: DataTypes.TEXT
    },
    policy_language_requires_deescalation: {
      type: DataTypes.TEXT
    },
    policy_language_requires_exhaust_other_means_before_shooting: {
      type: DataTypes.TEXT
    },
    policy_language_requires_warning_before_shooting: {
      type: DataTypes.TEXT
    },
    policy_language_restricts_delays_interrogations: {
      type: DataTypes.TEXT
    },
    policy_language_restricts_shooting_at_moving_vehicles: {
      type: DataTypes.TEXT
    },
    policy_manual_link: {
      type: DataTypes.TEXT
    },
    requires_city_pay_for_misconduct: {
      type: DataTypes.BOOLEAN
    },
    requires_comprehensive_reporting: {
      type: DataTypes.BOOLEAN
    },
    requires_deescalation: {
      type: DataTypes.BOOLEAN
    },
    requires_exhaust_other_means_before_shooting: {
      type: DataTypes.BOOLEAN
    },
    requires_warning_before_shooting: {
      type: DataTypes.BOOLEAN
    },
    restricts_delays_interrogations: {
      type: DataTypes.BOOLEAN
    },
    restricts_shooting_at_moving_vehicles: {
      type: DataTypes.BOOLEAN
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
  ScorecardPolicy.associate = (models) => {
    /**
     * Connect Policy to Agency
     */
    models.scorecard_policy.belongsTo(models.scorecard_agency, {
      foreignKey: 'agency_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardPolicy
}
