const chai = require('chai')
const strategy = require('chai-passport-strategy')

chai.use(strategy)

process.on('unhandledRejection', (err) => {
  console.error(err)
})
