module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('user_settings_profile', [
      {
        user_id: 1,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id', 'modified_date']
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
    return queryInterface.bulkDelete('user_settings_profile', null, {})
  }
}
