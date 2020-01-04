/**
 * @module domain
 * @version 1.0.0
 */

/**
 * Domain
 * @type {object}
 */
module.exports = {
  CategoryDomain: require('./category'),
  EmailDomain: require('./email'),
  ProfileDomain: require('./profile'),
  SettingsDomain: require('./settings'),
  TagDomain: require('./tag'),
  UserDomain: require('./user'),
  UsersAuthDomain: require('./users/auth'),
  UsersLocalAuthStrategyDomain: require('./users/local_auth_strategy'),
  UsersRegistrationDomain: require('./users/registration'),
  UsersRegistrationFormDomain: require('./users/registration_form'),
  UtilDomain: require('./util')
}
