'use strict'

/**
 * @module models/user_invite
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserInvite = sequelize.define('user_invite', {
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
    new_user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
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
   * Setup Model Associations
   */
  UserInvite.associate = (models) => {
    /**
     * Connect Activity to User
     */
    models.user_invite.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'User'
    })

    /**
     * Connect New User to Referring User
     */
    models.user_invite.belongsTo(models.users, {
      foreignKey: 'new_user_id',
      targetKey: 'id',
      foreignKeyConstraint: true,
      as: 'Invited'
    })

    /**
     * Setup Relationships of Users and Followers
     */
    models.users.hasMany(models.user_invite, {
      foreignKey: 'user_id'
    })
    models.users.hasMany(models.user_invite, {
      foreignKey: 'new_user_id'
    })
  }

  return UserInvite
}
