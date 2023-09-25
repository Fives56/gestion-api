const { body } = require('express-validator');
const db = require('./../../models');

const validator = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage('The name is required and must be less than 255 characters')
    .custom(async (name, { req }) => {
      const food = await db.Food.findOne({ where: { name: name } });
      if (food && food.id !== req.body.id) {
        throw new Error('The name is unique');
      }
      return true;
    }),
  body('amount')
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .custom((amount) => {
      const amountAux = [
        [amount.slice(-1), amount.slice(0, -1)],
        [amount.slice(-2), amount.slice(0, -2)],
      ];
      if (
        (!isNaN(amountAux[0][1]) &&
          ['g', 'l'].includes(amountAux[0][0].toLowerCase())) ||
        (!isNaN(amountAux[1][1]) &&
          ['kg', 'ml'].includes(amountAux[1][0].toLowerCase()))
      ) {
        return true;
      }
      throw new Error('Amount must by kg, g, L or ml');
    }),
  body('price').trim().notEmpty().isNumeric(),
  body('picture').trim().notEmpty().isLength({ max: 255 }).isURL(),
  body('categoryId').trim().notEmpty().isNumeric(),
];

module.exports = validator;