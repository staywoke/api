/**
 * @module models/api/user_activity
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserActivity = sequelize.define('user_activity', {
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
    follow_user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    type: {
      type: type.ENUM(
        'changed_email',
        'changed_password',
        'changed_username',
        'closed_account',
        'comment_liked',
        'created_account',
        'downgraded_account',
        'followed_user',
        'left_comment',
        'liked_comment',
        'login',
        'logout',
        'received_comment',
        'reset_password',
        'upgraded_account',
        'user_followed'
      ),
      allowNull: false,
      defaultValue: 'login'
    }
  }, {
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['type']
      }
    ]
  })

  /**
   * Connect Activity to User
   */
  UserActivity.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'User',
    allowNull: false
  })

  /**
   * Connect User to Follower
   */
  UserActivity.belongsTo(User, {
    foreignKey: 'follow_user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'Following',
    allowNull: true
  })

  /**
   * Setup Relationships of Users and Followers
   */
  User.hasMany(UserActivity, {
    foreignKey: 'user_id',
    allowNull: true
  })
  User.hasMany(UserActivity, {
    foreignKey: 'follow_user_id',
    allowNull: true
  })

  return UserActivity
}
