/**
 * @module models/api/tags
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import Slugify from 'sequelize-slugify'

export default (sequelize, type) => {
  const Tag = sequelize.define('tags', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING(50),
      allowNull: false
    },
    slug: {
      type: type.STRING(50),
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
