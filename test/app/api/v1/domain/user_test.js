const chai = require('chai')
const Hashids = require('hashids/cjs')
const randomString = require('randomstring')
const Sequelize = require('sequelize')
const sinon = require('sinon')

const config = require('../../../../../app/config')
const db = require('../../../../../app/config/sequelize')

const {
  checkInviteCode,
  deleteAccount,
  emailAddressInUse,
  followUser,
  getFollowers,
  getFollowing,
  prepareForAPIOutput,
  prepareForElasticSearch,
  unfollowUser,
  updateAccount,
  usernameInUse
} = require('../../../../../app/api/v1/domain/user')

const {
  UserFollowModel,
  UserInviteModel,
  UserModel
} = require('../../../../../app/models/api')

const assert = chai.assert

const User = UserModel(db, Sequelize)
const UserFollow = UserFollowModel(db, Sequelize)
const UserInvite = UserInviteModel(db, Sequelize)

const hashid = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)

var userAccount = {
  id: 1,
  activated: true,
  banned: false,
  banned_reason: '',
  bio: 'I exist only in memory.',
  company_name: 'My Company',
  created_at: new Date(),
  email: 'jane.doe@email.com',
  first_name: 'Jane',
  hash_id: 'abc123',
  join_date: new Date(),
  last_name: 'Doe',
  location: 'Florida, USA',
  modified_at: new Date(),
  new_email: 'new@email.com',
  new_email_key: '',
  new_email_requested: new Date(),
  new_password: 'abc123',
  new_password_requested: new Date(),
  password: 'password',
  profile_link_1: 'https://website1.com',
  profile_link_2: 'https://website2.com',
  profile_link_3: 'https://website3.com',
  profile_link_twitter: 'https://twitter.com/handler',
  profile_link_website: 'http://mywebsite.com',
  profile_name: 'Awesome Sauce',
  profile_photo: 'http://www.mywebsite.com/img/avatar.jpg',
  username: 'JaneDoe'
}

