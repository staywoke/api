import chai from 'chai'

import logger from '../../app/logger'

const assert = chai.assert

describe('Logger', () => {
  it('should be defined', (done) => {
    assert.isDefined(logger)
    assert.isFunction(logger.debug)
    assert.isFunction(logger.error)
    assert.isFunction(logger.info)
    assert.isFunction(logger.log)
    assert.isFunction(logger.warn)
    done()
  })

  describe('Call Functions', () => {
    it('should return true', (done) => {
      assert.isTrue(logger.debug())
      assert.isTrue(logger.error())
      assert.isTrue(logger.info())
      assert.isTrue(logger.log())
      assert.isTrue(logger.warn())
      done()
    })
  })
})
