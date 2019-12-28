const _ = require('lodash')
const chai = require('chai')
const Hashids = require('hashids/cjs')
const Promise = require('bluebird')
const randomString = require('randomstring')
const rewire = require('rewire')
const Sequelize = require('sequelize')
const sinon = require('sinon')

const config = require('../../../../../../app/config')
const db = require('../../../../../../app/config/sequelize')

const { UserModel } = require('../../../../../../app/models/api')
const { UsersRegistrationFormDomain } = require('../../../../../../app/api/v1/domain')

const assert = chai.assert

const hashid = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)
const registration = rewire('../../../../../app/api/v1/domain/users/registration')
const User = UserModel(db, Sequelize)

describe('User Registration', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('register', () => {
    it('should create a user for valid submission', (done) => {
      const fakeData = {
        username: 'stevenhiller'
      }

      const fakeCreatedData = {
        username: 'stevenhiller',
        activated: false
      }

      const validateStub = this.sandbox.stub(UsersRegistrationFormDomain.prototype, 'validate').callsFake(() => {
        return Promise.resolve(fakeData)
      })

      const createUserStub = this.sandbox.stub(registration, 'createUser').callsFake(() => {
        return Promise.resolve(fakeCreatedData)
      })

      const restore = registration.__set__({
        UsersRegistrationFormDomain: UsersRegistrationFormDomain
      })

      registration.register(fakeData).then((createdUser) => {
        assert.isTrue(validateStub.calledOnce)
        assert.isTrue(validateStub.calledWith(fakeData))
        assert.isTrue(createUserStub.calledOnce)
        assert.deepEqual(createdUser, fakeCreatedData)
        done()
      })

      restore()
    })

    it('should not create a user for invalid data', (done) => {
      const fakeData = {
        username: 'presidenttom'
      }

      const fakeErrors = {
        username: ['Invalid username']
      }

      const validateStub = this.sandbox.stub(UsersRegistrationFormDomain.prototype, 'validate').callsFake(() => {
        return Promise.reject(fakeErrors)
      })

      const createUserStub = this.sandbox.stub(registration, 'createUser')

      const restore = registration.__set__({
        UsersRegistrationFormDomain: UsersRegistrationFormDomain
      })

      registration.register(fakeData).catch((errors) => {
        assert.isTrue(validateStub.calledOnce)
        assert.isTrue(validateStub.calledWith(fakeData))
        assert.isFalse(createUserStub.called)
        assert.deepEqual(errors, fakeErrors)
        done()
      })

      restore()
    })
  })

  describe('createUser', () => {
    var restoreEmail
    var emailStub = {
      sendUserConfirmationEmail: sinon.stub()
    }

    beforeEach(() => {
      restoreEmail = registration.__set__('email', emailStub)
    })

    afterEach(() => {
      restoreEmail()
    })

    it('should encode password and insert an active user into the database', (done) => {
      var fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes',
        id: 123
      }

      var encoded = 'alsfkj129847'
      var hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded))
      var userCreateStub = this.sandbox.stub(User, 'create').returns(Promise.resolve(fakeData))

      var restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: User
      })

      registration.createUser(fakeData).then((createdUser) => {
        assert.isTrue(hashGenerateStub.calledOnce)
        assert.isTrue(hashGenerateStub.calledWith(fakeData.password))
        assert.isTrue(userCreateStub.calledOnce)

        var createData = userCreateStub.getCall(0).args[0]

        assert.equal(createData.username, fakeData.username)
        assert.equal(createData.password, encoded)
        assert.equal(createData.activated, false)

        assert.isTrue('new_email_key' in createData)
        assert.isTrue(emailStub.sendUserConfirmationEmail.called)

        restore()
        done()
      })
    })

    it('should create an email key and make user inactive with an email present', (done) => {
      var fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes'
      }

      var encoded = 'alsfkj129847'
      var hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded))
      var userCreateStub = this.sandbox.stub(User, 'create').callsFake((data) => {
        return Promise.resolve(data)
      })

      var restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: User
      })

      registration
        .createUser(fakeData)
        .then((createdUser) => {
          assert.isTrue(hashGenerateStub.calledOnce)
          assert.isTrue(hashGenerateStub.calledWith(fakeData.password))
          assert.isTrue(userCreateStub.calledOnce)

          var createData = userCreateStub.getCall(0).args[0]

          assert.equal(createData.username, fakeData.username)
          assert.equal(createData.password, encoded)
          assert.isDefined(createData.new_email_key)
          assert.equal(createData.activated, false)

          done()
        })

      restore()
    })
  })

  describe('confirm', () => {
    beforeEach(() => {
      this.userFindStub = this.sandbox.stub(User, 'findOne')
    })

    it('should activate a user matching the activation key passed in', (done) => {
      var self = this
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH)
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userFindStub.returns(Promise.resolve(fakeFoundUser))

      var expectedFindOneArgs = {
        where: {
          new_email_key: fakeKey
        }
      }

      registration
        .confirmAccount(fakeKey)
        .then((foundUser) => {
          assert.isTrue(self.userFindStub.calledOnce)
          assert.isTrue(self.userFindStub.calledWith(expectedFindOneArgs))

          // Check that user was activated and email key was wiped

          assert.isTrue(fakeFoundUser.set.calledWith('activated', true))
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_key', null))

          assert.isTrue(fakeFoundUser.save.calledOnce)

          done()
        })
    })

    it('should fail when activation key not found', (done) => {
      var self = this
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH)
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userFindStub.returns(Promise.reject(new Error('Activation key not found')))

      var expectedFindOneArgs = {
        where: {
          new_email_key: fakeKey
        }
      }

      registration
        .confirmAccount(fakeKey)
        .catch((error) => {
          assert.isTrue(self.userFindStub.calledOnce)
          assert.isTrue(self.userFindStub.calledWith(expectedFindOneArgs))
          assert.isFalse(fakeFoundUser.set.called)
          assert.isFalse(fakeFoundUser.save.called)
          assert.instanceOf(error, Error)

          done()
        })
    })

    it('should fail with an empty key', (done) => {
      var self = this
      var fakeKey = ''
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      registration
        .confirmAccount(fakeKey)
        .catch((error) => {
          assert.isTrue(_.isString(error))
          assert.isFalse(self.userFindStub.called)
          assert.isFalse(fakeFoundUser.set.called)
          assert.isFalse(fakeFoundUser.save.called)

          done()
        })
    })

    it('should fail with a key of the wrong length', (done) => {
      var self = this
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH - 1)
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      registration
        .confirmAccount(fakeKey)
        .catch((error) => {
          assert.isTrue(_.isString(error))
          assert.isFalse(self.userFindStub.called)
          assert.isFalse(fakeFoundUser.set.called)
          assert.isFalse(fakeFoundUser.save.called)
          done()
        })
    })
  })
})
