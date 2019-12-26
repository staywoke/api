import chai from 'chai'
import Sequelize from 'sequelize'

import db from '../../../../app/config/sequelize'

import { UserModel } from '../../../../app/models/api'

const assert = chai.assert
const User = UserModel(db, Sequelize)

describe('Models Users', () => {
  let fakeUser = {}
  const restore = () => {
    fakeUser = {
      id: 1,
      activated: true,
      username: 'JaneDoe',
      password: 'password',
      email: 'jane.doe@email.com',
      first_name: 'Jane',
      last_name: 'Doe',
      company_name: 'My Company',
      profile_name: 'Awesome Sauce',
      profile_photo: 'http://www.mywebsite.com/img/avatar.jpg',
      location: 'Florida, USA',
      profile_link_website: 'http://mywebsite.com',
      profile_link_twitter: 'https://twitter.com/handler',
      banned: false,
      new_email: 'new@email.com',
      new_email_key: '',
      new_email_requested: new Date(),
      new_password: 'abc123',
      new_password_requested: new Date()
    }
  }

  it('should be defined', (done) => {
    assert.isDefined(User)
    done()
  })

  it('publicJSON should be defined', (done) => {
    restore()

    const user = User.build(fakeUser)

    assert.isDefined(user.publicJSON)
    assert.isFunction(user.publicJSON)
    done()
  })

  it('publicJSON should be work', (done) => {
    restore()

    const user = User.build(fakeUser)
    const json = user.publicJSON()

    assert.isDefined(json)
    assert.isUndefined(json.new_email)
    assert.isUndefined(json.new_email_key)
    assert.isUndefined(json.new_email_requested)
    assert.isUndefined(json.new_password)
    assert.isUndefined(json.new_password_requested)
    assert.isUndefined(json.password)
    done()
  })

  it('isActive should be defined', (done) => {
    restore()

    const user = User.build(fakeUser)

    assert.isDefined(user.isActive)
    assert.isFunction(user.isActive)
    done()
  })

  it('isActive should work for valid user', (done) => {
    restore()

    const user = User.build(fakeUser)
    const isActive = user.isActive()

    assert.isDefined(isActive)
    assert.isTrue(isActive)
    done()
  })

  it('isActive should work for banned user', () => {
    restore()

    fakeUser.activated = true
    fakeUser.banned = true

    const user = User.build(fakeUser)
    const isActive = user.isActive()

    assert.isDefined(isActive)
    assert.isFalse(isActive)
  })

  it('isActive should work for inactive user', (done) => {
    restore()

    fakeUser.activated = false
    fakeUser.banned = false

    const user = User.build(fakeUser)
    const isActive = user.isActive()

    assert.isDefined(isActive)
    assert.isFalse(isActive)
    done()
  })

  it('fullName should be defined', (done) => {
    restore()

    const user = User.build(fakeUser)

    assert.isDefined(user.fullName)
    assert.isFunction(user.fullName)
    done()
  })

  it('fullName should work', (done) => {
    restore()

    const user = User.build(fakeUser)
    const fullName = user.fullName()

    assert.isDefined(fullName)
    assert.isTrue(fullName === 'Jane Doe')
    done()
  })

  it('fullName should return empty string if no name', (done) => {
    restore()

    fakeUser.first_name = null
    fakeUser.last_name = null

    const user = User.build(fakeUser)
    const fullName = user.fullName()

    assert.isDefined(fullName)
    assert.isTrue(fullName === '')
    done()
  })
})
