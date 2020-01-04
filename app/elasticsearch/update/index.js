/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Category = require('./category')
const Tag = require('./tag')
const User = require('./user')

Category.update()
Tag.update()
User.update()

/**
 * Update
 * @type {object}
 */
module.exports = {
  Category: Category,
  Tag: Tag,
  User: User
}
