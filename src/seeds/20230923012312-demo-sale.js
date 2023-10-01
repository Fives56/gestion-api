'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Sales', [
      {
        productId: 1,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Sales', null, {});
  }
};
