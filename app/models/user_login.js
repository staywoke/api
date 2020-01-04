'use strict'

/**
 * @module models/user_login
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

module.exports = (sequelize, DataTypes) => {
  const UserLogin = sequelize.define('user_login', {
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
    user_agent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    country: {
      type: 'CHAR(2)',
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
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
   * Setup Model Associations
   */
  UserLogin.associate = (models) => {
    /**
     * Connect Login to User
     */
    models.user_login.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Setup Relationships of Users and Followers
     */
    models.users.hasMany(models.user_login, {
      foreignKey: 'user_id',
      allowNull: true
    })
  }

  return UserLogin
}
