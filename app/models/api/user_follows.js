/**
 * @module models/api/user_follows
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserFollow = sequelize.define('user_follows', {
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
   * Connect Activity to User
   */
  UserFollow.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'Follower'
  })

  /**
   * Connect User to Follower
   */
  UserFollow.belongsTo(User, {
    foreignKey: 'follow_user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'Following'
  })

  /**
   * Setup Relationships of Users and Followers
   */
  User.hasMany(UserFollow, {
    foreignKey: 'user_id',
    allowNull: true
  })
  User.hasMany(UserFollow, {
    foreignKey: 'follow_user_id',
    allowNull: true
  })

  return UserFollow
}
