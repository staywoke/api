/**
 * @module elasticsearch/create
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Create
 * @type {object}
 */
module.exports = {
  Category: require('./category'),
  GeoCities: require('./geo_cities'),
  GeoCounties: require('./geo_counties'),
  GeoCountries: require('./geo_countries'),
  GeoStates: require('./geo_states'),
  GeoTowns: require('./geo_towns'),
  Tag: require('./tag'),
  User: require('./user')
}
