/**
 * @module models/api/user_settings_notifications
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserSettingNotification = sequelize.define('user_settings_notifications', {
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
    email_comment_left: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_comment_liked: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_someone_follows: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    email_mentioned_in_comment: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_comment_left: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_comment_liked: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_someone_follows: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    web_mentioned_in_comment: {
      type: type.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    newsletter: {
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
   * Connect Notification Settings to User
   */
  UserSettingNotification.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  return UserSettingNotification
}
