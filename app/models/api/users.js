/**
 * @module models/api/users
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import _ from 'lodash'
import Hashids from 'hashids'

import config from '../../config'

const hashID = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)

export default (sequelize, type) => {
  const User = sequelize.define('users', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    activated: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    username: {
      type: type.STRING(30),
      allowNull: false
    },
    password: {
      type: type.STRING(100),
      allowNull: false
    },
    email: {
      type: type.STRING(100),
      allowNull: false
    },
    first_name: {
      type: type.STRING(50),
      allowNull: true
    },
    last_name: {
      type: type.STRING(50),
      allowNull: true
    },
    company_name: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_name: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_photo: {
      type: type.STRING(255),
      allowNull: true
    },
    location: {
      type: type.STRING(50),
      allowNull: true
    },
    profile_link_website: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_link_twitter: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_link_1: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_link_2: {
      type: type.STRING(100),
      allowNull: true
    },
    profile_link_3: {
      type: type.STRING(100),
      allowNull: true
    },
    bio: {
      type: type.STRING(255),
      allowNull: true
    },
    banned: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    banned_reason: {
      type: type.STRING,
      allowNull: true
    },
    new_password: {
      type: type.STRING(100),
      allowNull: true
    },
    new_password_key: {
      type: type.STRING(25),
      allowNull: true
    },
    new_password_requested: {
      type: type.DATE,
      allowNull: true,
      defaultValue: type.fn('NOW')
    },
    new_email: {
      type: type.STRING(100),
      allowNull: true
    },
    new_email_key: {
      type: type.STRING(25),
      allowNull: true
    },
    new_email_requested: {
      type: type.DATE,
      allowNull: true,
      defaultValue: type.fn('NOW')
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
