'use strict'

/**
 * @module models/geo_counties
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const GeoCounty = sequelize.define('geo_counties', {
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
    fips_county_code: {
      type: DataTypes.STRING(3),
      allowNull: false
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
  Slugify.slugifyModel(GeoCounty, {
    source: ['name']
  })

  /**
   * Setup Model Associations
   */
  GeoCounty.associate = (models) => {
    /**
     * Connect County to Country
     */
    models.geo_counties.belongsTo(models.geo_countries, {
      foreignKey: 'country_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect County to State
     */
    models.geo_counties.belongsTo(models.geo_states, {
      foreignKey: 'state_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return GeoCounty
}
