const { body } = require('express-validator');
const db = require('./../../models');

const validator = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage('The name is required and must be less than 255 characters')
    .custom(async (name, { req }) => {
      const sale = await db.Sale.findOne({ where: { name: name } });
      if (sale && sale.id !== req.body.id) {
        throw new Error('The name is unique');
      }
      return true;
    }),
  body('productId').trim().notEmpty().isNumeric(),
  body('quantity').trim().notEmpty().isNumeric(),
  body('date').isDate(),
];

module.exports = validator;