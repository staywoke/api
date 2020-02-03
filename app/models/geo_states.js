'use strict'

/**
 * @module models/geo_states
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const GeoState = sequelize.define('geo_states', {
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
    type: {
      type: DataTypes.ENUM('district', 'outlying-area', 'state', 'territory'),
      allowNull: false,
      defaultValue: 'state'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    abbr: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fips_code: {
      type: DataTypes.STRING(2),
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['name', 'slug'],
        unique: true
      },
      {
        fields: ['type']
      }
    ]
  })

  /**
   * Auto Generate Slug for Name
   */
  Slugify.slugifyModel(GeoState, {
    source: ['name']
  })

  /**
   * Setup Model Associations
   */
  GeoState.associate = (models) => {
    /**
     * Connect State to Country
     */
    models.geo_states.belongsTo(models.geo_countries, {
      foreignKey: 'country_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return GeoState
}
