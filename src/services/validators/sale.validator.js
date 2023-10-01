const { body } = require('express-validator');
const db = require('./../../models');

const validator = [
  body('productId').trim().notEmpty().isNumeric(),
  body('quantity').trim().notEmpty().isNumeric(),
];

module.exports = validator;