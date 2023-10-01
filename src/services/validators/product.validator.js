const { body } = require('express-validator');
const db = require('../../models');

const validator = [
    body('name')
      .trim()
      .notEmpty()
      .isLength({ max: 255 })
      .withMessage('The name is required and must be less than 255 characters')
      .custom(async (name, { req }) => {
        const product = await db.Product.findOne({ where: { name: name } });
        if (product && product.id !== req.body.id) {
          throw new Error('The name must be unique');
        }
        return true;
      }),
    body('amount')
      .trim()
      .notEmpty()
      .isLength({ max: 255 }),
    body('price').trim().notEmpty().isNumeric(),
  ];
  
  module.exports = validator;