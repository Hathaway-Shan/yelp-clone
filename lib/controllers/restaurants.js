const { Router } = require('express');
const Restaurant = require('../models/Restaurant');
const router = Router();

module.exports = router.get('/restaurants', async (req, res) => {
  console.log('controller ----->', res.body);
  const data = await Restaurant.getAll();
  res.json(data);
});
