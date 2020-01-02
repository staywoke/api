const _ = require('lodash')
const chai = require('chai')
const Hashids = require('hashids/cjs')
const Promise = require('bluebird')
const randomString = require('randomstring')
const rewire = require('rewire')
const sinon = require('sinon')

const config = require('../../../../../../app/config')

const models = require('../../../../../../app/models')
const { UsersRegistrationFormDomain } = require('../../../../../../app/api/v1/domain')

const assert = chai.assert

const hashid = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)
const registration = rewire('../../../../../../app/api/v1/domain/users/registration')

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
    let restoreEmail
    const emailStub = {
      sendUserConfirmationEmail: sinon.stub()
    }

    beforeEach(() => {
      restoreEmail = registration.__set__('email', emailStub)
    })

    afterEach(() => {
      restoreEmail()
    })

    it('should encode password and insert an active user into the database', (done) => {
      const fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes',
        id: 123
      }

      const encoded = 'alsfkj129847'
      const hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded))
      const userCreateStub = this.sandbox.stub(models.users, 'create').returns(Promise.resolve(fakeData))
      const userInviteCreateStub = this.sandbox.stub(models.user_invite, 'create').returns(Promise.resolve({}))

      const restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: models.users
      })

      registration.createUser(fakeData).then((createdUser) => {
        assert.isTrue(hashGenerateStub.calledOnce)
        assert.isTrue(hashGenerateStub.calledWith(fakeData.password))
        assert.isTrue(userCreateStub.calledOnce)
        assert.isTrue(userInviteCreateStub.calledOnce)

        const createData = userCreateStub.getCall(0).args[0]

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
      const fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes'
      }

      const encoded = 'alsfkj129847'
      const hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded))
      const userCreateStub = this.sandbox.stub(models.users, 'create').callsFake((data) => {
        return Promise.resolve(data)
      })

      const restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: models.users
      })

      registration
        .createUser(fakeData)
        .then((createdUser) => {
          assert.isTrue(hashGenerateStub.calledOnce)
          assert.isTrue(hashGenerateStub.calledWith(fakeData.password))
          assert.isTrue(userCreateStub.calledOnce)

          const createData = userCreateStub.getCall(0).args[0]

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
      this.userFindStub = this.sandbox.stub(models.users, 'findOne')
    })

    it('should activate a user matching the activation key passed in', (done) => {
      const self = this
      const fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH)
      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userFindStub.returns(Promise.resolve(fakeFoundUser))

      const expectedFindOneArgs = {
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
      const self = this
      const fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH)
      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userFindStub.returns(Promise.reject(new Error('Activation key not found')))

      const expectedFindOneArgs = {
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
      const self = this
      const fakeKey = ''
      const fakeFoundUser = {
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
      const self = this
      const fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH - 1)
      const fakeFoundUser = {
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
