const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator')
const validator = require('../services/validators/food.validator');
const foodService = require("../services/food.service");

/** GET */
router.get("/", async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'name';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;
  querys.category = req.query.category;

  const foods = await foodService.get(querys);
  res.send(foods);
});

/** POST */
router.post("/", validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const food = await foodService.createOrUpdate(req.body);
  res.send(food);
});

/** PUT */
router.put("/:id", validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const food = await foodService.createOrUpdate(req.body);
  res.send(food);
});

/** DELETE */
router.delete("/:id", async (req, res) => {
  res.send(await foodService.del(req.params.id));
});

module.exports = router;
