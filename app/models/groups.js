'use strict'

/**
 * @module models/groups
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('groups', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['name', 'slug'],
      unique: true
    }]
  })

  /**
   * Auto Generate Slug for Name
   */
  Slugify.slugifyModel(Group, {
    source: ['name']
  })

  return Group
}
