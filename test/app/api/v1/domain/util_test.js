const chai = require('chai')

const { UtilDomain } = require('../../../../../app/api/v1/domain')

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

  describe('parseBoolean', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseBoolean)
    })

    it('should parse numbers', () => {
      assert.deepEqual(UtilDomain.parseBoolean(0), false)
      assert.deepEqual(UtilDomain.parseBoolean(1), true)
    })

    it('should parse lowercase strings', () => {
      assert.deepEqual(UtilDomain.parseBoolean('0'), false)
      assert.deepEqual(UtilDomain.parseBoolean('n'), false)
      assert.deepEqual(UtilDomain.parseBoolean('no'), false)

      assert.deepEqual(UtilDomain.parseBoolean('1'), true)
      assert.deepEqual(UtilDomain.parseBoolean('y'), true)
      assert.deepEqual(UtilDomain.parseBoolean('yes'), true)
    })

    it('should parse uppercase strings', () => {
      assert.deepEqual(UtilDomain.parseBoolean('0'), false)
      assert.deepEqual(UtilDomain.parseBoolean('N'), false)
      assert.deepEqual(UtilDomain.parseBoolean('NO'), false)

      assert.deepEqual(UtilDomain.parseBoolean('1'), true)
      assert.deepEqual(UtilDomain.parseBoolean('Y'), true)
      assert.deepEqual(UtilDomain.parseBoolean('YES'), true)
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseBoolean(''), null)
      assert.deepEqual(UtilDomain.parseBoolean(2), null)
      assert.deepEqual(UtilDomain.parseBoolean('junk'), null)
    })
  })

  describe('parseEmail', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseEmail)
    })

    it('should parse emails', () => {
      assert.deepEqual(UtilDomain.parseEmail('my@email.com'), 'my@email.com')
    })

    it('should lowercase emails', () => {
      assert.deepEqual(UtilDomain.parseEmail('My@Email.com'), 'my@email.com')
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseEmail(''), null)
      assert.deepEqual(UtilDomain.parseEmail(2), null)
      assert.deepEqual(UtilDomain.parseEmail('junk'), null)
    })
  })

  describe('parseFloat', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseFloat)
    })

    it('should parse floats', () => {
      assert.deepEqual(UtilDomain.parseFloat(123.45), 123.45)
      assert.deepEqual(UtilDomain.parseFloat('123.45'), 123.45)
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseFloat(''), null)
      assert.deepEqual(UtilDomain.parseFloat('junk'), null)
    })
  })

  describe('parseInt', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseInt)
    })

    it('should parse integers', () => {
      assert.deepEqual(UtilDomain.parseInt(123.45), 123)
      assert.deepEqual(UtilDomain.parseInt('123.45'), 123)
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseInt(''), null)
      assert.deepEqual(UtilDomain.parseInt('junk'), null)
    })
  })

  describe('parseString', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseString)
    })

    it('should parse string', () => {
      assert.deepEqual(UtilDomain.parseString(123), '123')
      assert.deepEqual(UtilDomain.parseString(' full trim '), 'full trim')
      assert.deepEqual(UtilDomain.parseString(' left trim'), 'left trim')
      assert.deepEqual(UtilDomain.parseString('right trim '), 'right trim')
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseString(' '), null)
      assert.deepEqual(UtilDomain.parseString(''), null)
    })
  })

  describe('parseURL', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.parseURL)
    })

    it('should parse URL', () => {
      assert.deepEqual(UtilDomain.parseURL('https://website.com'), 'https://website.com')
      assert.deepEqual(UtilDomain.parseURL('https://www.website.com'), 'https://www.website.com')
      assert.deepEqual(UtilDomain.parseURL('https://www.website.com/some/path'), 'https://www.website.com/some/path')
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.parseURL(''), null)
      assert.deepEqual(UtilDomain.parseURL(2), null)
      assert.deepEqual(UtilDomain.parseURL('junk'), null)
      assert.deepEqual(UtilDomain.parseURL('website.com'), null)
    })
  })

  describe('getGrade', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.getGrade)
    })

    it('should parse grade', () => {
      assert.deepEqual(UtilDomain.getGrade(50), { letter: 'F', marker: 'f', class: 'f' })
      assert.deepEqual(UtilDomain.getGrade(61), { letter: 'D-', marker: 'd-minus', class: 'd' })
      assert.deepEqual(UtilDomain.getGrade(65), { letter: 'D', marker: 'd', class: 'd' })
      assert.deepEqual(UtilDomain.getGrade(68), { letter: 'D+', marker: 'd-plus', class: 'd' })
      assert.deepEqual(UtilDomain.getGrade(71), { letter: 'C-', marker: 'c-minus', class: 'c' })
      assert.deepEqual(UtilDomain.getGrade(75), { letter: 'C', marker: 'c', class: 'c' })
      assert.deepEqual(UtilDomain.getGrade(78), { letter: 'C+', marker: 'c-plus', class: 'c' })
      assert.deepEqual(UtilDomain.getGrade(81), { letter: 'B-', marker: 'b-minus', class: 'b' })
      assert.deepEqual(UtilDomain.getGrade(85), { letter: 'B', marker: 'b', class: 'b' })
      assert.deepEqual(UtilDomain.getGrade(88), { letter: 'B+', marker: 'b-plus', class: 'b' })
      assert.deepEqual(UtilDomain.getGrade(91), { letter: 'A-', marker: 'a-minus', class: 'a' })
      assert.deepEqual(UtilDomain.getGrade(95), { letter: 'A', marker: 'a', class: 'a' })
      assert.deepEqual(UtilDomain.getGrade(99), { letter: 'A+', marker: 'a-plus', class: 'a' })
    })

    it('should return null for invalid input', () => {
      assert.deepEqual(UtilDomain.getGrade(''), null)
    })

    it('should correct scores if out of range', () => {
      assert.deepEqual(UtilDomain.getGrade(-1), { letter: 'F-', marker: 'f-minus', class: 'f-minus' })
      assert.deepEqual(UtilDomain.getGrade(101), { letter: 'A+', marker: 'a-plus', class: 'a' })
    })
  })

  describe('createSlug', () => {
    it('should exist', () => {
      assert.isFunction(UtilDomain.createSlug)
    })

    it('should create slug', () => {
      assert.deepEqual(UtilDomain.createSlug('St. Louis'), 'st-louis')
      assert.deepEqual(UtilDomain.createSlug('More than One Word'), 'more-than-one-word')
      assert.deepEqual(UtilDomain.createSlug('Lēéróy Jéñkíñs'), 'leeroy-jenkins')
      assert.deepEqual(UtilDomain.createSlug('January 1st, 2020'), 'january-1st-2020')
    })
  })
})
