/**
 * @module models/api/api_authentication
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const ApiAuthentication = sequelize.define('api_authentication', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    approved_whitelist: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'localhost'
    },
    api_key: {
      type: type.STRING(128),
      allowNull: false
    },
    api_secret: {
      type: type.STRING(128),
      allowNull: false
    },
    allow_api_get: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_api_post: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_api_put: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_api_delete: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_content_management: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    allow_user_registration: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    app_name: {
      type: type.STRING(128),
      allowNull: false
    },
    app_type: {
      type: type.ENUM('web_app', 'mobile_app', 'os_app', 'tv_app', 'custom_app', 'developer'),
      allowNull: false,
      defaultValue: 'developer'
    },
    app_purpose: {
      type: type.TEXT,
      allowNull: true
    },
    app_description: {
      type: type.TEXT,
      allowNull: true
    },
    daily_limit: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 2500
    },
    status: {
      type: type.ENUM('pending_approval', 'approved', 'rejected', 'developer_terminated', 'deleted'),
      allowNull: false,
      defaultValue: 'pending_approval'
    },
    expire_date: {
      type: type.DATE,
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['api_key'],
        unique: true
      },
      {
        fields: ['allow_api_get']
      },
      {
        fields: ['allow_api_post']
      },
      {
        fields: ['allow_api_put']
      },
      {
        fields: ['allow_api_delete']
      },
      {
        fields: ['allow_content_management']
      },
      {
        fields: ['allow_user_registration']
      },
      {
        fields: ['status']
      },
      {
        fields: ['app_type']
      },
      {
        fields: ['user_id']
      }
    ]
  })

  ApiAuthentication.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  return ApiAuthentication
}
