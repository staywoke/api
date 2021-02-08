/**
 * @module config/sequelize
 */

const Sequelize = require('sequelize')

const config = require('./index')

const dbName = config.get('database.api.database')
const dbUser = config.get('database.api.username')
const dbPass = config.get('database.api.password')
const dbHost = config.get('database.api.host')
const dbOptions = {
  host: dbHost,
  port: config.get('database.api.port'),
  dialect: 'mysql',
  dialectOptions: {
    supportBigNumbers: true
  },
  logging: null,
  define: {
    freezeTableName: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_date',
    updatedAt: 'modified_date'
  }
}

module.exports = new Sequelize(dbName, dbUser, dbPass, dbOptions)
