const express = require("express");
const router = express.Router();
const productService = require('../services/product.service');
const { validationResult } = require('express-validator');
const validator = require('../services/validators/product.validator');


/**GET */
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

/**GET */
/* router.get('/:id', async (req, res) => {
  const product = await productService.getPoductById(req.params.id);
  res.send(product)
}); */

/**Get all sales of a product */
router.get('/:id/sales', async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'quantity';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;
  querys.category = req.query.category;

  try {
    const sales = await productService.getProductSales(querys, req.params.id);
    res.json(sales)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'An error occurred while retrieving sales' })
  }
})

router.get('/sales', async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'name';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;
  querys.category = req.query.category;
  
  const product = await productService.getSoldProducts(querys);
  res.send(product)
});


/**POST */
router.post("/", validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const product = await productService.createOrUpdate(req.body);
  res.status(201).send(product);
});

/**PUT */
router.put("/:id", validator, async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const product = await productService.createOrUpdate(req.body);
  res.send(product);
});

/** DELETE */
router.delete('/:id', async (req, res) => {
  res.send(await productService.destroy(req.params.id));
});

module.exports = router;