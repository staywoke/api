'use strict'

/**
 * @module models/geo_countries
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const createSlug = require('sluglife')

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
      unique: true
    },
    abbr2: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    abbr3: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    fips_code: {
      type: DataTypes.STRING(2),
      allowNull: true
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
    }
  })

  return GeoCountry
}
