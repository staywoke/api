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
      allowNull: false,
      comment: 'Foreign Key to geo_cities'
    },
    county_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
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
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    black_population: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    hispanic_population: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    asian_pacific_population: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    other_population: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    mayor_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mayor_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    mayor_phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        is: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i
      }
    },
    police_chief_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    police_chief_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    police_chief_phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        is: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i
      }
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
