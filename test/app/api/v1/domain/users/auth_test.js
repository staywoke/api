import chai from 'chai'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Sequelize from 'sequelize'
import sinon from 'sinon'

import db from '../../../../../../app/config/sequelize'
import config from '../../../../../../app/config'

import { UserModel } from '../../../../../../app/models/api'
import { UsersAuthDomain } from '../../../../../../app/api/v1/domain'

const assert = chai.assert

const User = UserModel(db, Sequelize)

describe('User Auth Tests', () => {
  describe('createUserToken', () => {
    it('should return a valid JWT web token containing the passed in users id', () => {
      const id = 456
      const user = User.build({
        id: id
      })

      const token = UsersAuthDomain.createUserToken(user)
      let decoded

      assert.doesNotThrow(() => { decoded = jwt.verify(token, config.get('secret')) })
      const expiration = moment(decoded.exp * 1000) // Convert expiration (in seconds) to milliseconds

      assert.equal(decoded.userId, id)
      assert.closeTo(moment().diff(expiration, 'days'), -1 * UsersAuthDomain.TOKEN_EXPIRATION_DAYS, 1)
    })

    it('should accept a user id as an argument', () => {
      const userId = 5
      const token = UsersAuthDomain.createUserToken(userId)
      let decoded

      assert.doesNotThrow(() => { decoded = jwt.verify(token, config.get('secret')) })
      assert.equal(decoded.userId, userId)
    })

    it('should accept a user id string as an argument', () => {
      const userId = '17'
      const token = UsersAuthDomain.createUserToken(userId)
      let decoded

      assert.doesNotThrow(() => { decoded = jwt.verify(token, config.get('secret')) })
      assert.equal(decoded.userId, userId)
    })
  })

  describe('verifyToken', () => {
    it('should verify a token', () => {
      const id = 784
      const validToken = jwt.sign({ userId: id }, config.get('secret'), { expiresIn: '1d' })
      const verified = UsersAuthDomain.verifyToken(validToken)

      assert.isObject(verified)
      assert.equal(verified.userId, id)
    })

    it('should return false for an expired token', () => {
      const id = 487
      const expiredToken = jwt.sign({ userId: id }, config.get('secret'), { expiresIn: -5 })

      assert.isFalse(UsersAuthDomain.verifyToken(expiredToken))
    })

    it('should return false for an invalid token', () => {
      const invalidToken = 'flerp'

      assert.isFalse(UsersAuthDomain.verifyToken(invalidToken))
    })
  })

  describe('refreshToken', () => {
    beforeEach(() => {
      this.sandbox = sinon.createSandbox()
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    it('should update the expiration date of a valid JWT token', () => {
      const fakeToken = 'abc123'
      const id = 1472
      const verifyTokenStub = this.sandbox.stub(UsersAuthDomain, 'verifyToken').returns({ userId: id })
      const createUserTokenStub = this.sandbox.stub(UsersAuthDomain, 'createUserToken').returns(fakeToken)

      assert.isTrue(verifyTokenStub.calledOnce)
      assert.isTrue(verifyTokenStub.calledWith(fakeToken))
      assert.isTrue(createUserTokenStub.calledOnce)
      assert.isTrue(createUserTokenStub.calledWith(id))
    })

    it('should return false for an invalid token', () => {
      const fakeToken = 'jkjh987'
      const verifyTokenStub = this.sandbox.stub(UsersAuthDomain, 'verifyToken').returns(false)
      const createUserTokenStub = this.sandbox.stub(UsersAuthDomain, 'createUserToken')
      const refreshedToken = UsersAuthDomain.refreshToken(fakeToken)

      assert.isFalse(refreshedToken)
      assert.isTrue(verifyTokenStub.calledOnce)
      assert.isTrue(verifyTokenStub.calledWith(fakeToken))
      assert.isFalse(createUserTokenStub.called)
    })
  })
})
