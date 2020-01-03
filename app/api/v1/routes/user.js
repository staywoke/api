/**
 * @module routes/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

const express = require('express')
const passport = require('passport')

const config = require('../../../config')
const util = require('./util')
const elasticsearchClient = require('../../../elasticsearch/client')

const { EmailDomain, UserDomain, UsersAuthDomain, UsersLocalAuthStrategyDomain, UsersRegistrationDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * User Registration
 * @memberof module:routes/user
 * @name [POST] /user/register
 * @property {string} username - Requested Username ( 3-30 `a-zA-Z0-9_` Characters )
 * @property {string} password - User Password ( must be at least 6 characters in length )
 * @property {string} retype_password - Retyped Password ( must match `password` )
 * @property {string} [inviteCode] - Invitation Code ( might be required by API for users to register )
 * @property {string} first_name - First Name of User
 * @property {string} last_name - Last Name of User
 * @property {string} email - Users Email Addresses
 * @property {string} agree - User Indicated that they Agreed to the Terms of Service
 */
/* istanbul ignore next */
router.route('/user/register').post((request, response) => {
  UsersRegistrationDomain.register(request.body).then((user) => {
    const data = user.publicJSON()
    util.trackActivity(data.id, 'created_account', null, () => {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields))
    })
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      field_errors: errors
    }, request.query.fields))
  })
})

/**
 * User Confirm Account
 * @memberof module:routes/user
 * @name [POST] /user/confirm/account
 * @property {string} key - Account Confirmation Key, Must Match `new_email_key` in Database
 */
/* istanbul ignore next */
router.route('/user/confirm/account').get((request, response) => {
  UsersRegistrationDomain.confirmAccount(request.query.key).then((user) => {
    util.trackLogin(user, request)

    // Pull out public user data and generate token
    const data = user.publicJSON()
    data.token = UsersAuthDomain.createUserToken(user)
    response.json(util.createAPIResponse({
      data: data
    }, request.query.fields))
  }).catch((error) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }, request.query.fields))
  })
})

/**
 * User Confirm Email
 * @memberof module:routes/user
 * @name [POST] /user/confirm/email
 * @property {string} key - Email Confirmation Key, Must Match `new_email_key` in Database
 */
/* istanbul ignore next */
router.route('/user/confirm/email').get((request, response) => {
  UsersRegistrationDomain.confirmEmail(request.query.key).then((user) => {
    // Pull out public user data and generate token
    const data = user.publicJSON()
    data.token = UsersAuthDomain.createUserToken(user)

    util.trackActivity(data.id, 'changed_email', null, () => {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields))
    })
  }).catch((error) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }, request.query.fields))
  })
})

/**
 * User Confirm Password
 * @memberof module:routes/user
 * @name [POST] /user/confirm/password
 * @property {string} key - Password Confirmation Key, Must Match `new_password_key` in Database
 */
/* istanbul ignore next */
router.route('/user/confirm/password').get((request, response) => {
  UsersRegistrationDomain.confirmPassword(request.query.key).then((user) => {
    // Pull out public user data and generate token
    const data = user.publicJSON()
    data.token = UsersAuthDomain.createUserToken(user)

    util.trackActivity(data.id, 'changed_password', null, () => {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields))
    })
  }).catch((error) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }, request.query.fields))
  })
})

/**
 * User Login
 * @memberof module:routes/user
 * @name [POST] /user/login
 * @property {string} username - Username of Existing Account
 * @property {string} password - Password of Existing Account
 */
/* istanbul ignore next */
router.route('/user/login').post((request, response, next) => {
  try {
    passport.use(UsersLocalAuthStrategyDomain)
    passport.authenticate('local', (err, user, info) => {
      // Check for Invalid User Account
      if (err) {
        return response.status(401).json(util.createAPIResponse({
          errors: [err]
        }, request.query.fields))
      }

      if (!user) {
        return response.status(401).json(util.createAPIResponse({
          errors: [info.message]
        }, request.query.fields))
      }

      util.trackLogin(user, request)
      util.trackActivity(user.get('id'), 'login')

      // Pull out public user data and generate token
      const data = user.publicJSON()
      data.token = UsersAuthDomain.createUserToken(user)

      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields))
    })(request, response, next)
  } catch (err) {
    response.status(401).json(util.createAPIResponse({
      errors: ['Invalid Login', err.message]
    }, request.query.fields))
  }
})

