/**
 * @module domain/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const models = require('../../../models')

const { update } = require('../../../elasticsearch/update/user')

// Add ElasticSearch Hooks
/* istanbul ignore next: Difficult to Test this without ElasticSearch Fully Mocked */
if (update) {
  models.users.afterCreate((user) => { update(user.id) })
  models.users.afterUpdate((user) => { update(user.id) })
  models.users.afterDestroy((user) => { update(user.id) })
}

/**
 * Domain Settings
 * @type {object}
 */
module.exports = {
  /**
   * Get User Settings
   * @param {number} userId - User ID
   * @returns {*}
   */
  getSettings (userId) {
    // Set defaults for API before overwriting below
    const settings = {
      notifications: {
        email_comment_left: true,
        email_comment_liked: true,
        email_mentioned_in_comment: true,
        email_someone_follows: true,
        newsletter: true,
        web_comment_left: true,
        web_comment_liked: true,
        web_mentioned_in_comment: true,
        web_someone_follows: true
      }
    }

    return models.user_settings_notifications.findOne({
      where: {
        user_id: userId
      }
    }).then((notifications) => {
      if (notifications) {
        const notificationsFields = [
          'email_comment_left',
          'email_comment_liked',
          'email_mentioned_in_comment',
          'email_someone_follows',
          'newsletter',
          'web_comment_left',
          'web_comment_liked',
          'web_mentioned_in_comment',
          'web_someone_follows'
        ]

        settings.notifications = _.pick(notifications, notificationsFields)

        return settings
      }
    })
  },

  /**
   * Update User Profile
   * @param {object} data - Data for updating User Profile
   * @param {number} data.id - User ID for Update
   * @param {string} data.profile_name - Set Profile Name
   * @param {string} data.location - Set Location
   * @param {string} data.company_name - Set Company Name
   * @param {string} data.first_name - Set First Name
   * @param {string} data.last_name - Set Last Name
   * @param {string} data.bio - Set Bio
   * @param {string} data.profile_photo - Set Absolute URL for Profile Photo
   * @returns {*}
   */
  updateUserProfile (data) {
    if (data) {
      return models.users.findOne({
        where: {
          id: data.id,
          activated: true,
          banned: false
        }
      }).then((user) => {
        if (user) {
          user.set('profile_name', data.profile_name)
          user.set('location', data.location)
          user.set('company_name', data.company_name)
          user.set('first_name', data.first_name)
          user.set('last_name', data.last_name)
          user.set('bio', data.bio)
          user.set('profile_photo', data.profile_photo)

          return user.save()
        } else {
          return Promise.reject(`No user found with ID ${data.id}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Update Social Links
   * @param {object} data - Data for updating User Social Links
   * @param {number} data.id - User ID for Update
   * @param {string} data.profile_link_website - Absolute URL for Website
   * @param {string} data.profile_link_twitter - Absolute URL for Twitter
   * @param {string} data.profile_link_1 - Absolute URL for Random Website #1
   * @param {string} data.profile_link_2 - Absolute URL for Random Website #2
   * @param {string} data.profile_link_3 - Absolute URL for Random Website #3
   * @returns {*}
   */
  updateSocialLinks (data) {
    if (data) {
      return models.users.findOne({
        where: {
          id: data.id,
          activated: true,
          banned: false
        }
      }).then((user) => {
        if (user) {
          user.set('profile_link_website', data.profile_link_website)
          user.set('profile_link_twitter', data.profile_link_twitter)
          user.set('profile_link_1', data.profile_link_1)
          user.set('profile_link_2', data.profile_link_2)
          user.set('profile_link_3', data.profile_link_3)

          return user.save()
        } else {
          return Promise.reject(`No user found with ID ${data.id}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Update Email Notifications
   * @param {object} data - Data for updating Email Notifications
   * @param {number} data.id - User ID for Update
   * @param {boolean} data.email_comment_left=true - Set whether to notify via Email for Comments Left
   * @param {boolean} data.email_comment_liked=true - Set whether to notify via Email for Comments Liked
   * @param {boolean} data.email_someone_follows=true - Set whether to notify via Email for a new Follower
   * @param {boolean} data.email_mentioned_in_comment=true - Set whether to notify via Email for Mentions in Comments
   * @returns {*}
   */
  updateEmailNotifications (data) {
    if (data) {
      return models.user_settings_notifications.findOne({
        where: {
          user_id: data.id
        }
      }).then((notification) => {
        if (notification) {
          notification.set('email_comment_left', data.email_comment_left)
          notification.set('email_comment_liked', data.email_comment_liked)
          notification.set('email_someone_follows', data.email_someone_follows)
          notification.set('email_mentioned_in_comment', data.email_mentioned_in_comment)

          return notification.save()
        } else {
          return models.user_settings_notifications.create({
            user_id: data.id,
            email_comment_left: data.email_comment_left,
            email_comment_liked: data.email_comment_liked,
            email_someone_follows: data.email_someone_follows,
            email_mentioned_in_comment: data.email_mentioned_in_comment
          }).then((created) => {
            return created
          }).catch(() => {
            return Promise.reject('Unable to set email notifications')
          })
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Update Web Notifications
   * @param {object} data - Data for updating Web Notifications
   * @param {number} data.id - User ID for Update
   * @param {boolean} data.web_comment_left=true - Set whether to notify via Web for Comments Left
   * @param {boolean} data.web_comment_liked=true - Set whether to notify via Web for Comments Liked
   * @param {boolean} data.web_someone_follows=true - Set whether to notify via Web for a new Follower
   * @param {boolean} data.web_mentioned_in_comment=true - Set whether to notify via Web for Mentions in Comments
   * @returns {*}
   */
  updateWebNotifications (data) {
    if (data) {
      return models.user_settings_notifications.findOne({
        where: {
          user_id: data.id
        }
      }).then((notification) => {
        if (notification) {
          notification.set('web_comment_left', data.web_comment_left)
          notification.set('web_comment_liked', data.web_comment_liked)
          notification.set('web_someone_follows', data.web_someone_follows)
          notification.set('web_mentioned_in_comment', data.web_mentioned_in_comment)

          return notification.save()
        } else {
          return models.user_settings_notifications.create({
            user_id: data.id,
            web_comment_left: data.web_comment_left,
            web_comment_liked: data.web_comment_liked,
            web_someone_follows: data.web_someone_follows,
            web_mentioned_in_comment: data.web_mentioned_in_comment
          }).then((created) => {
            return created
          }).catch(() => {
            return Promise.reject('Unable to set web notifications')
          })
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  }
}
