const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', authenticate, authorize, async (req, res, next) => {
    try {
      const secrets = [
        {
          id: '1',
          title: 'Gettin jiggy widdit',
          description: 'Its litty',
        },
      ];

      res.send(secrets);
    } catch (error) {
      next(error);
    }
  });

//   .post('/', async (req, res, next) => {
//     try {
//       const { userId } = req.user;
//       const { title, description } = req.body;
//       const secret = await Secret.create({ userId, title, description });
//       res.send(secret);
//     } catch (error) {
//       next(error);
//     }
//   });
