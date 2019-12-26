import sequelize from '../../app/config/sequelize'

beforeEach((done) => {
  sequelize.sync({ force: true }).then(() => {
    done()
  })
})
