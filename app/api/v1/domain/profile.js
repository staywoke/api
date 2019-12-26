/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import md5 from 'md5'
import Sequelize from 'sequelize'

import db from '../../../config/sequelize'
import { UserModel, UserActivityModel } from '../../../models/api'

const User = UserModel(db, Sequelize)
const UserActivity = UserActivityModel(db, Sequelize)

/**
 * Domain Profile
 * @type {object}
 */
export default {
  /**
   * Get User Activity
   * @param {number} userId - User ID
   * @returns {*}
   */
  getActivity: (userId) => {
    if (userId) {
      return UserActivity.findAll({
        include: [
          {
            model: User,
            as: 'User'
          },
          {
            model: User,
            as: 'Following'
          }
        ],
        where: {
          user_id: userId
        },
        order: [
          [
            'created_date', 'DESC'
          ]
        ]
      }).then((activity) => {
        if (activity) {
          const cleanData = []

          /* nyc ignore next */
          for (let i = 0; i < activity.length; i++) {
            const current = activity[i]
            const activityCleaned = {
              id: current.id,
              type: current.type,
              created_date: current.created_date,
              following: null,
              project: null,
              collection: null
            }

            if (current.Following) {
              const u = current.Following
              activityCleaned.following = {
                id: u.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : `https://secure.gravatar.com/avatar/${md5(u.email)}?r=g&s=200&d=identicon`,
                followed_on: u.created_date
              }
            }

            cleanData.push(activityCleaned)
          }

          return cleanData
        } else {
          return Promise.reject(`No activity found for user ${userId}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Get Notifications
   * @todo: Flush This Out
   */
  getNotifications: (userId) => {
    return Promise.resolve(userId)
  }
}
