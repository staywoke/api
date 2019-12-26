/**
 * @module elasticsearch/update/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import _ from 'lodash'
import Sequelize from 'sequelize'

import config from '../../config'
import db from '../../config/sequelize'
import debug from '../../debug'
import elasticsearchClient from '../client'

import { UserDomain } from '../../api/v1/domain'
import { UserModel } from '../../models/api'

const env = config.get('env')
const indexType = `${env}_user`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

const User = UserModel(db, Sequelize)

/**
 * Update User Index
 */
export default {
  update: (userId) => {
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    }).then(() => {
      const params = {
        where: {
          banned: false
        }
      }

      if (userId) {
        params.where.id = userId
      }

      return User.findAll(params)
    }).then((user) => {
      if (user.length) {
        const bulkActions = []

        _.each(user, (evt) => {
          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: evt.id
            }
          })

          const userData = UserDomain.prepareForElasticSearch(evt)

          bulkActions.push(userData)
        })

        elasticsearchClient.bulk({
          body: bulkActions
        }).then((result) => {
          if (result.errors) {
            for (let i = 0; i < result.items.length; i++) {
              if (result.items[i].create && result.items[i].create.error) {
                debug.error(`Error indexing ${indexName} ${result.items[i]._id}`)
                debug.error(result.items[i].create.error)
              }
            }
          }

          debug.success(`${indexName} indexed ${result.items.length} items`)
        }).catch((error) => {
          debug.error(`Error indexing ${indexName}`)
          debug.error(`${error.status} ${error.message}`)
        })
      } else {
        debug.warn(`No new ${indexName} found`)
      }
    }).catch((error) => {
      debug.error(error)
    })
  }
}
