/**
 * @module models/api/subscriptions
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel, SubscriptionTypeModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const SubscriptionType = SubscriptionTypeModel(sequelize, type)
  const Subscription = sequelize.define('subscriptions', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subscription_type_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    stripe_customer_id: {
      type: type.STRING(25),
      allowNull: false
    },
    stripe_payment_source_id: {
      type: type.STRING(25),
      allowNull: false
    },
    type: {
      type: type.ENUM('monthly', 'annual'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    status: {
      type: type.ENUM('active', 'cancelled', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },
    suspended_date: {
      type: type.DATE,
      allowNull: true
    },
    suspended_reason: {
      type: type.STRING,
      allowNull: true
    },
    valid_until: {
      type: type.DATE,
      allowNull: false
    },
    last_payment: {
      type: type.DATE,
      allowNull: false
    },
    auto_renew: {
      type: type.BOOLEAN,
      allowNull: true,
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

  Subscription.belongsTo(SubscriptionType, {
    foreignKey: 'subscription_type_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  Subscription.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  return Subscription
}
