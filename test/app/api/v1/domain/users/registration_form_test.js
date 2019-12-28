const _ = require('lodash')
const chai = require('chai')
const Hashids = require('hashids/cjs')
const Promise = require('bluebird')
const sinon = require('sinon')
const validate = require('validate.js')

const config = require('../../../../../../app/config')

const { UsersRegistrationFormDomain } = require('../../../../../../app/api/v1/domain')

const assert = chai.assert

const hashid = new Hashids(
  config.get('hashID.secret'),
  config.get('hashID.length'),
  config.get('hashID.alphabet')
)

describe('User Registration Form', () => {
  var validData
  var modelFieldValueUniqueStub

  beforeEach(() => {
    this.sandbox = sinon.createSandbox()

    validData = {
      username: 'janedoe',
      password: 't3sT3r',
      email: 'janedoe@website.com',
      inviteCode: hashid.encode(123),
      agree: 'yes'
    }

    modelFieldValueUniqueStub = this.sandbox.stub(validate.validators, 'modelFieldValueUnique').callsFake(() => {
      return validate.Promise.resolve()
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  /**
   * Test a bunch of valid values for a field on a form class
   */
  const validForValues = (FormClass, field, values, cb) => {
    return Promise.map(values, (value) => {
      const data = _.clone(validData)
      data[field] = value

      const form = new FormClass()

      return form.validate(data).then((result) => {
        assert.deepEqual(data, result)
      }).catch((error) => {
        cb(new Error(error))
      })
    }).then(() => {
      cb()
    })
  }

  /**
   * Test a bunch of invalid values for a field on a form class
   */
  const invalidForValues = (FormClass, field, values, cb) => {
    return Promise.map(values, (value) => {
      const data = _.clone(validData)
      data[field] = value

      const form = new FormClass()

      return form.validate(data).then(() => {
        cb(new Error('Form validated when it should not have'))
      }).catch((errors) => {
        assert.isTrue(field in errors)
        assert.lengthOf(errors[field], 1)
      })
    }).then(() => {
      cb()
    })
  }

  it('should validate for correct basic set of data', (done) => {
    const form = new UsersRegistrationFormDomain()

    form.validate(validData).then((data) => {
      assert.deepEqual(data, validData)
      done()
    }).catch(() => {
      done(new Error('Form invalid when it should be valid'))
    })
  })

  describe('username', () => {
    it('should be required', (done) => {
      const form = new UsersRegistrationFormDomain()
      delete validData.username

      form.validate(validData).catch((errors) => {
        assert.lengthOf(Object.keys(errors), 1)
        assert.isTrue('username' in errors)
        done()
      })
    })

    it('should fail for invalid values', (done) => {
      const invalidUsernames = [
        null,
        '',
        'hi', // Too short
        'hi there', // No spaces
        '$&!@', // Insane characters
        'velociraptor!', // No exclamation points
        't.rex', // No periods
        'steg/osaurs', // No slashes
        'dinodinodinodinodinodinodinodin' // 1 character too long
      ]

      invalidForValues(UsersRegistrationFormDomain, 'username', invalidUsernames, done)

      done()
    })

    it('should validate for valid values', (done) => {
      const validUsernames = [
        'ian',
        'dinodinodinodinodinodinodinodi', // 30 characters
        'ian_malcolm'
      ]

      validForValues(UsersRegistrationFormDomain, 'username', validUsernames, done)
    })

    it('should be unique', (done) => {
      const form = new UsersRegistrationFormDomain()

      modelFieldValueUniqueStub.restore()
      modelFieldValueUniqueStub = sinon
        .stub(validate.validators, 'modelFieldValueUnique')
        .onCall(0)
        .returns(Promise.resolve('some error'))
        .onCall(1)
        .returns(Promise.resolve()) // Fake resolution for email check

      form.validate(validData).then((data) => {
        assert.deepEqual(data, validData)
        done()
      }).catch((errors) => {
        assert.lengthOf(Object.keys(errors), 1)
        assert.isTrue('username' in errors)
        assert.lengthOf(errors.username, 1)
        done()
      })
    })
  })

  describe('password', () => {
    it('should be required', (done) => {
      const form = new UsersRegistrationFormDomain()
      delete validData.password

      form.validate(validData).then((data) => {
        done(new Error('Form validated when it shoud not have'))
      }).catch((errors) => {
        assert.lengthOf(Object.keys(errors), 1)
        assert.isTrue('password' in errors)
        done()
      })
    })

    it('should fail for invalid values', (done) => {
      const invalidPasswords = [
        null,
        '',
        'yo' // Too short
      ]

      invalidForValues(UsersRegistrationFormDomain, 'password', invalidPasswords, done)
    })

    it('should pass for valid values', (done) => {
      const validPasswords = [
        'heyyou',
        'chaoschaoschaoschaoschaoschaos',
        '1jfi94@# %#josl',
        'fjoa_-)(12309'
      ]

      validForValues(UsersRegistrationFormDomain, 'password', validPasswords, done)
    })
  })

  describe('email', () => {
    it('should fail for invalid values', (done) => {
      const invalidEmails = [
        'hi',
        'foo@',
        'foo@gmail',
        'foo@gmailcom'
      ]

      invalidForValues(UsersRegistrationFormDomain, 'email', invalidEmails, done)
    })

    it('should pass for valid values', (done) => {
      const validEmails = [
        'foo@gmail.com',
        'hi@doing.co'
      ]

      validForValues(UsersRegistrationFormDomain, 'email', validEmails, done)
    })

    it('should be unique', (done) => {
      const form = new UsersRegistrationFormDomain()

      modelFieldValueUniqueStub.restore()
      modelFieldValueUniqueStub = sinon
        .stub(validate.validators, 'modelFieldValueUnique')
        .onCall(0)
        .returns(Promise.resolve()) // Fake resolution for username check
        .onCall(1)
        .returns(Promise.resolve('some error'))

      form.validate(validData).then((data) => {
        assert.deepEqual(data, validData)
        done()
      }).catch((errors) => {
        assert.lengthOf(Object.keys(errors), 1)
        assert.isTrue('email' in errors)
        assert.lengthOf(errors.email, 1)
        done()
      })
    })
  })

  describe('first_name', () => {
    it('should be optional', (done) => {
      const form = new UsersRegistrationFormDomain()
      delete validData.first_name

      form.validate(validData).then((data) => {
        assert.deepEqual(validData, data)
        done()
      })
    })
  })

  describe('last_name', () => {
    it('should be optional', (done) => {
      const form = new UsersRegistrationFormDomain()
      delete validData.last_name

      form.validate(validData).then((data) => {
        assert.deepEqual(validData, data)
        done()
      })
    })
  })
})
