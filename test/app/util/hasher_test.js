import chai from 'chai'

import hasher from '../../../app/util/hasher'

const assert = chai.assert

describe('Hasher Tests', () => {
  describe('generate', () => {
    it('should generate an encrypted string', (done) => {
      const plainString = 'a string'

      hasher.generate(plainString).then((encrypted) => {
        assert.isString(encrypted)
        assert.notEqual(plainString, encrypted)
        done()
      })
    })
  })

  describe('verify', () => {
    it('should validate an unencrypted string with its encrypted counterpart', (done) => {
      const plainString = 'mypass'

      hasher.generate(plainString).then((encrypted) => {
        hasher.verify(plainString, encrypted).then((valid) => {
          assert.isTrue(valid)
          done()
        })
      })
    })

    it('should yield false for a mismatched string', (done) => {
      const plainString = 'mypass'

      hasher.generate(plainString).then((encrypted) => {
        hasher.verify('some random string', encrypted).then((valid) => {
          assert.isFalse(valid)
          done()
        })
      })
    })
  })
})
