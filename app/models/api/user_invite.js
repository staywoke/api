/**
 * @module models/api/user_invite
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserInvite = sequelize.define('user_invite', {
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
    new_user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['user_id', 'new_user_id'],
        unique: true
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['new_user_id']
      }
    ]
  })

  /**
   * Connect Activity to User
   */
  UserInvite.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'User'
  })

  /**
   * Connect New User to Referring User
   */
  UserInvite.belongsTo(User, {
    foreignKey: 'new_user_id',
    targetKey: 'id',
    foreignKeyConstraint: true,
    as: 'Invited'
  })

  /**
   * Setup Relationships of Users and Followers
   */
  User.hasMany(UserInvite, {
    foreignKey: 'user_id',
    allowNull: true
  })
  User.hasMany(UserInvite, {
    foreignKey: 'new_user_id',
    allowNull: true
  })

  return UserInvite
}
