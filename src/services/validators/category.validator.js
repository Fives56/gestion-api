const { body } = require('express-validator');
const db = require('./../../models');

const validator = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage('The name is required and must be less than 255 characters')
    .custom(async (name, { req }) => {
      const category = await db.Category.findOne({ where: { name: name } });
      if (category && category.id !== req.body.id) {
        throw new Error('The name is unique');
      }
      return true;
    }),
];

module.exports = validator;