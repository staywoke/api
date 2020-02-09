module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('geo_countries', [
      {
        name: 'United States',
        abbr2: 'US',
        abbr3: 'USA',
        fips_code: 'US',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'United States Minor Outlying Islands',
        abbr2: 'UM',
        abbr3: 'UMI',
        fips_code: '',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Virgin Islands, U.S.',
        abbr2: 'VI',
        abbr3: 'VIR',
        fips_code: 'VQ',
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['name', 'abbr2', 'abbr3', 'fips_code', 'modified_date']
    }).catch((err) => {
      if (err && err.errors) {
        for (let i = 0; i < err.errors.length; i++) {
          console.error(`\n× SEED ERROR: ${err.errors[i].type} ${err.errors[i].message} ${err.errors[i].path} ${err.errors[i].value}\n`)
        }
      } else if (err && err.message) {
        console.error(`\n× SEED ERROR: ${err.message}\n`)
      }
    })
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('geo_countries', null, {})
  }
}
