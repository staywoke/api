'use strict'

/**
 * @module models/user_follows
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserFollow = sequelize.define('user_follows', {
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
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['user_id', 'follow_user_id'],
        unique: true
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['follow_user_id']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  UserFollow.associate = (models) => {
    /**
     * Connect Activity to User
     */
    models.user_follows.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'Follower'
    })

    /**
     * Connect User to Follower
     */
    models.user_follows.belongsTo(models.users, {
      foreignKey: 'follow_user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'Following'
    })

    /**
     * Setup Relationships of Users and Followers
     */
    models.users.hasMany(models.user_follows, {
      foreignKey: 'user_id',
      allowNull: true
    })
    models.users.hasMany(models.user_follows, {
      foreignKey: 'follow_user_id',
      allowNull: true
    })
  }

  return UserFollow
}
