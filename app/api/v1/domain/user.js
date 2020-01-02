/**
 * @module domain/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const Hashids = require('hashids/cjs')
const md5 = require('md5')
const randomString = require('randomstring')

const { Op } = require('sequelize')

const config = require('../../../config')
const email = require('./email')
const hasher = require('../../../util/hasher')
const models = require('../../../models')
const routeUtil = require('../routes/util')

/**
 * Domain User
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput (data) {
    const fields = [
      'bio',
      'company_name',
      'email',
      'first_name',
      'hash_id',
      'join_date',
      'last_name',
      'location',
      'profile_link_1',
      'profile_link_2',
      'profile_link_3',
      'profile_link_twitter',
      'profile_link_website',
      'profile_name',
      'profile_photo',
      'username'
    ]

    return _.pick(data._source, fields)
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {number} data.id - User ID
   * @param {string} data.bio - User Bio
   * @param {string} data.company_name - User Company Name
   * @param {string} data.email - User Email Address
   * @param {string} data.first_name - User First Name
   * @param {string} data.hash_id - User Hash ID
   * @param {timestamp} data.join_date - User Join Date
   * @param {string} data.last_name - User Last Name
   * @param {string} data.location - User Location
   * @param {string} data.profile_link_1 - User Misc Link #1
   * @param {string} data.profile_link_2 - User Misc Link #2
   * @param {string} data.profile_link_3 - User Misc Link #3
   * @param {string} data.profile_link_twitter - User Twitter Link
   * @param {string} data.profile_link_website - User Website Link
   * @param {string} data.profile_name - User Profile Name
   * @param {string} data.profile_photo - User Profile Photo URL
   * @param {string} data.username - Users Username
   * @return {object}
   */
  prepareForElasticSearch (data) {
    return {
      id: data.id,
      bio: data.bio,
      company_name: data.company_name,
      email: data.email,
      first_name: data.first_name,
      hash_id: data.hash_id,
      join_date: data.join_date,
      last_name: data.last_name,
      location: data.location,
      profile_link_1: data.profile_link_1,
      profile_link_2: data.profile_link_2,
      profile_link_3: data.profile_link_3,
      profile_link_twitter: data.profile_link_twitter,
      profile_link_website: data.profile_link_website,
      profile_name: data.profile_name,
      profile_photo: data.profile_photo,
      username: data.username
    }
  },

  /**
   * Check Invite Code
   * @param {string} key - Hash ID of User ID
   * @returns {*}
   */
  checkInviteCode (key) {
    const hashID = new Hashids(
      config.get('hashID.secret'),
      config.get('hashID.length'),
      config.get('hashID.alphabet')
    )

    let userID

    try {
      userID = hashID.decode(key)
    } catch (err) {
      return Promise.reject('Invalid Invitation Code')
    }

    if (parseInt(userID, 10)) {
      return models.user_invite.findAll({
        include: [
          {
            model: models.users,
            where: {
              activated: true,
              banned: false
            },
            as: 'User'
          },
          {
            model: models.users,
            where: {
              activated: true,
              banned: false
            },
            as: 'Invited'
          }
        ],
        where: {
          user_id: userID
        },
        order: [
          ['created_date', 'DESC']
        ]
      }).then((invites) => {
        if (invites) {
          const cleanInvited = []

          /* nyc ignore next */
          for (let i = 0; i < invites.length; i++) {
            const ui = invites[i]
            const u = ui.Invited

            cleanInvited.push({
              id: ui.id,
              username: u.username,
              profile_name: u.profile_name,
              profile_photo: (u.profile_photo) ? u.profile_photo : `https://secure.gravatar.com/avatar/${md5(u.email)}?r=g&s=200&d=identicon`,
              joined_on: ui.created_date
            })
          }

          return cleanInvited
        } else {
          return []
        }
      })
    } else {
      return Promise.reject('Invalid Invitation Code')
    }
  },

  /**
   * Delete User Account
   * @param {object} account - User Account to be Deleted
   * @param {object} account.id - User ID of Account to be Deleted
   * @param {object} account.username - Username of Account to be Deleted
   * @returns {*}
   */
  deleteAccount (account) {
    if (account && account.username && account.id) {
      return models.users.findOne({
        where: {
          id: account.id,
          username: account.username,
          activated: true,
          banned: false
        }
      }).then((deletedUser) => {
        if (deletedUser) {
          deletedUser.set('username', '~' + deletedUser.username)
          deletedUser.set('email', '~' + deletedUser.email)
          deletedUser.set('password', 'deleted-account')
          deletedUser.set('password_oauth', null)
          deletedUser.set('new_password_key', null)
          deletedUser.set('new_password_requested', null)
          deletedUser.set('new_email', null)
          deletedUser.set('new_email_key', null)
          deletedUser.set('new_email_requested', null)
          deletedUser.set('activated', 0)

          deletedUser.save()

          return deletedUser.destroy().then((removed) => {
            return removed
          })
        } else {
          return Promise.reject(`No user found for user ${account.username}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Check if Email Address is in Use
   * @param {string} emailAddress - Email Address to check if it exists
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  emailAddressInUse (emailAddress, callback) {
    if (emailAddress) {
      return models.users.findOne({
        where: {
          email: {
            [Op.eq]: emailAddress
          }
        }
      }).then((foundUser) => {
        if (typeof callback === 'function') {
          return callback(foundUser !== null)
        } else {
          return Promise.reject('Request Invalid')
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Follow User
   * @param {number} currentUserID - Current Logged In Users ID
   * @param {string} followUsername - Username of User to Follow
   * @returns {*}
   */
  followUser (currentUserID, followUsername) {
    currentUserID = parseInt(currentUserID, 10)

    if (currentUserID && followUsername) {
      return models.users.findOne({
        where: {
          username: followUsername,
          activated: true,
          banned: false
        }
      }).then((followUser) => {
        if (followUser) {
          const followUserId = parseInt(followUser.id, 10)

          if (followUserId === currentUserID) {
            return Promise.reject(`You Can't follow yourself.`)
          }

          // Check if we previously followed this user
          return models.user_follows.findOne({
            where: {
              user_id: currentUserID,
              follow_user_id: followUserId
            },
            paranoid: false
          }).then((existing) => {
            if (existing) {
              // This is a refollow, restore the connection
              existing.restore()
              return existing.dataValues
            } else {
              // This is a new follow
              return models.user_follows.create({
                user_id: currentUserID,
                follow_user_id: followUserId
              }).then((created) => {
                return created.dataValues
              })
            }
          })
        } else {
          return Promise.reject(`No user found for user ${followUsername}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Get Followers of `username`
   * @param {string} username -
   * @returns {*}
   */
  getFollowers (username) {
    if (username) {
      return models.users.findOne({
        where: {
          username: username,
          activated: true,
          banned: false
        }
      }).then((userData) => {
        if (userData) {
          return models.user_follows.findAll({
            include: [
              {
                model: models.users,
                where: {
                  activated: true,
                  banned: false
                },
                as: 'Follower'
              },
              {
                model: models.users,
                where: {
                  activated: true,
                  banned: false
                },
                as: 'Following'
              }
            ],
            where: {
              follow_user_id: userData.id,
              user_id: {
                [Op.ne]: userData.id
              }
            },
            order: [
              ['created_date', 'DESC']
            ]
          }).then((followers) => {
            const cleanFollowers = []

            /* nyc ignore next */
            for (let i = 0; i < followers.length; i++) {
              const f = followers[i]
              const u = f.Follower

              cleanFollowers.push({
                id: f.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : `https://secure.gravatar.com/avatar/${md5(u.email)}?r=g&s=200&d=identicon`,
                followed_on: f.created_date
              })
            }

            return cleanFollowers
          })
        } else {
          return []
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Get Users that are Following `username`
   * @param {string} username - Which Username to check
   * @returns {*}
   */
  getFollowing (username) {
    if (username) {
      return models.users.findOne({
        where: {
          username: username,
          activated: true,
          banned: false
        }
      }).then((userData) => {
        if (userData) {
          return models.user_follows.findAll({
            include: [
              {
                model: models.users,
                where: {
                  activated: true,
                  banned: false
                },
                as: 'Follower'
              },
              {
                model: models.users,
                where: {
                  activated: true,
                  banned: false
                },
                as: 'Following'
              }
            ],
            where: {
              user_id: userData.id,
              follow_user_id: {
                [Op.ne]: userData.id
              }
            },
            order: [
              ['created_date', 'DESC']
            ]
          }).then((following) => {
            const cleanFollowing = []

            /* nyc ignore next */
            for (let i = 0; i < following.length; i++) {
              const f = following[i]
              const u = f.Following

              cleanFollowing.push({
                id: f.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : `https://secure.gravatar.com/avatar/${md5(u.email)}?r=g&s=200&d=identicon`,
                followed_on: f.created_date
              })
            }

            return cleanFollowing
          })
        } else {
          return []
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Unfollow User
   * @param {number} currentUserID - Current Logged In Users ID
   * @param {string} unfollowUsername - Which Username to check
   * @returns {*}
   */
  unfollowUser (currentUserID, unfollowUsername) {
    currentUserID = parseInt(currentUserID, 10)

    if (currentUserID && unfollowUsername) {
      return models.users.findOne({
        where: {
          username: unfollowUsername,
          activated: true,
          banned: false
        }
      }).then((unfollowUser) => {
        if (unfollowUser) {
          const unfollowUserId = parseInt(unfollowUser.id, 10)

          if (unfollowUserId === currentUserID) {
            return Promise.reject(`You Can't follow / unfollow yourself.`)
          }

          return models.user_follows.findOne({
            where: {
              user_id: currentUserID,
              follow_user_id: unfollowUserId
            }
          }).then((follow) => {
            return follow.destroy()
          }).catch(() => {
            return Promise.reject(`You are not following ${unfollowUsername}`)
          })
        } else {
          return Promise.reject(`No user found for user ${unfollowUsername}`)
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Update Users Data
   * @param {number} validUserId - Users ID
   * @param {object} newUserData - New Users Data
   * @param {string} ipAddress - IP Address of Request
   * @returns {*}
   */
  updateAccount (validUserId, newUserData, ipAddress) {
    if (validUserId && newUserData) {
      return models.users.findOne({
        where: {
          id: validUserId,
          activated: true,
          banned: false
        }
      }).then((updateUser) => {
        if (updateUser) {
          const responseMessage = []
          let usernameChecked = false
          let emailChecked = false
          let passwordChecked = false

          /* nyc ignore next */
          const sendEmails = () => {
            if (usernameChecked && emailChecked && passwordChecked) {
              if (updateUser.save()) {
                routeUtil.getGeoLocation(ipAddress, (geolocation) => {
                  // Send notification email if user changed username
                  if (newUserData.new_username) {
                    email.sendChangedUsernameEmail(updateUser, geolocation, newUserData)
                  }

                  // Send confirmation email if user changed email
                  if (newUserData.new_email) {
                    email.sendConfirmChangedEmailAddressEmail(updateUser, geolocation, newUserData)
                  }

                  // Send confirmation email if user changed password
                  if (newUserData.new_password) {
                    email.sendConfirmChangedPasswordEmail(updateUser, geolocation, newUserData)
                  }
                })

                return {
                  title: 'Account Updated',
                  messages: responseMessage,
                  user: updateUser
                }
              } else {
                return Promise.reject('Error Saving User Account')
              }
            }
          }

          // Check if user changed username
          if (newUserData.new_username) {
            updateUser.set('username', newUserData.new_username.toLowerCase())
            responseMessage.push(`Your username has been updated to "${newUserData.new_username}". A confirmation of this change has been sent to your email address.`)
            usernameChecked = true
          } else {
            usernameChecked = true
          }

          // Check if user changed email
          if (newUserData.new_email) {
            updateUser.set('new_email', newUserData.new_email)
            updateUser.set('new_email_key', randomString.generate(12))
            updateUser.set('new_email_requested', Date.now())
            responseMessage.push('For your protection, we have sent you a confirmation email to confirm your change of Email Address.  If you are unable to access your current email address, please contact us.')
            emailChecked = true
          } else {
            emailChecked = true
          }

          // Check if user changed password
          if (newUserData.new_password) {
            return hasher.generate(newUserData.new_password).then((encodedPassword) => {
              updateUser.set('new_password', encodedPassword)
              updateUser.set('new_password_key', randomString.generate(12))
              updateUser.set('new_password_requested', Date.now())

              responseMessage.push('For your protection, we have sent you a confirmation email to confirm your change of Password.')
              passwordChecked = true

              return sendEmails()
            })
          } else {
            passwordChecked = true
            return sendEmails()
          }
        } else {
          return Promise.reject('No matching user found.')
        }
      })
    } else {
      return Promise.reject('Request Invalid')
    }
  },

  /**
   * Check if Username is in Use
   * @param {string} username - Username to check if it exists
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  usernameInUse (username, callback) {
    if (username) {
      return models.users.findOne({
        where: {
          username: {
            [Op.eq]: username.toLowerCase()
          }
        }
      }).then((foundUser) => {
        if (typeof callback === 'function') {
          return callback(foundUser !== null)
        } else {
          return Promise.reject('Invalid Request')
        }
      })
    } else {
      return Promise.reject('Username Check Request Invalid')
    }
  }
}
