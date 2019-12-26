import chai from 'chai'
import strategy from 'chai-passport-strategy'

chai.use(strategy)

process.on('unhandledRejection', (err) => {
  console.error(err)
})