describe('Domain User', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should be defined', () => {
    assert.isDefined(prepareForAPIOutput)
    assert.isDefined(prepareForElasticSearch)
    assert.isDefined(checkInviteCode)
    assert.isDefined(deleteAccount)
    assert.isDefined(emailAddressInUse)
    assert.isDefined(followUser)
    assert.isDefined(getFollowers)
    assert.isDefined(getFollowing)
    assert.isDefined(unfollowUser)
    assert.isDefined(updateAccount)
    assert.isDefined(usernameInUse)
  })

  describe('prepareForAPIOutput', () => {
    it('prepareForAPIOutput should return correct data', () => {
      var output = prepareForAPIOutput({ _source: userAccount })

      assert.isDefined(output.bio)
      assert.isDefined(output.company_name)
      assert.isDefined(output.email)
      assert.isDefined(output.first_name)
      assert.isDefined(output.hash_id)
      assert.isDefined(output.join_date)
      assert.isDefined(output.last_name)
      assert.isDefined(output.location)
      assert.isDefined(output.profile_link_1)
      assert.isDefined(output.profile_link_2)
      assert.isDefined(output.profile_link_3)
      assert.isDefined(output.profile_link_twitter)
      assert.isDefined(output.profile_link_website)
      assert.isDefined(output.profile_name)
      assert.isDefined(output.profile_photo)
      assert.isDefined(output.username)

      assert.isTrue(output.bio === userAccount.bio)
      assert.isTrue(output.company_name === userAccount.company_name)
      assert.isTrue(output.email === userAccount.email)
      assert.isTrue(output.first_name === userAccount.first_name)
      assert.isTrue(output.hash_id === userAccount.hash_id)
      assert.isTrue(output.join_date === userAccount.join_date)
      assert.isTrue(output.last_name === userAccount.last_name)
      assert.isTrue(output.location === userAccount.location)
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1)
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2)
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3)
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter)
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website)
      assert.isTrue(output.profile_name === userAccount.profile_name)
      assert.isTrue(output.profile_photo === userAccount.profile_photo)
      assert.isTrue(output.username === userAccount.username)

      assert.isUndefined(output.id)
      assert.isUndefined(output.activated)
      assert.isUndefined(output.banned)
      assert.isUndefined(output.banned_reason)
      assert.isUndefined(output.created_at)
      assert.isUndefined(output.modified_at)
      assert.isUndefined(output.new_email)
      assert.isUndefined(output.new_email_key)
      assert.isUndefined(output.new_email_requested)
      assert.isUndefined(output.new_password)
      assert.isUndefined(output.new_password_requested)
      assert.isUndefined(output.password)
    })
  })

  describe('prepareForElasticSearch', () => {
    it('prepareForElasticSearch should return correct data', () => {
      var output = prepareForElasticSearch(userAccount)

      assert.isDefined(output.id)
      assert.isDefined(output.bio)
      assert.isDefined(output.company_name)
      assert.isDefined(output.email)
      assert.isDefined(output.first_name)
      assert.isDefined(output.hash_id)
      assert.isDefined(output.join_date)
      assert.isDefined(output.last_name)
      assert.isDefined(output.location)
      assert.isDefined(output.profile_link_1)
      assert.isDefined(output.profile_link_2)
      assert.isDefined(output.profile_link_3)
      assert.isDefined(output.profile_link_twitter)
      assert.isDefined(output.profile_link_website)
      assert.isDefined(output.profile_name)
      assert.isDefined(output.profile_photo)
      assert.isDefined(output.username)

      assert.isTrue(output.id === userAccount.id)
      assert.isTrue(output.bio === userAccount.bio)
      assert.isTrue(output.company_name === userAccount.company_name)
      assert.isTrue(output.email === userAccount.email)
      assert.isTrue(output.first_name === userAccount.first_name)
      assert.isTrue(output.hash_id === userAccount.hash_id)
      assert.isTrue(output.join_date === userAccount.join_date)
      assert.isTrue(output.last_name === userAccount.last_name)
      assert.isTrue(output.location === userAccount.location)
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1)
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2)
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3)
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter)
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website)
      assert.isTrue(output.profile_name === userAccount.profile_name)
      assert.isTrue(output.profile_photo === userAccount.profile_photo)
      assert.isTrue(output.username === userAccount.username)

      assert.isUndefined(output.activated)
      assert.isUndefined(output.banned)
      assert.isUndefined(output.banned_reason)
      assert.isUndefined(output.created_at)
      assert.isUndefined(output.modified_at)
      assert.isUndefined(output.new_email)
      assert.isUndefined(output.new_email_key)
      assert.isUndefined(output.new_email_requested)
      assert.isUndefined(output.new_password)
      assert.isUndefined(output.new_password_requested)
      assert.isUndefined(output.password)
    })
  })

  describe('checkInviteCode', () => {
    beforeEach(() => {
      this.userInviteStub = this.sandbox.stub(UserInvite, 'findAll')
    })

    it('should return invites', (done) => {
      var fakeKey = hashid.encode(123)
      var fakeResponse = []

      this.userInviteStub.returns(Promise.resolve(fakeResponse))

      checkInviteCode(fakeKey)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should not return invites', (done) => {
      var fakeKey = hashid.encode(123)
      var fakeResponse = null

      this.userInviteStub.returns(Promise.resolve(fakeResponse))

      checkInviteCode(fakeKey)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should throw error', (done) => {
      checkInviteCode(null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Invalid Invitation Code')
          done()
        })
    })
  })

  describe('deleteAccount', (done) => {
    beforeEach(() => {
      this.userFindStub = this.sandbox.stub(User, 'findOne')
    })

    it('should delete user', (done) => {
      var fakeUser = {
        username: 'JaneDoe',
        id: 123
      }

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        destroy: sinon.stub().returns(Promise.resolve({})),
        email: 'jane.doe@email.com',
        username: 'JaneDoe'
      }

      this.userFindStub.returns(Promise.resolve(fakeFoundUser))

      deleteAccount(fakeUser)
        .then((deletedUser) => {
          assert.isTrue(fakeFoundUser.destroy.calledOnce)
          assert.isTrue(fakeFoundUser.set.calledWith('username', '~' + fakeFoundUser.username))
          assert.isTrue(fakeFoundUser.set.calledWith('email', '~' + fakeFoundUser.email))
          assert.isTrue(fakeFoundUser.set.calledWith('password', 'deleted-account'))
          assert.isTrue(fakeFoundUser.set.calledWith('password_oauth', null))
          assert.isTrue(fakeFoundUser.set.calledWith('new_password_key', null))
          assert.isTrue(fakeFoundUser.set.calledWith('new_password_requested', null))
          assert.isTrue(fakeFoundUser.set.calledWith('new_email', null))
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_key', null))
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_requested', null))
          assert.isTrue(fakeFoundUser.set.calledWith('activated', 0))
          done()
        })
    })

    it('should not delete user', (done) => {
      var fakeUser = {
        username: 'JaneDoe',
        id: 123
      }

      this.userFindStub.returns(Promise.resolve(null))

      deleteAccount(fakeUser)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No user found for user ' + fakeUser.username)
          done()
        })
    })

    it('should throw error', (done) => {
      deleteAccount(null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('emailAddressInUse', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
    })

    it('should return a result', (done) => {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return true
        }
      }

      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      }

      this.userStub.returns(Promise.resolve(fakeResponse))

      emailAddressInUse(fakeQuery.emailAddress, fakeQuery.callback)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should error with missing callback', (done) => {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return false
        }
      }

      this.userStub.returns(Promise.resolve(null))

      emailAddressInUse(fakeQuery.emailAddress)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })

    it('should error with missing email', (done) => {
      var fakeQuery = {
        callback: function () {
          return false
        }
      }

      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      }

      this.userStub.returns(Promise.resolve(fakeResponse))

      emailAddressInUse(null, fakeQuery.callback)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })

    it('should not return a result', (done) => {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return false
        }
      }

      this.userStub.returns(Promise.resolve(null))

      emailAddressInUse(fakeQuery.emailAddress, fakeQuery.callback)
        .then((foundUser) => {
          assert.isFalse(foundUser)
          done()
        })
    })

    it('should throw error', (done) => {
      emailAddressInUse()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('followUser', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne')
      this.userFollowCreateStub = this.sandbox.stub(UserFollow, 'create')
    })

    it('should return a result for new follow', (done) => {
      var self = this
      var fakeResponse = {
        dataValues: {
          id: 123,
          username: 'JaneDoe'
        },
        create: sinon.stub(),
        restore: sinon.stub()
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(false))
      this.userFollowCreateStub.returns(Promise.resolve(fakeResponse))

      followUser(321, 'JaneDoe')
        .then((foundUser) => {
          assert.isDefined(foundUser)
          assert.isTrue(self.userFollowCreateStub.calledOnce)
          done()
        })
    })

    it('should return a result for existing follow', (done) => {
      var fakeResponse = {
        dataValues: {
          id: 123,
          username: 'JaneDoe'
        },
        create: sinon.stub(),
        restore: sinon.stub()
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(fakeResponse))
      this.userFollowCreateStub.returns(Promise.resolve(fakeResponse))

      followUser(321, 'JaneDoe')
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should prevent following yourself', (done) => {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(fakeResponse))

      followUser(123, 'JaneDoe')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'You Can\'t follow yourself.')
          done()
        })
    })

    it('should throw error for missing user', (done) => {
      var fakeResponse = null

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(fakeResponse))

      followUser(123, 'JaneDoe')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No user found for user JaneDoe')
          done()
        })
    })

    it('should throw error for invalid request', (done) => {
      followUser()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('getFollowers', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findAll')
    })

    it('should return followers', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeUserResponse = {
        id: 123
      }
      var fakeUserFollowResponse = {}

      this.userStub.returns(Promise.resolve(fakeUserResponse))
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse))

      getFollowers(fakeUsername)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should not return followers', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeUserFollowResponse = {}

      this.userStub.returns(Promise.resolve(null))
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse))

      getFollowers(fakeUsername)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should throw error', (done) => {
      getFollowers(null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('getFollowing', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findAll')
    })

    it('should return followers', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeUserResponse = {
        id: 123
      }
      var fakeUserFollowResponse = {}

      this.userStub.returns(Promise.resolve(fakeUserResponse))
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse))

      getFollowing(fakeUsername)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should not return followers', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeUserFollowResponse = {}

      this.userStub.returns(Promise.resolve(null))
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse))

      getFollowing(fakeUsername)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should throw error', (done) => {
      getFollowing(null)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('unfollowUser', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne')
    })

    it('should return a result for new follow', (done) => {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve())
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(fakeResponse))

      unfollowUser(321, 'JaneDoe')
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          done()
        })
    })

    it('should fail with message saying you cannot unfollow yourself', (done) => {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve())
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(fakeResponse))

      unfollowUser(123, 'JaneDoe')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'You Can\'t follow / unfollow yourself.')
          done()
        })
    })

    it('should fail with notice you are not following user', (done) => {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve())
      }

      this.userStub.returns(Promise.resolve(fakeResponse))
      this.userFollowStub.returns(Promise.resolve(false))

      unfollowUser(321, 'JaneDoe')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'You are not following JaneDoe')
          done()
        })
    })

    it('should fail with notice no user found', (done) => {
      this.userStub.returns(Promise.resolve(null))
      this.userFollowStub.returns(Promise.resolve(false))

      unfollowUser(321, 'JaneDoe')
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No user found for user JaneDoe')
          done()
        })
    })

    it('should throw error for invalid request', (done) => {
      unfollowUser()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('updateAccount', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne')
    })

    it('should update account', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com',
        new_password: 'abc123'
      }
      var fakeResponse = {
        set: sinon.stub()
      }

      this.userStub.returns(Promise.resolve(fakeResponse))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          assert.isTrue(foundUser.set.calledWith('new_email', fakeUserData.new_email))
          assert.isTrue(foundUser.set.calledWith('new_email_key', randomString.generate(12)))
          assert.isTrue(foundUser.set.calledWith('new_email_requested', Date.now()))
          done()
        })
    })

    it('should update account without password', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com'
      }
      var fakeResponse = {
        set: sinon.stub()
      }

      this.userStub.returns(Promise.resolve(fakeResponse))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          done()
        })
    })

    it('should update account using new_username only', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_username: 'JohnDoe'
      }
      var fakeResponse = {}

      this.userStub.returns(Promise.resolve(fakeResponse))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          done()
        })
    })

    it('should update account using new_email only', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_email: 'john.doe@email.com'
      }
      var fakeResponse = {}

      this.userStub.returns(Promise.resolve(fakeResponse))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          done()
        })
    })

    it('should update account using new_password only', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_password: 'abc123'
      }
      var fakeResponse = {}

      this.userStub.returns(Promise.resolve(fakeResponse))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then((foundUser) => {
          assert.isTrue(fakeResponse.destroy.calledOnce)
          done()
        })
    })

    it('should fail with no matching user', (done) => {
      var fakeUserID = 123
      var fakeIpAddress = '97.96.74.114'
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com',
        new_password: 'abc123'
      }

      this.userStub.returns(Promise.resolve(null))

      updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'No matching user found.')
          done()
        })
    })

    it('should fail with no params', (done) => {
      updateAccount()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Request Invalid')
          done()
        })
    })
  })

  describe('usernameInUse', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(User, 'findOne')
    })

    it('should return username is in use', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeCallback = () => {
        return true
      }
      var fakeResponse = {
        id: 123,
        username: fakeUsername
      }

      this.userStub.returns(Promise.resolve(fakeResponse))

      usernameInUse(fakeUsername, fakeCallback)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should return username is not in use', (done) => {
      var fakeUsername = 'JaneDoe'
      var fakeCallback = () => {
        return false
      }
      var fakeResponse = null

      this.userStub.returns(Promise.resolve(fakeResponse))

      usernameInUse(fakeUsername, fakeCallback)
        .then((foundUser) => {
          assert.isDefined(foundUser)
          done()
        })
    })

    it('should return invalid request', (done) => {
      var fakeUsername = 'JaneDoe'

      this.userStub.returns(Promise.resolve(null))

      usernameInUse(fakeUsername)
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Invalid Request')
          done()
        })
    })

    it('should throw error', (done) => {
      usernameInUse()
        .catch((error) => {
          assert.isDefined(error)
          assert.isTrue(error === 'Username Check Request Invalid')
          done()
        })
    })
  })
})
