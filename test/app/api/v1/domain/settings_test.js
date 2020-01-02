const chai = require('chai')
const sinon = require('sinon')

const { SettingsDomain } = require('../../../../../app/api/v1/domain')
const models = require('../../../../../app/models')

const assert = chai.assert

describe('Domain Settings', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should be defined', () => {
    assert.isDefined(SettingsDomain)
  })

  it('getSettings should be defined', () => {
    assert.isDefined(SettingsDomain.getSettings)
  })

  it('updateUserProfile should be defined', () => {
    assert.isDefined(SettingsDomain.updateUserProfile)
  })

  it('updateSocialLinks should be defined', () => {
    assert.isDefined(SettingsDomain.updateSocialLinks)
  })

  it('updateEmailNotifications should be defined', () => {
    assert.isDefined(SettingsDomain.updateEmailNotifications)
  })

  it('updateWebNotifications should be defined', () => {
    assert.isDefined(SettingsDomain.updateWebNotifications)
  })

  describe('getSettings', () => {
    beforeEach(() => {
      this.settingsStub = this.sandbox.stub(models.user_settings_notifications, 'findOne')
    })

    it('should return settings', (done) => {
      const fakeUserId = 123

      const fakeResults = {
        notifications: {
          email_comment_left: true,
          email_comment_liked: true,
          email_mentioned_in_comment: true,
          email_someone_follows: true,
          newsletter: true,
          web_comment_left: true,
          web_comment_liked: true,
          web_mentioned_in_comment: true,
          web_someone_follows: true
        }
      }

      this.settingsStub.returns(Promise.resolve(fakeResults))

      SettingsDomain.getSettings(fakeUserId).then((response) => {
        assert.isDefined(response)
        done()
      })
    })

    it('should not return settings', (done) => {
      const fakeUserId = 123

      this.settingsStub.returns(Promise.resolve(null))

      SettingsDomain.getSettings(fakeUserId).then((response) => {
        assert.isUndefined(response)
        done()
      })
    })
  })

  describe('updateUserProfile', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(models.users, 'findOne')
    })

    it('should update profile', (done) => {
      const self = this

      const fakeUserData = {
        id: 123,
        profile_name: 'Awesome Sauce',
        location: 'Florida, USA',
        company_name: 'My Company',
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Woo Hoo',
        profile_photo: 'http://website.com/img/avatar.jpg'
      }

      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userStub.returns(Promise.resolve(fakeFoundUser))

      SettingsDomain.updateUserProfile(fakeUserData).then(() => {
        assert.isTrue(self.userStub.calledOnce)

        assert.isTrue(fakeFoundUser.set.calledWith('profile_name', fakeUserData.profile_name))
        assert.isTrue(fakeFoundUser.set.calledWith('location', fakeUserData.location))
        assert.isTrue(fakeFoundUser.set.calledWith('company_name', fakeUserData.company_name))
        assert.isTrue(fakeFoundUser.set.calledWith('first_name', fakeUserData.first_name))
        assert.isTrue(fakeFoundUser.set.calledWith('last_name', fakeUserData.last_name))
        assert.isTrue(fakeFoundUser.set.calledWith('bio', fakeUserData.bio))
        assert.isTrue(fakeFoundUser.set.calledWith('profile_photo', fakeUserData.profile_photo))

        assert.isTrue(fakeFoundUser.save.calledOnce)

        done()
      })
    })

    it('should not find a match', (done) => {
      const fakeUserData = {
        id: 123,
        profile_name: 'Awesome Sauce',
        location: 'Florida, USA',
        company_name: 'My Company',
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Woo Hoo',
        profile_photo: 'http://website.com/img/avatar.jpg'
      }

      this.userStub.returns(Promise.resolve(null))

      SettingsDomain.updateUserProfile(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })

    it('should not update profile', (done) => {
      const fakeUserData = null

      this.userStub.returns(Promise.reject('Request Invalid'))

      SettingsDomain.updateUserProfile(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })
  })

  describe('updateSocialLinks', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(models.users, 'findOne')
    })

    it('should update social links', (done) => {
      const self = this

      const fakeUserData = {
        id: 123,
        profile_link_website: 'http://mywebsite.com',
        profile_link_twitter: 'https://twitter.com/handler',
        profile_link_1: 'http://mywebsite1.com',
        profile_link_2: 'http://mywebsite2.com',
        profile_link_3: 'http://mywebsite3.com'
      }

      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userStub.returns(Promise.resolve(fakeFoundUser))

      SettingsDomain.updateSocialLinks(fakeUserData).then(() => {
        assert.isTrue(self.userStub.calledOnce)

        assert.isTrue(fakeFoundUser.set.calledWith('profile_link_website', fakeUserData.profile_link_website))
        assert.isTrue(fakeFoundUser.set.calledWith('profile_link_twitter', fakeUserData.profile_link_twitter))
        assert.isTrue(fakeFoundUser.set.calledWith('profile_link_1', fakeUserData.profile_link_1))
        assert.isTrue(fakeFoundUser.set.calledWith('profile_link_2', fakeUserData.profile_link_2))
        assert.isTrue(fakeFoundUser.set.calledWith('profile_link_3', fakeUserData.profile_link_3))

        assert.isTrue(fakeFoundUser.save.calledOnce)

        done()
      })
    })

    it('should not find a match', (done) => {
      const fakeUserData = {
        id: 123,
        profile_link_website: 'http://mywebsite.com',
        profile_link_twitter: 'https://twitter.com/handler',
        profile_link_1: 'http://mywebsite1.com',
        profile_link_2: 'http://mywebsite2.com',
        profile_link_3: 'http://mywebsite3.com'
      }

      this.userStub.returns(Promise.resolve(null))

      SettingsDomain.updateSocialLinks(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })

    it('should not update profile', (done) => {
      const fakeUserData = null

      this.userStub.returns(Promise.reject('Request Invalid'))

      SettingsDomain.updateSocialLinks(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })
  })

  describe('updateEmailNotifications', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(models.user_settings_notifications, 'findOne')
    })

    it('should update email notifications', (done) => {
      const self = this

      const fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      }

      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        create: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userStub.returns(Promise.resolve(fakeFoundUser))

      SettingsDomain.updateEmailNotifications(fakeUserData).then(() => {
        assert.isTrue(self.userStub.calledOnce)

        assert.isTrue(fakeFoundUser.set.calledWith('email_comment_left', fakeUserData.email_comment_left))
        assert.isTrue(fakeFoundUser.set.calledWith('email_comment_liked', fakeUserData.email_comment_liked))
        assert.isTrue(fakeFoundUser.set.calledWith('email_someone_follows', fakeUserData.email_someone_follows))
        assert.isTrue(fakeFoundUser.set.calledWith('email_mentioned_in_comment', fakeUserData.email_mentioned_in_comment))

        assert.isTrue(fakeFoundUser.save.calledOnce)

        done()
      })
    })

    it('should create email notifications', (done) => {
      const self = this

      this.createStub = this.sandbox.stub(models.user_settings_notifications, 'create')

      const fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      }

      this.userStub.returns(Promise.resolve(null))
      this.createStub.returns(Promise.resolve(fakeUserData))

      SettingsDomain.updateEmailNotifications(fakeUserData).then(() => {
        assert.isTrue(self.createStub.calledOnce)
        done()
      })
    })

    it('should not find a match', (done) => {
      const fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      }

      this.userStub.returns(Promise.resolve(null))

      SettingsDomain.updateEmailNotifications(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })

    it('should not update email notifications', (done) => {
      const fakeUserData = null

      this.userStub.returns(Promise.reject('Request Invalid'))

      SettingsDomain.updateEmailNotifications(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })
  })

  describe('updateWebNotifications', () => {
    beforeEach(() => {
      this.userStub = this.sandbox.stub(models.user_settings_notifications, 'findOne')
    })

    it('should update web notifications', (done) => {
      const self = this

      const fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      }

      const fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        create: sinon.stub(),
        new_email_requested: new Date().getTime()
      }

      this.userStub.returns(Promise.resolve(fakeFoundUser))

      SettingsDomain.updateWebNotifications(fakeUserData).then(() => {
        assert.isTrue(self.userStub.calledOnce)

        assert.isTrue(fakeFoundUser.set.calledWith('web_comment_left', fakeUserData.web_comment_left))
        assert.isTrue(fakeFoundUser.set.calledWith('web_comment_liked', fakeUserData.web_comment_liked))
        assert.isTrue(fakeFoundUser.set.calledWith('web_someone_follows', fakeUserData.web_someone_follows))
        assert.isTrue(fakeFoundUser.set.calledWith('web_mentioned_in_comment', fakeUserData.web_mentioned_in_comment))

        assert.isTrue(fakeFoundUser.save.calledOnce)

        done()
      })
    })

    it('should create web notifications', (done) => {
      const self = this

      this.createStub = this.sandbox.stub(models.user_settings_notifications, 'create')

      const fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      }

      this.userStub.returns(Promise.resolve(null))
      this.createStub.returns(Promise.resolve(fakeUserData))

      SettingsDomain.updateWebNotifications(fakeUserData).then(() => {
        assert.isTrue(self.createStub.calledOnce)
        done()
      })
    })

    it('should not find a match', (done) => {
      const fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      }

      this.userStub.returns(Promise.resolve(null))

      SettingsDomain.updateWebNotifications(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })

    it('should not update web notifications', (done) => {
      const fakeUserData = null

      this.userStub.returns(Promise.reject('Request Invalid'))

      SettingsDomain.updateWebNotifications(fakeUserData).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })
  })
})
