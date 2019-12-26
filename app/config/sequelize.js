/**
 * @module config/sequelize
 */

import config from './index'
import Sequelize from 'sequelize'

const env = config.get('env')

const dbName = config.get('database.api.database')
const dbUser = config.get('database.api.username')
const dbPass = config.get('database.api.password')
const dbHost = config.get('database.api.host')

/**
 * Sequelize Options
 * @type {{host: *, port: number, dialect: string, logging: null, define: {freezeTableName: boolean, underscored: boolean, charset: string, collate: string, timestamps: boolean, paranoid: boolean, createdAt: string, updatedAt: string}}}
 */
const dbOptions = {
  host: dbHost,
  port: 3306,
  dialect: 'mysql',
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

const dbApi = new Sequelize(dbName, dbUser, dbPass, dbOptions)

dbApi.authenticate().then(() => {
  // Connection has been established successfully
}).catch((error) => {
  if (env !== 'test') {
    console.log('Unable to Connect to ' + dbHost)
    console.log(error)
  }
})

export default dbApi
