const express = require("express");
const router = express.Router();
const productService = require('../services/product.service');
const { validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'name';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;
  querys.category = req.query.category;

  const product = await productService.get(querys);
  res.send(product)
});

/**POST */
router.post("/", async (req, res) => {
 /*  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  } */
  const product = await productService.createOrUpdate(req.body);
  res.send(product);
});

/**PUT */
router.put("/:id", async (req, res) => {
 /*  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  } */
  const product = await productService.createOrUpdate(req.body);
  res.send(product);
});

/** DELETE */
router.delete('/:id', async (req, res) => {
  res.send(await productService.destroy(req.params.id));
});

module.exports = router;