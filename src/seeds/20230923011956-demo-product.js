'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'Producto 1',
        price: 9.99,
        amount: 100,
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        name: 'Producto 2',
        price: 19.99,
        amount: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
