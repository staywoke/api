'use strict'

/**
 * @module models/subscriptions
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('subscriptions', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subscription_type_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    stripe_customer_id: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    stripe_payment_source_id: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('monthly', 'annual'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },
    suspended_date: {
      type: DataTypes.DATE
    },
    suspended_reason: {
      type: DataTypes.STRING
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_payment: {
      type: DataTypes.DATE,
      allowNull: false
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    indexes: [
      {
        fields: ['user_id'],
        unique: true
      },
      {
        fields: ['stripe_customer_id'],
        unique: true
      },
      {
        fields: ['stripe_payment_source_id'],
        unique: true
      },
      {
        fields: ['type']
      },
      {
        fields: ['auto_renew']
      },
      {
        fields: ['subscription_type_id']
      },
      {
        fields: ['status']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  Subscription.associate = (models) => {
    models.subscriptions.belongsTo(models.subscription_types, {
      foreignKey: 'subscription_type_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    models.subscriptions.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return Subscription
}
