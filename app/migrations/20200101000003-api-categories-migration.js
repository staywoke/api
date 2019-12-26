import { CategoryModel as Model } from '../models'

export default {
  up: (queryInterface) => {
    return queryInterface.createTable(Model.tableName, Model.attributes).then(() => {
      for (var i = 0; i < Model.options.indexes.length; i++) {
        queryInterface.addIndex(Model.tableName, Model.options.indexes[i])
      }
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(Model.tableName)
  }
}
