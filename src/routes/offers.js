const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator')
const validator = require('../services/validators/offer.validator');
const offerService = require('../services/offer.service');

/** GET */
router.get('/', async (req, res) => {
  const querys = {};
  querys.search = req.query.search;
  querys.order = req.query.order || 'name';
  querys.direction = req.query.direction || 'ASC';
  querys.pagination = req.query.pagination != 'false';
  querys.limit = req.query.limit || 10;
  querys.offset = req.query.offset || 0;

  const offers = await offerService.get(querys);
  res.send(offers);
});

/** POST */
router.post('/', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const offer = await offerService.createOrUpdate(req.body);
  res.send(offer);
});

/** PUT */
router.put('/:id', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const offer = await offerService.createOrUpdate(req.body);
  res.send(offer);
});

/** DELETE */
router.delete('/:id', async (req, res) => {
  res.send(await offerService.del(req.params.id));
});

module.exports = router;