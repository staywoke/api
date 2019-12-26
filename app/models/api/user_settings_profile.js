/**
 * @module models/api/user_settings_profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserSettingProfile = sequelize.define('user_settings_profile', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['user_id'],
      unique: true
    }]
  })

  /**
   * Connect Settings to User
   */
  UserSettingProfile.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  return UserSettingProfile
}
