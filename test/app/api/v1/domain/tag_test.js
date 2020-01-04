const chai = require('chai')

const { prepareForAPIOutput, prepareForElasticSearch } = require('../../../../../app/api/v1/domain/tag')

const assert = chai.assert

describe('Domain Tag', () => {
  it('prepareForAPIOutput should be defined', () => {
    assert.isDefined(prepareForAPIOutput)
  })

  it('prepareForAPIOutput should be defined', () => {
    assert.isDefined(prepareForElasticSearch)
  })

  it('prepareForAPIOutput should return correct data with subcategories', () => {
    const output = prepareForAPIOutput({
      _source: {
        id: 1,
        name: 'Test',
        slug: 'test',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    })

    assert.isDefined(output.name)
    assert.isDefined(output.slug)

    assert.isTrue(output.name === 'Test')
    assert.isTrue(output.slug === 'test')

    assert.isUndefined(output.id)
    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('prepareForElasticSearch should return correct data with subcategories', () => {
    const output = prepareForElasticSearch({
      id: 1,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    })

    assert.isDefined(output.id)
    assert.isDefined(output.name)
    assert.isDefined(output.slug)

    assert.isTrue(output.id === 1)
    assert.isTrue(output.name === 'Test')
    assert.isTrue(output.slug === 'test')

    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })

  it('prepareForElasticSearch should return correct data', () => {
    const output = prepareForElasticSearch({
      id: 1,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    })

    assert.isDefined(output.id)
    assert.isDefined(output.name)
    assert.isDefined(output.slug)

    assert.isTrue(output.id === 1)
    assert.isTrue(output.name === 'Test')
    assert.isTrue(output.slug === 'test')

    assert.isUndefined(output.created_at)
    assert.isUndefined(output.modified_at)
  })
})
