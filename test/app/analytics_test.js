import chai from 'chai'

import analytics from '../../app/analytics'

const assert = chai.assert

describe('Analytics', () => {
  it('should be defined', (done) => {
    assert.isDefined(analytics)
    assert.isFunction(analytics.trackEvent)
    done()
  })

  describe('Call Functions', () => {
    it('should return defined with strings', (done) => {
      assert.isDefined(analytics.trackEvent('abc123', 'category', 'action', 'label', 'value'))
      done()
    })

    it('should return defined with objects', (done) => {
      assert.isDefined(analytics.trackEvent('abc123', { category: 'abc' }, { action: 'abc' }, { label: 'abc' }, 'value'))
      done()
    })
  })
})
