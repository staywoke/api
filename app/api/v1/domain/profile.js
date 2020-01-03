/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const md5 = require('md5')

const models = require('../../../models')

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get User Activity
   * @param {number} userId - User ID
   * @returns {*}
   */
  getActivity (userId) {
    /* istanbul ignore else */
    if (userId) {
      return models.user_activity.findAll({
        include: [
          {
            model: models.users,
            as: 'User'
          },
          {
            model: models.users,
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

          /* istanbul ignore next */
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
  getNotifications (userId) {
    return Promise.resolve(userId)
  }
}
