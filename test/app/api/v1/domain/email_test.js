const chai = require('chai')
const sinon = require('sinon')

const { EmailDomain } = require('../../../../../app/api/v1/domain')

const assert = chai.assert

describe('Email Domain Service Tests', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getClient', () => {
    it('should exist', (done) => {
      assert.isFunction(EmailDomain.getClient)
      done()
    })
  })

  describe('getBaseURL', () => {
    it('should exist', (done) => {
      assert.isFunction(EmailDomain.getBaseURL)
      done()
    })

    it('should return base correct local URL', (done) => {
      const url = EmailDomain.getBaseURL()
      assert.isDefined(url)
      assert.isTrue(url === 'http://127.0.0.1:5050')
      done()
    })
  })

  describe('sendUserEmail', () => {
    it('should exist', (done) => {
      assert.isFunction(EmailDomain.sendUserEmail)
      done()
    })
  })

  describe('sendUserConfirmationEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'stuff'
      }

      EmailDomain.sendUserConfirmationEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('registration-confirmation', fakeUser))
      done()
    })
  })

  describe('sendUserForgotPasswordEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'some_user'
      }

      EmailDomain.sendUserForgotPasswordEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('forgot-password', fakeUser))
      done()
    })
  })

  describe('sendUserPasswordResetEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'some_user'
      }

      EmailDomain.sendUserPasswordResetEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('password-reset', fakeUser))
      done()
    })
  })

  describe('sendChangedUsernameEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'some_user'
      }

      EmailDomain.sendChangedUsernameEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('change-username-notice', fakeUser))
      done()
    })
  })

  describe('sendConfirmChangedEmailAddressEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'some_user'
      }

      EmailDomain.sendConfirmChangedEmailAddressEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('change-email-confirmation', fakeUser))
      done()
    })
  })

  describe('sendConfirmChangedPasswordEmail', () => {
    it('should call sendUserEmail with the correct template slug and the passed in user', (done) => {
      const sendUserEmailStub = this.sandbox.stub(EmailDomain, 'sendUserEmail')
      const fakeUser = {
        username: 'some_user'
      }

      EmailDomain.sendConfirmChangedPasswordEmail(fakeUser)

      assert.isTrue(sendUserEmailStub.calledOnce)
      assert.isTrue(sendUserEmailStub.calledWith('change-password-confirmation', fakeUser))
      done()
    })
  })
})
