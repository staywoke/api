'use strict'

/**
 * @module models/users
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const Hashids = require('hashids/cjs')

const config = require('../config')

const hashID = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50)
    },
    last_name: {
      type: DataTypes.STRING(50)
    },
    company_name: {
      type: DataTypes.STRING(100)
    },
    profile_name: {
      type: DataTypes.STRING(100)
    },
    profile_photo: {
      type: DataTypes.STRING(255)
    },
    location: {
      type: DataTypes.STRING(50)
    },
    profile_link_website: {
      type: DataTypes.STRING(100)
    },
    profile_link_twitter: {
      type: DataTypes.STRING(100)
    },
    profile_link_1: {
      type: DataTypes.STRING(100)
    },
    profile_link_2: {
      type: DataTypes.STRING(100)
    },
    profile_link_3: {
      type: DataTypes.STRING(100)
    },
    bio: {
      type: DataTypes.STRING(255)
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    banned_reason: {
      type: DataTypes.STRING
    },
    new_password: {
      type: DataTypes.STRING(100)
    },
    new_password_key: {
      type: DataTypes.STRING(25)
    },
    new_password_requested: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    new_email: {
      type: DataTypes.STRING(100)
    },
    new_email_key: {
      type: DataTypes.STRING(25)
    },
    new_email_requested: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      {
        fields: ['username'],
        unique: true
      },
      {
        fields: ['email'],
        unique: true
      },
      {
        fields: ['new_email'],
        unique: true
      },
      {
        fields: ['new_password_key'],
        unique: true
      },
      {
        fields: ['new_email_key'],
        unique: true
      },
      {
        fields: ['activated']
      },
      {
        fields: ['banned']
      }
    ]
  })

  /**
   * Filter User to remove Private Info for Public Consumption
   * @memberof module:models/api/users
   * @returns {object}
   */
  User.prototype.publicJSON = function () {
    const exclude = [
      'new_email',
      'new_email_key',
      'new_email_requested',
      'new_password',
      'new_password_requested',
      'password'
    ]

    const data = this.toJSON()

    data.hash_id = hashID.encode(data.id)

    _.each(exclude, (key) => {
      delete data[key]
    })

    return data
  }

  /**
   * Return whether or not the user account is active
   * @memberof module:models/api/users
   * @returns {boolean}
   */
  User.prototype.isActive = function () {
    return this.get('banned') === false && this.get('activated') === true
  }

  /**
   * Return the Fill Name of the User
   * @memberof module:models/api/users
   * @returns {string}
   */
  User.prototype.fullName = function () {
    if (this.get('first_name') && this.get('last_name')) {
      return this.get('first_name') + ' ' + this.get('last_name')
    }
    return ''
  }

  return User
}
