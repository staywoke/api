import Promise from 'bluebird'
import rewire from 'rewire'
import sinon from 'sinon'

import chai from 'chai'

const assert = chai.assert

const LocalAuthStrategy = rewire('../../../../../app/api/v1/domain/users/local_auth_strategy')

describe('LocalAuthStrategy Tests', () => {
  let authRewire
  let User
  let fakeUser
  let hasher

  const requestBody = {
    username: 'kyloren',
    password: 'thedarkside'
  }

  const findOneArgs = {
    where: {
      username: requestBody.username
    }
  }

  beforeEach(() => {
    fakeUser = {
      isActive: sinon.stub().returns(false),
      password: 'encryptedPassword'
    }

    User = {
      findOne: sinon.stub()
    }

    hasher = {
      verify: sinon.stub()
    }

    fakeUser.isActive.returns(true)
    User.findOne.returns(Promise.resolve(fakeUser))
    hasher.verify.returns(Promise.resolve(true))

    // Rewire User model
    authRewire = LocalAuthStrategy.__set__({
      User: User,
      hasher: hasher
    })
  })

  afterEach(() => {
    authRewire()
  })

  it('should pass for a valid username and password', (done) => {
    chai.passport
      .use(LocalAuthStrategy)
      .success(() => {
        assert.isTrue(User.findOne.calledOnce)
        assert.isTrue(User.findOne.calledWith(findOneArgs))
        assert.isTrue(fakeUser.isActive.calledOnce)
        assert.isTrue(hasher.verify.calledOnce)
        assert.isTrue(hasher.verify.calledWith(requestBody.password, fakeUser.password))
        done()
      })
      .req((request) => {
        request.body = requestBody
      })
      .authenticate()
  })

  it('should fail for an invalid password', (done) => {
    hasher.verify.returns(Promise.resolve(false))

    chai.passport
      .use(LocalAuthStrategy)
      .error(() => {
        assert.isTrue(User.findOne.calledOnce)
        assert.isTrue(User.findOne.calledWith(findOneArgs))
        assert.isTrue(fakeUser.isActive.calledOnce)
        assert.isTrue(hasher.verify.calledOnce)
        assert.isTrue(hasher.verify.calledWith(requestBody.password, fakeUser.password))
        done()
      })
      .req((request) => {
        request.body = requestBody
      })
      .authenticate()
  })

  it('should fail for user not found', (done) => {
    User.findOne.returns(Promise.reject(new Error('User not found!')))

    chai.passport
      .use(LocalAuthStrategy)
      .error((err) => {
        assert.instanceOf(err, Error)
        assert.isTrue(User.findOne.calledOnce)
        assert.isTrue(User.findOne.calledWith(findOneArgs))
        assert.isFalse(fakeUser.isActive.called)
        assert.isFalse(hasher.verify.called)
        done()
      })
      .req((request) => {
        request.body = requestBody
      })
      .authenticate()
  })

  it('should fail for an inactive user', (done) => {
    fakeUser.isActive.returns(false)

    chai.passport
      .use(LocalAuthStrategy)
      .error((err) => {
        assert.instanceOf(err, Error)
        assert.isTrue(User.findOne.calledOnce)
        assert.isTrue(User.findOne.calledWith(findOneArgs))
        assert.isTrue(fakeUser.isActive.calledOnce)
        assert.isFalse(hasher.verify.called)
        done()
      })
      .req((request) => {
        request.body = requestBody
      })
      .authenticate()
  })

  it('should fail for a database error', (done) => {
    User.findOne.returns(Promise.reject(new Error('Database error!')))

    chai.passport
      .use(LocalAuthStrategy)
      .error((err) => {
        assert.instanceOf(err, Error)
        assert.isTrue(User.findOne.calledOnce)
        assert.isTrue(User.findOne.calledWith(findOneArgs))
        assert.isFalse(fakeUser.isActive.called)
        assert.isFalse(hasher.verify.called)
        done()
      })
      .req((request) => {
        request.body = requestBody
      })
      .authenticate()
  })
})
