/**
 * @module models/api/subscription_types
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

export default (sequelize, type) => {
  return sequelize.define('subscription_types', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: type.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'disabled'
    },
    name: {
      type: type.STRING(100),
      allowNull: false
    },
    description: {
      type: type.TEXT,
      allowNull: false
    },
    monthly_rate: {
      type: type.DECIMAL(8, 2).UNSIGNED,
      allowNull: false
    },
    annual_rate: {
      type: type.DECIMAL(8, 2).UNSIGNED,
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
