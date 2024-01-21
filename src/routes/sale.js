const express = require("express");
const router = express.Router();
const saleService = require('../services/sale.service');
const { validationResult } = require('express-validator');
const validator = require('../services/validators/sale.validator');

/**GET all sales */
router.get('/', async (req, res) => {
  
  const querys = {};
  querys.order = req.query.order || 'id';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;

  const sales = await saleService.get(querys, req.query);
  res.send(sales);
});

router.get('/months', async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'id';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;
  
  const sales = await saleService.getMonths(querys);
  res.send(sales);
});


/**POST */
/* validator, */
router.post("/",  async (req, res) => {
 /*  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  } */
  const sale = await saleService.createOrUpdate(req.body);
  res.status(201).send(sale);
});

/**PUT */
router.put("/:id", validator, async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const sale = await saleService.createOrUpdate(req.body);
  res.send(sale);
});

/** DELETE */
router.delete('/:id', async (req, res) => {
  res.send(await saleService.destroy(req.params.id));
});

module.exports = router;