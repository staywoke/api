import chai from 'chai'

import { UtilDomain } from '../../../../../app/api/v1/domain'

const assert = chai.assert

describe('Domain Util', () => {
  it('should be defined', () => {
    assert.isDefined(UtilDomain)
  })

  describe('normalizeCommaSeparatedIntegers', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.normalizeCommaSeparatedIntegers)
    })

    it('should return an array of integers from a comma-separated string of numbers', () => {
      const str = '1,5,6'
      const expected = [1, 5, 6]

      assert.deepEqual(UtilDomain.normalizeCommaSeparatedIntegers(str), expected)
    })

    it('should return null for invalid input', () => {
      const str = 'foo'
      const expected = null

      assert.deepEqual(UtilDomain.normalizeCommaSeparatedIntegers(str), expected)
    })

    it('should prune out invalid input', () => {
      const str = '1,foo,6'
      const expected = [1, 6]

      assert.deepEqual(UtilDomain.normalizeCommaSeparatedIntegers(str), expected)
    })
  })

  describe('sortByKeys', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.sortByKeys)
    })

    it('should return an sorted keys', () => {
      const unsorted = {
        b: 1,
        a: 2,
        c: 3
      }
      const expected = {
        a: 2,
        b: 1,
        c: 3
      }

      assert.deepEqual(UtilDomain.sortByKeys(unsorted), expected)
    })
  })
})
