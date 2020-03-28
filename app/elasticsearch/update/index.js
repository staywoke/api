/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Category = require('./category')
const GeoCities = require('./geo_cities')
const GeoCounties = require('./geo_counties')
const GeoCountries = require('./geo_countries')
const GeoStates = require('./geo_states')
const GeoTowns = require('./geo_towns')
const Tag = require('./tag')
const User = require('./user')

Category.update()
GeoCities.update()
GeoCounties.update()
GeoCountries.update()
GeoStates.update()
GeoTowns.update()
Tag.update()
User.update()

/**
 * Update
 * @type {object}
 */
module.exports = {
  Category: Category,
  GeoCities: GeoCities,
  GeoCounties: GeoCounties,
  GeoCountries: GeoCountries,
  GeoStates: GeoStates,
  GeoTowns: GeoTowns,
  Tag: Tag,
  User: User
}
