'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class systemItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.systemTypes, {
        foreignKey: "systemTypeId",
      });
    }
  }
  systemItems.init({
    systemTypeId: DataTypes.INTEGER,
    parentFolderId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    fileAddress: DataTypes.STRING,
    size: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'systemItems',
  });
  return systemItems;
};