const { Router } = require('express');
const UserService = require('../services/UserService');
const oneDayInMS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/session', async (req, res, next) => {
    try {
      const user = await UserService.newSession(req.body);

      res
        .cookie(process.env.COOKIE_NAME, user.authToken(), {
          httpOnly: true,
          maxAge: oneDayInMS,
        })
        .send({ message: 'you have been logged in', user });
    } catch (error) {
      next(error);
    }
  })

  .delete('/session', async (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .send({ message: 'you have been logged out' });
    } catch (error) {
      next(error);
    }
  });
