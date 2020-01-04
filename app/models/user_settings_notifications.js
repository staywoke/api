'use strict'

/**
 * @module models/user_settings_notifications
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserSettingNotification = sequelize.define('user_settings_notifications', {
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
    email_comment_left: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_comment_liked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_someone_follows: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_mentioned_in_comment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_comment_left: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_comment_liked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_someone_follows: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_mentioned_in_comment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
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
        fields: ['email_comment_left']
      },
      {
        fields: ['email_comment_liked']
      },
      {
        fields: ['email_someone_follows']
      },
      {
        fields: ['email_mentioned_in_comment']
      },
      {
        fields: ['web_comment_left']
      },
      {
        fields: ['web_comment_liked']
      },
      {
        fields: ['web_someone_follows']
      },
      {
        fields: ['web_mentioned_in_comment']
      },
      {
        fields: ['newsletter']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  UserSettingNotification.associate = (models) => {
    /**
     * Connect Notification Settings to User
     */
    models.user_settings_notifications.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return UserSettingNotification
}
