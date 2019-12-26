/**
 * @module models/api/categories
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import Slugify from 'sequelize-slugify'

export default (sequelize, type) => {
  const Category = sequelize.define('categories', {
    id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: type.INTEGER(10).UNSIGNED,
      allowNull: true
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
      fields: ['parent_id', 'slug'],
      unique: true
    }]
  })

  /**
   * Auto Generate Slug for Name
   */
  Slugify.slugifyModel(Category, {
    source: ['name']
  })

  /**
   * Set Subcategory via `category.id` using `category.parent_id`
   */
  Category.belongsTo(Category, {
    foreignKey: 'parent_id',
    targetKey: 'id',
    foreignKeyConstraint: true
  })

  /**
   * Belongs to `Category`
   */
  Category.belongsTo(Category, {
    as: 'parent'
  })

  /**
   * Setup Relationship of Category and Subcategories
   */
  Category.hasMany(Category, {
    foreignKey: 'parent_id',
    as: 'subcategories'
  })

  return Category
}
