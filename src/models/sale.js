'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'productId'
      });
    }
  }
  Sale.init({
    productId:{
      type: DataTypes.INTEGER,
      unique: true,
    },
    quantity: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};