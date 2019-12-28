const chai = require('chai')

const appServer = require('../../app/server')
const setupAPI = require('../../app/server').setupAPI

const assert = chai.assert

describe('API Server', () => {
  let server

  beforeEach(() => {
    server = appServer
  })

  afterEach(() => {
    server.close()
  })

  it('should be defined', (done) => {
    assert.isDefined(server)
    done()
  })

  it('setup middelware should be defined', (done) => {
    assert.isDefined(setupAPI)
    assert.isFunction(setupAPI)
    done()
  })
})
