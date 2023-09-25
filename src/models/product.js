'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.hasMany(models.Sale);
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    price: {
      type: DataTypes.FLOAT
    },
    amount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};