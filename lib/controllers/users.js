const { Router } = require('express');
const UserService = require('../services/userService');

// const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const router = Router();

module.exports = router.post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
