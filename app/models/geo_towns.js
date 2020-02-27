'use strict'

/**
 * @module models/geo_towns
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const createSlug = require('sluglife')

module.exports = (sequelize, DataTypes) => {
  const GeoTown = sequelize.define('geo_towns', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    county_id: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fips_state_code: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    fips_county_code: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    fips_county_sub_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8)
    },
    coordinate: {
      type: DataTypes.GEOMETRY('POINT')
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
      },
      {
        fields: ['fips_state_code']
      },
      {
        fields: ['fips_county_code']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  GeoTown.associate = (models) => {
    /**
     * Connect Town to Country
     */
    models.geo_towns.belongsTo(models.geo_countries, {
      foreignKey: 'country_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect Town to State
     */
    models.geo_towns.belongsTo(models.geo_states, {
      foreignKey: 'state_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect Town to County
     */
    models.geo_towns.belongsTo(models.geo_counties, {
      foreignKey: 'county_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return GeoTown
}
