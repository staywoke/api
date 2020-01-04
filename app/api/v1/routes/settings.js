/**
 * @module routes/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const config = require('../../../config')
const express = require('express')
const util = require('./util')

const { SettingsDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * Settings
 * @memberof module:routes/settings
 * @name [GET] /settings
 * @property {string} query - Query String
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/settings').get((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      SettingsDomain.getSettings(validUserId).then((settings) => {
        response.json(util.createAPIResponse({
          data: settings
        }, request.query.fields))
      }).catch((errors) => {
        response.status(400)
        response.json(util.createAPIResponse({
          errors: [errors.toString()]
        }, request.query.fields))
      })
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Profile Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/profile
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/settings/profile').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      request.body.id = validUserId
      SettingsDomain.updateUserProfile(request.body).then((user) => {
        response.json(util.createAPIResponse({
          data: user.publicJSON()
        }, request.query.fields))
      }).catch((errors) => {
        response.status(400)
        response.json(util.createAPIResponse({
          errors: [errors.toString()]
        }, request.query.fields))
      })
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Social Links Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/social-links
 * @property {string} [profile_link_website] - Profile Link Website
 * @property {string} [profile_link_twitter] - Profile Link Twitter
 * @property {string} [profile_link_1] - Misc Profile Link #1
 * @property {string} [profile_link_2] - Misc Profile Link #2
 * @property {string} [profile_link_3] - Misc Profile Link #3
 */
/* istanbul ignore next */
router.route('/settings/social-links').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      request.body.id = validUserId
      SettingsDomain.updateSocialLinks(request.body).then((user) => {
        response.json(util.createAPIResponse({
          data: user.publicJSON()
        }, request.query.fields))
      }).catch((errors) => {
        response.status(400)
        response.json(util.createAPIResponse({
          errors: [errors.toString()]
        }, request.query.fields))
      })
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Email Notification Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/email-notifications
 * @property {boolean} [email_comment_left=true] - Notification Setting for Email Comment Left
 * @property {boolean} [email_comment_liked=true] - Notification Setting for Email Comment Liked
 * @property {boolean} [email_someone_follows=true] - Notification Setting for Email Someone Follows
 * @property {boolean} [email_mentioned_in_comment=true] - Notification Setting for Email Mentioned in Comment
 */
/* istanbul ignore next */
router.route('/settings/email-notifications').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      request.body.id = validUserId
      SettingsDomain.updateEmailNotifications(request.body).then((settings) => {
        response.json(util.createAPIResponse({
          data: settings.dataValues
        }, request.query.fields))
      }).catch((errors) => {
        response.status(400)
        response.json(util.createAPIResponse({
          errors: [errors.toString()]
        }, request.query.fields))
      })
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Web Notification Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/web-notifications
 * @property {boolean} [web_comment_left=true] - Notification Setting for Web Comment Left
 * @property {boolean} [web_comment_liked=true] - Notification Setting for Web Comment Liked
 * @property {boolean} [web_someone_follows=true] - Notification Setting for Web Someone Follows
 * @property {boolean} [web_mentioned_in_comment=true] - Notification Setting for Web Mentioned in Comment
 */
/* istanbul ignore next */
router.route('/settings/web-notifications').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      request.body.id = validUserId
      SettingsDomain.updateWebNotifications(request.body).then((settings) => {
        response.json(util.createAPIResponse({
          data: settings.dataValues
        }, request.query.fields))
      }).catch((errors) => {
        response.status(400)
        response.json(util.createAPIResponse({
          errors: [errors.toString()]
        }, request.query.fields))
      })
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

module.exports = router