/**
 * User Logout
 * @memberof module:routes/user
 * @name [POST] /user/logout
 */
/* istanbul ignore next */
router.route('/user/logout').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      util.trackActivity(validUserId, 'logout', null, () => {
        response.json(util.createAPIResponse({
          data: {
            success: true
          }
        }, request.query.fields))
      })
    } else {
      response.status(403).json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Update User Profile
 * @memberof module:routes/user
 * @name [POST] /user/update
 * @property {string} [new_username] - Allow User to Change Username
 * @property {string} [username] - Existing Username, Required if also passing over `new_username`
 * @property {string} [new_email] - Allow User to Change Email Address
 * @property {string} [email] - Existing Email Address, Required if also passing over `new_email`
 * @property {string} [new_password] -  Allow User to Change Password
 * @property {string} password - Existing Password, Required for all changes to accounts
 */
/* istanbul ignore next */
router.route('/user/update').post((request, response, next) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      passport.use(UsersLocalAuthStrategyDomain)
      passport.authenticate('local', (err, user, info) => {
        // Check for Invalid User Account
        if (err) {
          return response.status(400).json(util.createAPIResponse({
            errors: [err]
          }, request.query.fields))
        }

        if (!user) {
          return response.status(400).json(util.createAPIResponse({
            errors: [info.message]
          }, request.query.fields))
        }

        let usernameChecked = false
        let emailChecked = false
        let passwordChecked = false

        const updateAccount = () => {
          if (usernameChecked && emailChecked && passwordChecked) {
            return UserDomain.updateAccount(validUserId, request.body, request.headers['x-forwarded-for']).then((updated) => {
              response.json(util.createAPIResponse({
                data: updated
              }, request.query.fields))
            }).catch((errors) => {
              response.status(400)
              response.json(util.createAPIResponse({
                errors: [errors.toString()]
              }, request.query.fields))
            })
          }
        }

        // CHECK FOR ANY ERRORS BEFORE UPDATING DATA

        // Check if we are changing the username
        if (request.body.new_username) {
          // Check for invalid username
          if (!UsersRegistrationDomain.validUserName(request.body.new_username)) {
            response.status(400)
            response.json(util.createAPIResponse({
              errors: ['Invalid Username. Required Length: 3-30, Allowed Characters: a-Z0-9_']
            }, request.query.fields))
            return
          }

          // Check if old an new usernames are identical
          if (request.body.username.toLowerCase() === request.body.new_username.toLowerCase()) {
            response.status(400)
            response.json(util.createAPIResponse({
              errors: ['New Username and Current Username are identical.']
            }, request.query.fields))
            return
          }

          // Check if new username is already in use
          UserDomain.usernameInUse(request.body.new_username, (inUse) => {
            if (inUse) {
              response.status(400)
              response.json(util.createAPIResponse({
                errors: ['Username already in use.']
              }, request.query.fields))
            } else {
              util.trackActivity(validUserId, 'changed_username', null, () => {})
              usernameChecked = true
              updateAccount()
            }
          })
        } else {
          usernameChecked = true
        }

        // Check if we are changing the email address
        if (request.body.new_email) {
          // Check if old an new email addresses are identical
          if (request.body.email.toLowerCase() === request.body.new_email.toLowerCase()) {
            response.status(400)
            response.json(util.createAPIResponse({
              errors: ['New Email Address and Current Email Address are identical.']
            }, request.query.fields))
            return
          }

          // Check if new email address is already in use
          UserDomain.emailAddressInUse(request.body.new_email, (inUse) => {
            if (inUse) {
              response.status(400)
              response.json(util.createAPIResponse({
                errors: ['Email Address already in use.']
              }, request.query.fields))
            } else {
              emailChecked = true
              updateAccount()
            }
          })
        } else {
          emailChecked = true
        }

        // Check if we are changing the password
        if (request.body.new_password) {
          // Check for minimum length requirement
          if (request.body.password.length < 6) {
            response.status(400)
            response.json(util.createAPIResponse({
              errors: ['Minimum Password Length is 6 characters.']
            }, request.query.fields))

            return
          } else if (request.body.password === request.body.new_password) {
            // Check if old an new passwords are identical
            response.status(400)
            response.json(util.createAPIResponse({
              errors: ['New Password and Current Password are identical.']
            }, request.query.fields))

            return
          } else {
            passwordChecked = true
            return updateAccount()
          }
        } else {
          passwordChecked = true
        }

        return updateAccount()
      })(request, response, next)
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Delete User Account
 * @memberof module:routes/user
 * @name [DELETE] /user/delete
 * @property {string} password - Existing Password, Required to Delete Account
 */
/* istanbul ignore next */
router.route('/user/delete').delete((request, response, next) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      passport.use(UsersLocalAuthStrategyDomain)
      passport.authenticate('local', (err, user, info) => {
        // Check for Invalid User Account
        if (err) {
          return response.status(400).json(util.createAPIResponse({
            errors: [err]
          }, request.query.fields))
        }

        if (!user) {
          return response.status(400).json(util.createAPIResponse({
            errors: [info.message]
          }, request.query.fields))
        }

        UserDomain.deleteAccount(user).then(() => {
          util.trackActivity(validUserId, 'closed_account', null, () => {
            response.json(util.createAPIResponse({
              data: user.publicJSON()
            }))
          }, request.query.fields)
        }).catch((errors) => {
          response.status(400)
          response.json(util.createAPIResponse({
            errors: [errors.toString()]
          }, request.query.fields))
        })
      })(request, response, next)
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields))
    }
  })
})

