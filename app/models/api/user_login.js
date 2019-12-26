/**
 * @module models/api/user_login
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import { UserModel } from './'

export default (sequelize, type) => {
  const User = UserModel(sequelize, type)
  const UserLogin = sequelize.define('user_login', {
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
    user_agent: {
      type: type.STRING,
      allowNull: false
    },
    ip_address: {
      type: type.STRING(15),
      allowNull: true
    },
    country: {
      type: 'CHAR(2)',
      allowNull: true
    },
    city: {
      type: type.STRING(50),
      allowNull: true
    },
    state: {
      type: type.STRING(50),
      allowNull: true
    },
    postal_code: {
      type: type.STRING(15),
      allowNull: true
    },
    latitude: {
      type: type.DECIMAL(10, 6),
      allowNull: true
    },
    longitude: {
      type: type.DECIMAL(10, 6),
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['country']
      }
    ]
  })

  /**
   * Connect Login to User
   */
  UserLogin.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  /**
   * Setup Relationships of Users and Followers
   */
  User.hasMany(UserLogin, {
    foreignKey: 'user_id',
    allowNull: true
  })

  return UserLogin
}
