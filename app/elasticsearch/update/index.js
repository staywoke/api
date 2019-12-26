/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import Category from './category'
import Tag from './tag'
import User from './user'

Category.update()
Tag.update()
User.update()

/**
 * Update
 * @type {object}
 */
export default {
  Category,
  Tag,
  User
}
