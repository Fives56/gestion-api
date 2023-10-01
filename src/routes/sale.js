const express = require("express");
const router = express.Router();
const saleService = require('../services/sale.service');
const { validationResult } = require('express-validator');
const validator = require('../services/validators/sale.validator');

router.get('/', async (req, res) => {
  
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'id';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;

  const sale = await saleService.get(querys);
  res.send(sale)
});

/**POST */
router.post("/", validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const sale = await saleService.createOrUpdate(req.body);
  res.send(sale);
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