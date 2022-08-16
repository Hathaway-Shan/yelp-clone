const { Router } = require('express');
const Restaurant = require('../models/Restaurant');
const router = Router();

module.exports = router.get('/', async (req, res) => {
  const data = await Restaurant.getAll();
  res.json(data);
});
