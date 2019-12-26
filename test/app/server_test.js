import chai from 'chai'

import appServer, { setupAPI } from '../../app/server'

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
