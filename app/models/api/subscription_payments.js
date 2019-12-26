/**
 * @module models/api/subscription_payments
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel, SubscriptionModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const Subscription = SubscriptionModel(sequelize, type)
  const SubscriptionPayment = sequelize.define('subscription_payments', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    subscription_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    payment_type: {
      type: type.ENUM('monthly', 'annual'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    payment_amount: {
      type: type.DECIMAL(8, 2).UNSIGNED,
      allowNull: false
    },
    payment_date: {
      type: type.DATE,
      allowNull: false,
      defaultValue: type.fn('NOW')
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

  SubscriptionPayment.belongsTo(Subscription, {
    foreignKey: 'subscription_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  SubscriptionPayment.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  return SubscriptionPayment
}
