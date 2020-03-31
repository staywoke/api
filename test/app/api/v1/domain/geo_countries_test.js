const chai = require('chai')

const {
  prepareForAPIOutput,
  prepareForElasticSearch
} = require('../../../../../app/api/v1/domain/geo_countries')

const assert = chai.assert

describe('Domain GeoCountries', () => {
  it('prepareForAPIOutput should be defined', () => {
    assert.isDefined(prepareForAPIOutput)
  })

  it('prepareForElasticSearch should be defined', () => {
    assert.isDefined(prepareForElasticSearch)
  })

  it('prepareForAPIOutput should return correct data', () => {
    const output = prepareForAPIOutput({
      _source: {
        id: 1,
        name: 'United States',
        abbr2: 'US',
        abbr3: 'USA',
        fips_code: 'us',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    })

    assert.isDefined(output.name)
    assert.isDefined(output.abbr2)
    assert.isDefined(output.abbr3)
    assert.isDefined(output.fips_code)

    assert.isTrue(output.name === 'United States')

    assert.isUndefined(output.id)
    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('prepareForElasticSearch should return correct', () => {
    const output = prepareForElasticSearch({
      id: 1,
      name: 'United States',
      abbr2: 'US',
      abbr3: 'USA',
      fips_code: 'us',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    })

    assert.isDefined(output.name)
    assert.isDefined(output.abbr2)
    assert.isDefined(output.abbr3)
    assert.isDefined(output.fips_code)

    assert.isTrue(output.id === 1)
    assert.isTrue(output.name === 'United States')

    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })
})
