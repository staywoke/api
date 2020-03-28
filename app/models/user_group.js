'use strict'

/**
 * @module models/user_group
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('user_group', {
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
    group_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['user_id', 'group_id'],
        unique: true
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['group_id']
      }
    ]
  })

  /**
   * Setup Model Associations
   */
  UserGroup.associate = (models) => {
    /**
     * Connect Activity to User
     */
    models.user_group.belongsTo(models.groups, {
      foreignKey: 'group_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Connect User to Follower
     */
    models.user_group.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Setup Relationships of Users and Groups
     */
    models.users.hasMany(models.user_group, {
      foreignKey: 'user_id'
    })
    models.groups.hasMany(models.user_group, {
      foreignKey: 'group_id'
    })
  }

  return UserGroup
}
