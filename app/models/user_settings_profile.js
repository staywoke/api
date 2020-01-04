'use strict'

/**
 * @module models/user_settings_profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserSettingProfile = sequelize.define('user_settings_profile', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['user_id'],
      unique: true
    }]
  })

  /**
   * Setup Model Associations
   */
  UserSettingProfile.associate = (models) => {
    /**
     * Connect Settings to User
     */
    models.user_settings_profile.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })
  }

  return UserSettingProfile
}
