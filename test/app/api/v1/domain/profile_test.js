const chai = require('chai')
const Sequelize = require('sequelize')
const sinon = require('sinon')

const db = require('../../../../../app/config/sequelize')

const { ProfileDomain } = require('../../../../../app/api/v1/domain')
const { UserActivityModel } = require('../../../../../app/models/api')

const assert = chai.assert

const UserActivity = UserActivityModel(db, Sequelize)

describe('Domain Profile', () => {
  let activityFindStub
  let notificationFindStub
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should be defined', () => {
    assert.isDefined(ProfileDomain)
  })

  it('getActivity should be defined', () => {
    assert.isDefined(ProfileDomain.getActivity)
  })

  it('getNotifications should be defined', () => {
    assert.isDefined(ProfileDomain.getNotifications)
  })

  describe('getActivity', () => {
    beforeEach(() => {
      activityFindStub = sandbox.stub(UserActivity, 'findAll')
    })

    it('should return activity', (done) => {
      const fakeUserID = 123
      const fakeActivity = {
        set: sinon.stub(),
        save: sinon.stub(),
        activity: [
          {
            id: 1,
            user_id: 123,
            follow_user_id: 12,
            type: 'followed_user'
          },
          {
            id: 1,
            user_id: 123,
            follow_user_id: null,
            type: 'login'
          }
        ]
      }

      activityFindStub.returns(Promise.resolve(fakeActivity))

      ProfileDomain.getActivity(fakeUserID).then((foundUser) => {
        assert.isDefined(foundUser)
        done()
      })
    })

    it('should fail with no userID', (done) => {
      const fakeUserID = 123

      activityFindStub.returns(Promise.reject('No activity found for user ' + fakeUserID))

      ProfileDomain.getActivity(fakeUserID).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })

    it('should not return activity', (done) => {
      const fakeUserID = 123

      activityFindStub.returns(Promise.resolve(null))

      ProfileDomain.getActivity(fakeUserID).catch((error) => {
        assert.isDefined(error)
        done()
      })
    })
  })

  describe('getNotifications', () => {
    beforeEach(() => {
      notificationFindStub = sandbox.stub(UserActivity, 'findAll')
    })

    it('should return notifications', (done) => {
      const fakeUserID = 123

      notificationFindStub.returns(Promise.resolve(fakeUserID))

      ProfileDomain.getNotifications(fakeUserID).then((response) => {
        assert.isDefined(response)
        assert.isTrue(response === fakeUserID)
        done()
      })
    })
  })
})
