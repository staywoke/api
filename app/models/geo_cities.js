'use strict'

/**
 * @module models/geo_cities
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const GeoCity = sequelize.define('geo_cities', {
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
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fips_state_code: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    fips_place_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    coordinate: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['name', 'slug'],
        unique: true
      },
      {
        fields: ['country_id']
      },
      {
        fields: ['state_id']
      },
      {
        fields: ['fips_state_code']
      }
    ]
  })

  /**
   * Auto Generate Slug for Name
   */
  Slugify.slugifyModel(GeoCity, {
    source: ['name']
  })

  /**
   * Setup Model Associations
   */
  GeoCity.associate = (models) => {
    /**
     * Connect City to Country
     */
    models.geo_cities.belongsTo(models.geo_countries, {
      foreignKey: 'country_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect City to State
     */
    models.geo_cities.belongsTo(models.geo_states, {
      foreignKey: 'state_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return GeoCity
}
