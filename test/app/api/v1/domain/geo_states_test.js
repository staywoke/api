const chai = require('chai')
const sinon = require('sinon')

const client = require('../../../../../app/elasticsearch/client')

const { GeoStateDomain } = require('../../../../../app/api/v1/domain')

const assert = chai.assert

describe('Domain GeoStates', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('prepareForAPIOutput should be defined', () => {
    assert.isDefined(GeoStateDomain.prepareForAPIOutput)
  })

  it('prepareForElasticSearch should be defined', () => {
    assert.isDefined(GeoStateDomain.prepareForElasticSearch)
  })

  it('prepareForAPIOutput should return correct data', () => {
    const output = GeoStateDomain.prepareForAPIOutput({
      _source: {
        id: 1,
        name: 'New York',
        abbr: 'NY',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    })

    assert.isDefined(output.name)
    assert.isDefined(output.abbr)

    assert.isTrue(output.name === 'New York')

    assert.isUndefined(output.id)
    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('prepareForElasticSearch should return correct', () => {
    const output = GeoStateDomain.prepareForElasticSearch({
      id: 1,
      country_id: 1,
      type: 'state',
      name: 'New York',
      abbr: 'NY',
      code: 'ny',
      fips_code: 'ny',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    })

    assert.isDefined(output.id)
    assert.isDefined(output.country_id)
    assert.isDefined(output.type)
    assert.isDefined(output.name)
    assert.isDefined(output.abbr)
    assert.isDefined(output.code)
    assert.isDefined(output.fips_code)

    assert.isTrue(output.id === 1)
    assert.isTrue(output.name === 'New York')

    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('getStates should be defined', () => {
    assert.isDefined(GeoStateDomain.getStates)
  })

  describe('getStates', () => {
    beforeEach(() => {
      this.elasticsearchStub = this.sandbox.stub(client, 'search')
    })

    afterEach(() => {
      client.search.restore()
    })

    it('should return results', (done) => {
      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 50, hits: [] }
      }))

      GeoStateDomain.getStates()
        .then((results) => {
          assert.isDefined(results)
          done()
        })
    })

    it('should throw error', (done) => {
      this.elasticsearchStub.returns(Promise.reject('Fake Error'))

      GeoStateDomain.getStates()
        .then((results) => {
          assert.isDefined(results)
          assert.isDefined(results.errors)
          assert.isDefined(results.data)

          assert.isTrue(results.errors.length === 1)
          assert.isTrue(results.errors[0] === 'Fake Error')
          assert.isTrue(results.data === null)

          done()
        })
    })
  })
})
