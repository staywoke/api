const sequelize = require('../../app/config/sequelize')

beforeEach((done) => {
  sequelize.sync({ force: true }).then(() => {
    done()
  })
})
