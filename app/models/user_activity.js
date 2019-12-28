'use strict'

/**
 * @module models/user_activity
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserActivity = sequelize.define('user_activity', {
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
    follow_user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(
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
   * Setup Model Associations
   */
  UserActivity.associate = (models) => {
    /**
     * Connect Activity to User
     */
    models.user_activity.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'User',
      allowNull: false
    })

    /**
     * Connect User to Follower
     */
    models.user_activity.belongsTo(models.users, {
      foreignKey: 'follow_user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'Following',
      allowNull: true
    })

    /**
     * Setup Relationships of Users and Followers
     */
    models.users.hasMany(models.user_activity, {
      foreignKey: 'user_id',
      allowNull: true
    })
    models.users.hasMany(models.user_activity, {
      foreignKey: 'follow_user_id',
      allowNull: true
    })
  }

  return UserActivity
}
