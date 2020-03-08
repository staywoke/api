'use strict'

/**
 * @module models/scorecard_agency
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const createSlug = require('sluglife')

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
    type: {
      type: DataTypes.ENUM('county-police', 'police-department', 'primary-state-le', 'regional-police', 'sheriff', 'special-police', 'tribal'),
      allowNull: false,
      defaultValue: 'police-department'
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
      type: DataTypes.DECIMAL(5, 2)
    },
    black_population: {
      type: DataTypes.DECIMAL(5, 2)
    },
    hispanic_population: {
      type: DataTypes.DECIMAL(5, 2)
    },
    asian_pacific_population: {
      type: DataTypes.DECIMAL(5, 2)
    },
    other_population: {
      type: DataTypes.DECIMAL(5, 2)
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
    }
  }, {
    getterMethods: {
      slug () {
        return createSlug(this.name, {
          replacement: '-',
          replaceSymbols: true,
          lower: true
        })
      }
    },
    indexes: [
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
      foreignKeyConstraint: true
    })

    /**
     * Connect Agency to State
     */
    models.scorecard_agency.belongsTo(models.geo_states, {
      foreignKey: 'state_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect Agency to City
     */
    models.scorecard_agency.belongsTo(models.geo_cities, {
      foreignKey: 'city_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect Agency to County
     */
    models.scorecard_agency.belongsTo(models.geo_counties, {
      foreignKey: 'county_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ScorecardAgency
}
