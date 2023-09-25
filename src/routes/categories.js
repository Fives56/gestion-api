const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator')
const  validator = require('../services/validators/category.validator');
const categoryService = require('../services/category.service');

/** GET */
router.get('/', async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'name';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;

  const categories = await categoryService.get(querys);
  res.send(categories);
});

/** GET */
router.get('/:id', async (req, res) => {
  const category = await categoryService.getOne(req.params.id);
  res.send(category);
});

/** POST */
router.post('/', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const category = await categoryService.createOrUpdate(req.body);
  res.send(category);
});

/** PUT */
router.put('/:id', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const category = await categoryService.createOrUpdate(req.body);
  res.send(category);
});

/** DELETE */
router.delete('/:id',  async (req, res) => {
  res.send(await categoryService.del(req.params.id));
});

module.exports = router;