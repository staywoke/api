'use strict'

/**
 * @module models/subscription_payments
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const SubscriptionPayment = sequelize.define('subscription_payments', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    subscription_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    payment_type: {
      type: DataTypes.ENUM('monthly', 'annual'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    payment_amount: {
      type: DataTypes.DECIMAL(8, 2).UNSIGNED,
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['subscription_id']
      },
      {
        fields: ['payment_type']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  SubscriptionPayment.associate = (models) => {
    models.subscription_payments.belongsTo(models.subscriptions, {
      foreignKey: 'subscription_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    models.subscription_payments.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return SubscriptionPayment
}