/**
 * Refresh User Token
 * User token refresh, extracts the token out of the Authorization header and refreshes it, returning a new token under data: {token: '...'}
 * @memberof module:routes/user
 * @name [POST] /user/refresh
 */
/* istanbul ignore next */
router.route('/user/refresh').post((request, response) => {
  let errorMessage = 'No Authorization header found'

  if (request.headers && request.headers.authorization) {
    const parts = request.headers.authorization.split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        const token = credentials
        const newToken = UsersAuthDomain.refreshToken(token)

        if (newToken) {
          response.json(util.createAPIResponse({
            data: {
              token: newToken
            }
          }, request.query.fields))
          return
        } else {
          errorMessage = 'Invalid or expired token'
        }
      } else {
        errorMessage = 'Malformed Authorization header, must be "Bearer (token)"'
      }
    } else {
      errorMessage = 'Malformed Authorization header, must be "Bearer (token)"'
    }
  }

  // Return an error
  response.status(400).json(util.createAPIResponse({
    errors: [errorMessage]
  }))
})

/**
 * User Forgot Password
 * @memberof module:routes/user
 * @name [POST] /user/forgot-password
 * @property {string} email - Email Address user can't remember Password for
 */
/* istanbul ignore next */
router.route('/user/forgot-password').post((request, response) => {
  const ipAddress = request.headers['x-forwarded-for']
  UsersRegistrationDomain.forgotPassword(request.body).then((user) => {
    util.getGeoLocation(ipAddress, (geolocation) => {
      EmailDomain.sendUserForgotPasswordEmail(user, geolocation)
    })

    response.json(util.createAPIResponse({
      data: user.publicJSON()
    }, request.query.fields))
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [errors.toString()]
    }, request.query.fields))
  })
})

/**
 * User Reset Password
 * @memberof module:routes/user
 * @name [POST] /user/reset-password
 * @property {string} password - User Password ( must be at least 6 characters in length )
 * @property {string} retype_password - Retyped Password ( must match `password` )
 * @property {string} token - Change Password Token stored in `new_password_key`
 */
/* istanbul ignore next */
router.route('/user/reset-password').post((request, response) => {
  UsersRegistrationDomain.resetPassword(request.body).then((user) => {
    util.getGeoLocation(request.headers['x-forwarded-for'], (geolocation) => {
      EmailDomain.sendUserPasswordResetEmail(user, geolocation)
    })

    const data = user.publicJSON()
    util.trackActivity(data.id, 'reset_password', null, () => {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields))
    })
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [errors.toString()]
    }, request.query.fields))
  })
})

/**
 * User Resend Password
 * @memberof module:routes/user
 * @name [GET] /user/resend-confirmation/:id
 * @property {string} id - This is a Hash ID of the Users ID
 */
/* istanbul ignore next */
router.route('/user/resend-confirmation/:id').get((request, response) => {
  UsersRegistrationDomain.resendConfirmation(request.params.id).then((message) => {
    response.json(util.createAPIResponse({
      data: message
    }, request.query.fields))
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [errors.toString()]
    }, request.query.fields))
  })
})

/**
 * Get Profile for User
 * @memberof module:routes/user
 * @name [GET] /user/:username/profile
 * @property {string} username - Username to Use
 */
