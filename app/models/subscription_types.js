'use strict'

/**
 * @module models/subscription_types
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('subscription_types', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'disabled'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    monthly_rate: {
      type: DataTypes.DECIMAL(8, 2).UNSIGNED,
      allowNull: false
    },
    annual_rate: {
      type: DataTypes.DECIMAL(8, 2).UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['name'],
        unique: true
      },
      {
        fields: ['status']
      }
    ]
  })
}
