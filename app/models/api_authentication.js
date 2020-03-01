'use strict'

/**
 * @module models/api_authentication
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const ApiAuthentication = sequelize.define('api_authentication', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    approved_whitelist: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'localhost'
    },
    api_key: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    api_secret: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    allow_api_get: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_api_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_api_put: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_api_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allow_content_management: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allow_user_registration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    app_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    app_type: {
      type: DataTypes.ENUM('web_app', 'mobile_app', 'os_app', 'tv_app', 'custom_app', 'developer'),
      allowNull: false,
      defaultValue: 'developer'
    },
    app_purpose: {
      type: DataTypes.TEXT
    },
    app_description: {
      type: DataTypes.TEXT
    },
    daily_limit: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 2500
    },
    status: {
      type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'developer_terminated', 'deleted'),
      allowNull: false,
      defaultValue: 'pending_approval'
    },
    expire_date: {
      type: DataTypes.DATE
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

  /**
   * Setup Model Associations
   */
  ApiAuthentication.associate = (models) => {
    models.api_authentication.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return ApiAuthentication
}
