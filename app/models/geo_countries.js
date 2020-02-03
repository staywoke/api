'use strict'

/**
 * @module models/geo_countries
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const GeoCountry = sequelize.define('geo_countries', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    abbr2: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    abbr3: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    fips_code: {
      type: DataTypes.STRING(2),
      allowNull: true
    }
  }, {
    indexes: [{
      fields: ['name', 'slug'],
      unique: true
    }]
  })

  /**
   * Auto Generate Slug for Name
   */
  Slugify.slugifyModel(GeoCountry, {
    source: ['name']
  })

  return GeoCountry
}
