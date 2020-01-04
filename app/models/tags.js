'use strict'

/**
 * @module models/tags
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tags', {
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
  Slugify.slugifyModel(Tag, {
    source: ['name']
  })

  return Tag
}
