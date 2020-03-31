const chai = require('chai')

const {
  prepareForAPIOutput,
  prepareForElasticSearch
} = require('../../../../../app/api/v1/domain/geo_cities')

const assert = chai.assert

describe('Domain GeoCities', () => {
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
        country_id: 1,
        state_id: 1,
        name: 'New York',
        fips_state_code: '',
        fips_place_code: '',
        latitude: 40,
        longitude: 90,
        coordinate: 'POINT(40, 90)',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    })

    assert.isDefined(output.country_id)
    assert.isDefined(output.state_id)
    assert.isDefined(output.name)
    assert.isDefined(output.fips_state_code)
    assert.isDefined(output.fips_place_code)
    assert.isDefined(output.latitude)
    assert.isDefined(output.longitude)
    assert.isDefined(output.coordinate)

    assert.isTrue(output.name === 'New York')

    assert.isUndefined(output.id)
    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('prepareForElasticSearch should return correct', () => {
    const output = prepareForElasticSearch({
      id: 1,
      country_id: 1,
      state_id: 1,
      name: 'New York',
      fips_state_code: '',
      fips_place_code: '',
      latitude: 40,
      longitude: 90,
      coordinate: 'POINT(40, 90)',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    })

    assert.isDefined(output.country_id)
    assert.isDefined(output.state_id)
    assert.isDefined(output.name)
    assert.isDefined(output.fips_state_code)
    assert.isDefined(output.fips_place_code)
    assert.isDefined(output.latitude)
    assert.isDefined(output.longitude)
    assert.isDefined(output.coordinate)

    assert.isTrue(output.id === 1)
    assert.isTrue(output.name === 'New York')

    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })
})
