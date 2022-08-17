const { Router } = require('express');
const Restaurant = require('../models/Restaurant');
const authenticate = require('../middleware/authenticate');
const router = Router();

module.exports = router
  .get('/', async (req, res) => {
    const data = await Restaurant.getAll();
    res.json(data);
  })
  .get('/:restId', async (req, res) => {
    const data = await Restaurant.getById(req.params.restId);

    res.json(data);
  })
  .post('/:restId/reviews', authenticate, async (req, res, next) => {
    try {
      const data = await Restaurant.insert(req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .delete('/reviews/:id', authenticate, async (req, res, next) => {
    try {
      const data = await Restaurant.deleteReview(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