/* istanbul ignore next */
router.route('/user/:username/profile').get((request, response) => {
  // Defaults
  const env = config.get('env')
  const indexType = `${env}_user`
  const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`
  const page = 1
  const pageSize = 30

  const searchParams = {
    index: indexName,
    body: {}
  }

  if (request.params.username) {
    searchParams.body = {
      query: {
        match: {
          username: request.params.username
        }
      }
    }
  }

  searchParams.size = pageSize

  elasticsearchClient.search(searchParams).then((result) => {
    const data = result.hits.hits.map(UserDomain.prepareForAPIOutput)

    if (data && data.length === 1) {
      response.json(util.createAPIResponse({
        meta: {
          total: result.hits.total.value,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total.value / searchParams.size),
          page: page
        },
        data: data[0]
      }, request.query.fields))
    } else {
      response.status(400)
      response.json(util.createAPIResponse({
        meta: {
          total: 0,
          showing: 0,
          pages: 1,
          page: 1
        },
        errors: ['No Matching Username'],
        data: []
      }, request.query.fields))
    }
  }).catch((error) => {
    response.json(util.createAPIResponse({
      errors: [error]
    }, request.query.fields))
  })
})

/**
 * Add Username to Logged In Followers List
 * @memberof module:routes/user
 * @name [POST] /user/:username/follow
 * @property {string} username - Username to Use
 */
/* istanbul ignore next */
router.route('/user/:username/follow').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      if (!request.params.username) {
        response.json(util.createAPIResponse({
          errors: ['Missing Username']
        }, request.query.fields))
      }

      UserDomain.followUser(validUserId, request.params.username).then((followedUser) => {
        util.trackActivity(validUserId, 'followed_user', followedUser, () => {
          response.json(util.createAPIResponse({
            data: followedUser
          }, request.query.fields))
        })
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
 * Remove Username to Logged In Followers List
 * @memberof module:routes/user
 * @name [POST] /user/:username/unfollow
 * @property {string} username - Username to Use
 */
/* istanbul ignore next */
router.route('/user/:username/unfollow').post((request, response) => {
  util.isValidUser(request, (validUserId) => {
    if (validUserId) {
      if (!request.params.username) {
        response.json(util.createAPIResponse({
          errors: ['Missing Username']
        }, request.query.fields))
      }

      UserDomain.unfollowUser(validUserId, request.params.username).then((unfollowedUser) => {
        response.json(util.createAPIResponse({
          data: unfollowedUser.dataValues
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
 * Get Followers for Username
 * @memberof module:routes/user
 * @name [GET] /user/:username/followers
 * @property {string} username - Username to Use
 */
/* istanbul ignore next */
router.route('/user/:username/followers').get((request, response) => {
  if (!request.params.username || request.params.username.trim() === '') {
    response.status(400).json(util.createAPIResponse({
      errors: ['Missing Username']
    }, request.query.fields))
  }

  UserDomain.getFollowers(request.params.username).then((followers) => {
    response.json(util.createAPIResponse({
      data: followers
    }, request.query.fields))
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [errors.toString()]
    }, request.query.fields))
  })
})

/**
 * Get Users that Username is Following
 * @memberof module:routes/user
 * @name [GET] /user/:username/following
 * @property {string} username - Username to Use
 */
/* istanbul ignore next */
router.route('/user/:username/following').get((request, response) => {
  if (!request.params.username || request.params.username.trim() === '') {
    response.status(400).json(util.createAPIResponse({
      errors: ['Missing Username']
    }, request.query.fields))
  }

  UserDomain.getFollowing(request.params.username).then((following) => {
    response.json(util.createAPIResponse({
      data: following
    }, request.query.fields))
  }).catch((errors) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [errors.toString()]
    }, request.query.fields))
  })
})

/**
 * Get User Invite Keys
 * @memberof module:routes/user
 * @name [GET] /user/invite/:key
 * @property {string} key - This is a Hash ID of the Users ID
 */
/* istanbul ignore next */
router.route('/user/invite/:key').get((request, response) => {
  UserDomain.checkInviteCode(request.params.key).then((invites) => {
    response.json(util.createAPIResponse({
      data: invites
    }, request.query.fields))
  }).catch((error) => {
    response.status(400)
    response.json(util.createAPIResponse({
      errors: [error]
    }, request.query.fields))
  })
})

module.exports = router
