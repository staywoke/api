'use strict'

/**
 * @module models/scorecard_agency
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ScorecardAgency = sequelize.define('scorecard_agency', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'Foreign Key to geo_countries'
    },
    state_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'Foreign Key to geo_states'
    },
    city_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      comment: 'Foreign Key to geo_cities'
    },
    county_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      comment: 'Foreign Key to geo_counties'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Agency Name will usually be Auto Generated from city / county name. But some data might not be tied to a city / county.'
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('county-police', 'police-department', 'primary-state-le', 'regional-police', 'sheriff', 'special-police', 'tribal'),
      allowNull: false,
      defaultValue: 'police-department'
    },
    complete: {
      type: DataTypes.BOOLEAN
    },
    completeness: {
      type: DataTypes.INTEGER(3)
    },
    ori: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    total_population: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    white_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    black_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    hispanic_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    asian_pacific_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    native_american_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    other_population: {
      type: DataTypes.FLOAT(5, 2).UNSIGNED
    },
    mayor_name: {
      type: DataTypes.STRING(100)
    },
    mayor_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        customValidator (value) {
          // eslint-disable-next-line no-useless-escape
          if (value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
            throw new Error(`Invalid Email Address: "${value}"`)
          }
        }
      }
    },
    mayor_phone: {
      type: DataTypes.STRING(12),
      allowNull: true,
      validate: {
        customValidator (value) {
          if (value && !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(value)) {
            throw new Error(`Invalid Phone Number: "${value}"`)
          }
        }
      }
    },
    mayor_contact_url: {
      type: DataTypes.STRING(255)
    },
    police_chief_name: {
      type: DataTypes.STRING(50)
    },
    police_chief_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        customValidator (value) {
          // eslint-disable-next-line no-useless-escape
          if (value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
            throw new Error(`Invalid Email Address: "${value}"`)
          }
        }
      }
    },
    police_chief_phone: {
      type: DataTypes.STRING(12),
      allowNull: true,
      validate: {
        customValidator (value) {
          if (value && !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i.test(value)) {
            throw new Error(`Invalid Phone Number: "${value}"`)
          }
        }
      }
    },
    police_chief_contact_url: {
      type: DataTypes.STRING(255)
    },
    advocacy_tip: {
      type: DataTypes.TEXT
    }
  }, {
    indexes: [
      {
        fields: ['ori'],
        unique: true
      },
      {
        fields: ['country_id']
      },
      {
        fields: ['state_id']
      },
      {
        fields: ['county_id']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  ScorecardAgency.associate = (models) => {
    /**
     * Connect Agency to Country
     */
    models.scorecard_agency.belongsTo(models.geo_countries, {
      foreignKey: 'country_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'country'
    })

    /**
     * Connect Agency to State
     */
    models.scorecard_agency.belongsTo(models.geo_states, {
      foreignKey: 'state_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'state'
    })

    /**
     * Connect Agency to City
     */
    models.scorecard_agency.belongsTo(models.geo_cities, {
      foreignKey: 'city_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'city'
    })

    /**
     * Connect Agency to County
     */
    models.scorecard_agency.belongsTo(models.geo_counties, {
      foreignKey: 'county_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'county'
    })

    // Link Connected Data
    models.scorecard_agency.hasOne(models.scorecard_arrests, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'arrests'
    })

    models.scorecard_agency.hasOne(models.scorecard_homicide, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'homicide'
    })

    models.scorecard_agency.hasOne(models.scorecard_jail, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'jail'
    })

    models.scorecard_agency.hasOne(models.scorecard_police_accountability, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'police_accountability'
    })

    models.scorecard_agency.hasOne(models.scorecard_police_funding, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'police_funding'
    })

    models.scorecard_agency.hasOne(models.scorecard_police_violence, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'police_violence'
    })

    models.scorecard_agency.hasOne(models.scorecard_policy, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'policy'
    })

    models.scorecard_agency.hasOne(models.scorecard_report, {
      foreignKey: 'agency_id',
      sourceKey: 'id',
      as: 'report'
    })
  }

  return ScorecardAgency
}
