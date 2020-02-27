'use strict'

/**
 * @module models/geo_states
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const createSlug = require('sluglife')

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
    abbr: {
      type: DataTypes.STRING(2)
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fips_code: {
      type: DataTypes.STRING(2)
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
        fields: ['type']
      }
    ]
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
