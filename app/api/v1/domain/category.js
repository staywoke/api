/**
 * @module domain/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const CategoryES = require('../../../elasticsearch/update/category')
const models = require('../../../models')

// Add ElasticSearch Hooks
models.categories.afterCreate(() => { CategoryES.update() })
models.categories.afterUpdate(() => { CategoryES.update() })
models.categories.afterDestroy(() => { CategoryES.update() })

/**
 * Category
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput (data) {
    const fields = [
      'name',
      'parent_id',
      'slug'
    ]
    const prepared = _.pick(data._source, fields)

    if (typeof data._source.subcategories !== 'undefined') {
      prepared.subcategories = _.sortBy(_.map(data._source.subcategories, (subcat) => {
        return _.pick(subcat, fields)
      }), 'name')
    }

    return prepared
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {number} data.id - Category ID
   * @param {number} data.parent_id - Category Parent ID
   * @param {string} data.name - Category Name
   * @param {string} data.slug - Category Slug
   * @param {object} data.subcategories - Category Subcategories
   * @return {object}
   */
  prepareForElasticSearch (data) {
    const prepData = {
      id: data.id,
      parent_id: data.parent_id,
      name: data.name,
      slug: data.slug,
      subcategories: []
    }

    for (let i = 0; i < data.subcategories.length; i++) {
      prepData.subcategories.push({
        id: data.subcategories[i].id,
        parent_id: data.subcategories[i].parent_id,
        name: data.subcategories[i].name,
        slug: data.subcategories[i].slug
      })
    }

    return prepData
  }
}
