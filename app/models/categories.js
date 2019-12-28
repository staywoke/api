'use strict'

/**
 * @module models/categories
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Slugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('categories', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
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
   * Setup Model Associations
   */
  Category.associate = (models) => {
    /**
     * Set Subcategory via `category.id` using `category.parent_id`
     */
    models.categories.belongsTo(models.categories, {
      foreignKey: 'parent_id',
      targetKey: 'id',
      foreignKeyConstraint: true
    })

    /**
     * Belongs to `Category`
     */
    models.categories.belongsTo(models.categories, {
      as: 'parent'
    })

    /**
     * Setup Relationship of Category and Subcategories
     */
    models.categories.hasMany(models.categories, {
      foreignKey: 'parent_id',
      as: 'subcategories'
    })
  }

  return Category
}
